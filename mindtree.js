class MindTree {
  constructor(options) {
    this.container =
      typeof options.container === 'string'
        ? document.querySelector(options.container)
        : options.container;

    this.data = options.data || [];

    this.direction =
      options.direction || 'right';

    this.showToggle =
      options.showToggle !== false;

    this.nodeColor =
      options.nodeColor || '#ffffff';

    this.fontSize =
      options.fontSize || 14;

    this.fontColor =
      options.fontColor || '#222';

    this.textAlign =
      options.textAlign || 'center';

    this.borderStyle =
      options.borderStyle || 'none';//'1px solid #999';

    this.lineStyle =
      options.lineStyle || {};

    this.maxWidth =
      options.maxWidth || 0;

    this.writingMode =
      options.writingMode || [];

    this.fontFamily =
      options.fontFamily || '';

    this.showOutline =
      options.showOutline || true;

    this.outlineCss =
      options.outlineCss || {};

    this.outlineHoverCss =
      options.outlineHoverCss || {};

    this.nodeWidth = 120;
    this.nodeHeight = 40;

    this.hGap = 80;
    this.vGap = 20;

    this.scale = 1;

    this.translateX = 0;
    this.translateY = 0;

    this.isDragging = false;

    this.startX = 0;
    this.startY = 0;

    this.dragMoved = false;

    this.nodes = new Map();

    this.buildTree();

    this.render();
  }

  buildTree() {
    this.nodes.clear();

    this.data.forEach(item => {

      item.children = [];

      item.collapsed =
        item.collapsed || false;

      this.nodes.set(item.id, item);
    });

    this.roots = [];

    this.data.forEach(item => {

      if (item.parentId == null) {

        this.roots.push(item);

      } else {

        const parent =
          this.nodes.get(item.parentId);

        if (parent) {

          parent.children.push(item);
        }
      }
    });
  }

  toggle(node) {

    node.collapsed = !node.collapsed;

    this.render();
  }

  render() {

    this.container.innerHTML = '';

    const svgNS =
      'http://www.w3.org/2000/svg';

    const wrapper =
      document.createElement('div');

    wrapper.style.position = 'relative';

    wrapper.style.width = '100%';

    wrapper.style.height = '100%';

    wrapper.style.overflow = 'hidden';

    wrapper.style.cursor = 'grab';

    //wrapper.style.background = '#f5f5f5';

    this.wrapper = wrapper;

    const viewport =
      document.createElement('div');

    viewport.style.position = 'absolute';

    viewport.style.left = '0';

    viewport.style.top = '0';

    viewport.style.transformOrigin =
      '0 0';

    viewport.style.transform =
      `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale})`;

    this.viewport = viewport;

    wrapper.appendChild(viewport);

    const svg =
      document.createElementNS(
        svgNS,
        'svg'
      );

    svg.style.position = 'absolute';

    svg.style.left = '0';

    svg.style.top = '0';

    svg.style.width = '5000px';

    svg.style.height = '5000px';

    svg.style.pointerEvents = 'none';

    viewport.appendChild(svg);

    const treeLayer =
      document.createElement('div');

    treeLayer.style.position = 'relative';

    treeLayer.style.width = '5000px';

    treeLayer.style.height = '5000px';

    viewport.appendChild(treeLayer);

    this.container.appendChild(wrapper);

    this.bindEvents();

    let startY = 20;

    this.roots.forEach(root => {

      this.layout(root, 0);

      var treeBottom =
        this.drawNode(
          root,
          treeLayer,
          svg,
          200,
          startY,
          this.nodeColor
        );

      startY = treeBottom + 120;
    });

    if (this.showOutline) {
      this.renderOutline();
    }
  }

  bindEvents() {

    this.wrapper.onwheel = e => {

      e.preventDefault();

      const rect =
        this.wrapper.getBoundingClientRect();

      const mouseX =
        e.clientX - rect.left;

      const mouseY =
        e.clientY - rect.top;

      const worldX =
        (mouseX - this.translateX) /
        this.scale;

      const worldY =
        (mouseY - this.translateY) /
        this.scale;

      const delta =
        e.deltaY > 0 ? 0.9 : 1.1;

      this.scale *= delta;

      this.scale = Math.max(
        0.2,
        Math.min(3, this.scale)
      );

      this.translateX =
        mouseX - worldX * this.scale;

      this.translateY =
        mouseY - worldY * this.scale;

      this.updateTransform();
    };

    this.wrapper.onmousedown = e => {

      this.isDragging = true;

      this.dragMoved = false;

      this.startX = e.clientX;

      this.startY = e.clientY;

      this.wrapper.style.cursor =
        'grabbing';
    };

    window.onmouseup = () => {

      this.isDragging = false;

      this.wrapper.style.cursor =
        'grab';

      setTimeout(() => {

        this.dragMoved = false;
      }, 0);
    };

    window.onmousemove = e => {

      if (!this.isDragging) return;

      var dx =
        e.clientX - this.startX;

      var dy =
        e.clientY - this.startY;

      if (Math.abs(dx) > 3 ||
          Math.abs(dy) > 3) {
        this.dragMoved = true;
      }

      this.translateX += dx;

      this.translateY += dy;

      this.startX = e.clientX;

      this.startY = e.clientY;

      this.updateTransform();
    };
  }

  updateTransform() {

    this.viewport.style.transform =
      `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale})`;
  }

  renderOutline() {

    var old =
      this.wrapper.querySelector(
        '.mind-outline'
      );

    if (old) old.remove();

    var panel =
      document.createElement('div');

    panel.className = 'mind-outline';

    panel.style.position = 'absolute';

    panel.style.left = '12px';

    panel.style.top = '12px';

    panel.style.zIndex = '10';

    panel.style.display = 'flex';

    panel.style.flexDirection = 'column';

    panel.style.gap = '6px';

    var defaultCss = {
      padding: '6px 14px',
      borderRadius: '6px',
      background: 'rgba(255,255,255,0.85)',
      color: '#333',
      fontSize: '13px',
      cursor: 'pointer',
      userSelect: 'none',
      boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
      whiteSpace: 'nowrap',
      transition: 'background 0.2s, color 0.2s'
    };

    var defaultHoverCss = {
      color: '#2478d4'
    };

    var mergedCss =
      Object.assign({}, defaultCss, this.outlineCss);

    var mergedHoverCss =
      Object.assign({}, defaultHoverCss, this.outlineHoverCss);

    var tree = this;

    this.roots.forEach(function(root) {

      var item =
        document.createElement('div');

      item.textContent = root.label;

      Object.keys(mergedCss).forEach(
        function(k) {
          item.style[k] = mergedCss[k];
        }
      );

      if (root.backgroundColor) {
        item.style.background =
          root.backgroundColor;
      }

      item.onmouseenter = function() {
        Object.keys(mergedHoverCss).forEach(
          function(k) {
            item.style[k] = mergedHoverCss[k];
          }
        );
      };

      item.onmouseleave = function() {
        Object.keys(mergedCss).forEach(
          function(k) {
            item.style[k] = mergedCss[k];
          }
        );
        if (root.backgroundColor) {
          item.style.background =
            root.backgroundColor;
        }
      };

      item.onclick = function(e) {

        e.stopPropagation();

        tree.focusNode(root);
      };

      panel.appendChild(item);
    });

    this.wrapper.appendChild(panel);
  }

  focusNode(node) {

    this.scale = 1;

    var wrapRect =
      this.wrapper.getBoundingClientRect();

    var centerX =
      node.x + node.actualWidth / 2;

    var centerY =
      node.y + node.actualHeight / 2;

    this.translateX = 0;
      //wrapRect.width / 2 - centerX;

    this.translateY =
      wrapRect.height / 2 - centerY;

    this.updateTransform();
  }

  layout(node, depth) {

    node.depth = depth;

    if (
      node.collapsed ||
      !node.children.length
    ) {

      node.subtreeHeight = 1;

      return 1;
    }

    let total = 0;

    node.children.forEach(child => {

      total += this.layout(
        child,
        depth + 1
      );
    });

    node.subtreeHeight = total;

    return total;
  }

  drawNode(
    node,
    layer,
    svg,
    x,
    y,
    inheritColor
  ) {

    node.x = x;

    node.y = y;

    var depth = node.depth || 0;

    var wm = this.writingMode[depth]
      || this.writingMode[this.writingMode.length - 1]
      || 'horizontal-tb';

    var isVertical =
      wm === 'vertical-rl'
      || wm === 'vertical-lr';

    const div =
      document.createElement('div');

    div.dataset.type = 'node';

    div.style.position = 'absolute';

    div.style.writingMode = wm;

    if (this.maxWidth) {
      div.style.maxWidth =
        this.maxWidth + 'px';
    }

    div.style.whiteSpace =
      this.maxWidth ? 'normal' : 'nowrap';

    div.style.textAlign =
      this.textAlign;

    div.style.border =
      this.borderStyle;

    div.style.borderRadius = '8px';

    var effectiveColor =
      node.backgroundColor ||
      inheritColor ||
      this.nodeColor;

    div.style.background =
      effectiveColor;

    div.style.color =
      this.fontColor;

    div.style.fontSize =
      this.fontSize + 'px';

    if (this.fontFamily) {
      div.style.fontFamily =
        this.fontFamily;
    }

    div.style.cursor = 'pointer';

    div.style.userSelect = 'none';

    div.style.boxSizing =
      'border-box';

    div.style.boxShadow =
      '0 2px 6px rgba(0,0,0,0.08)';

    div.style.padding = '6px 10px';

    div.innerHTML = node.label;

    div.style.left = x + 'px';

    div.style.top = y + 'px';

    div.onclick = e => {

      e.stopPropagation();

      if (this.dragMoved) return;

      if (node.children.length) {

        this.toggle(node);
      }
    };

    layer.appendChild(div);

    // 测量实际尺寸并记录到 node（除以 scale 还原逻辑像素）
    var rect = div.getBoundingClientRect();
    node.actualWidth = rect.width / this.scale;
    node.actualHeight = rect.height / this.scale;
    node._div = div;

    var btn = null;

    if (
      this.showToggle &&
      node.children.length
    ) {

      btn =
        document.createElement('div');

      btn.dataset.type = 'toggle';

      btn.innerHTML =
        node.collapsed ? '+' : '-';

      btn.style.position = 'absolute';

      btn.style.writingMode = 'horizontal-tb';

      btn.style.right = '-8px';

      btn.style.top = '50%';

      btn.style.transform =
        'translateY(-50%)';

      btn.style.width = '18px';

      btn.style.height = '18px';

      btn.style.lineHeight = '16px';

      btn.style.textAlign = 'center';

      btn.style.borderRadius = '50%';

      btn.style.background = '#5B8FF9';

      btn.style.color = '#fff';

      btn.style.fontSize = '12px';

      btn.style.cursor = 'pointer';

      btn.style.userSelect = 'none';

      btn.onclick = e => {

        e.stopPropagation();

        if (this.dragMoved) return;

        this.toggle(node);
      };

      div.appendChild(btn);
      node._btn = btn;
    }

    if (
      node.collapsed ||
      !node.children.length
    ) {
      return y + node.actualHeight;
    }

    var maxBottom = y + node.actualHeight;

    var nextChildY = y;
    var nextChildX = x;

    // 收集子节点信息，延迟画线
    var childInfos = [];

    node.children.forEach(child => {

      var childX = x;
      var childY = y;

      if (this.direction === 'right') {

        childX =
          x +
          node.actualWidth +
          this.hGap;

        childY = nextChildY;

      }

      else if (
        this.direction === 'left'
      ) {

        childX =
          x -
          (child.actualWidth || this.nodeWidth) -
          this.hGap;

        childY = nextChildY;
      }

      else if (
        this.direction === 'down'
      ) {

        childX = nextChildX;

        childY =
          y +
          node.actualHeight +
          this.vGap;
      }

      else if (
        this.direction === 'up'
      ) {

        childX = nextChildX;

        childY =
          y -
          (child.actualHeight || this.nodeHeight) -
          this.vGap;
      }

      var childResult =
        this.drawNode(
          child,
          layer,
          svg,
          childX,
          childY,
          effectiveColor
        );

      maxBottom =
        Math.max(maxBottom, childResult);

      if (
        this.direction === 'right' ||
        this.direction === 'left'
      ) {

        nextChildY =
          childResult + this.vGap;

      } else {

        nextChildX =
          childX +
          (child.actualWidth || this.nodeWidth) +
          this.hGap;
      }

      childInfos.push({
        child: child,
        childX: childX
      });
    });

    // 垂直居中对齐
    var isVerticalDir =
      this.direction === 'right' ||
      this.direction === 'left';

    if (isVerticalDir) {
      var childrenH = maxBottom - y;
      var parentH = node.actualHeight;

      if (childrenH > parentH) {
        // 子树更高：父节点下移居中
        var offset = (childrenH - parentH) / 2;
        node.y = y + offset;
        div.style.top = node.y + 'px';
      } else if (parentH > childrenH) {
        // 父节点更高：子树下移居中
        var offset = (parentH - childrenH) / 2;
        node.children.forEach(function(child) {
          this._shiftSubtree(child, offset);
        }.bind(this));
        maxBottom = y + parentH;
      }
    }

    // 居中调整后再画线
    childInfos.forEach(function(info) {
      this.drawLine(
        svg,
        x,
        node.y,
        info.childX,
        info.child.y,
        node,
        info.child
      );
    }.bind(this));

    return maxBottom;
  }

  _shiftSubtree(node, dy) {

    node.y += dy;

    if (node._div) {
      node._div.style.top = node.y + 'px';
    }

    if (
      !node.collapsed &&
      node.children.length
    ) {
      node.children.forEach(function(child) {
        this._shiftSubtree(child, dy);
      }.bind(this));
    }
  }

  drawLine(
    svg,
    x1,
    y1,
    x2,
    y2,
    parentNode,
    childNode
  ) {

    const svgNS =
      'http://www.w3.org/2000/svg';

    const path =
      document.createElementNS(
        svgNS,
        'path'
      );

    var pw = parentNode
      ? parentNode.actualWidth
      : this.nodeWidth;

    var ph = parentNode
      ? parentNode.actualHeight
      : this.nodeHeight;

    var cw = childNode
      ? (childNode.actualWidth || this.nodeWidth)
      : this.nodeWidth;

    var ch = childNode
      ? (childNode.actualHeight || this.nodeHeight)
      : this.nodeHeight;

    const startX =
      x1 + pw;

    const startY =
      y1 + ph / 2;

    const endX =
      x2;

    const endY =
      y2 + ch / 2;

    const d = `
      M ${startX} ${startY}
      C ${(startX + endX) / 2} ${startY},
        ${(startX + endX) / 2} ${endY},
        ${endX} ${endY}
    `;

    path.setAttribute('d', d);

    path.setAttribute(
      'fill',
      this.lineStyle.fill || 'none'
    );

    path.setAttribute(
      'stroke',
      this.lineStyle.stroke || '#999'
    );

    path.setAttribute(
      'stroke-width',
      this.lineStyle.strokeWidth || '1.5'
    );

    if (this.lineStyle.strokeDasharray) {
      path.setAttribute(
        'stroke-dasharray',
        this.lineStyle.strokeDasharray
      );
    }

    if (this.lineStyle.opacity != null) {
      path.setAttribute(
        'opacity',
        this.lineStyle.opacity
      );
    }

    svg.appendChild(path);
  }
}
