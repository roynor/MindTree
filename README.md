# MindTree 使用说明

## 项目地址

[MindTree GitHub 仓库](https://github.com/roynor/MindTree)
A simple tree diagram display
MindTree 是一个轻量级树形图 / 思维导图展示库，支持：

* 多树（Forest）
* 展开 / 收缩
* 拖拽画布
* 滚轮缩放
* 四方向布局
* SVG 连线
* 自定义节点样式

适用于：

* 知识图谱
* 思维导图
* 课程结构
* 技术架构图
* 树形数据可视化

---

# 1. 引入库

```html
<script src="./mindtree.js"></script>
```

---

# 2. 创建容器

```html
<div id="app"></div>
```

推荐：

```css
#app {
  width: 100vw;
  height: 100vh;
}
```

---

# 3. 数据格式

MindTree 使用：

```text
扁平数组 + parentId
```

结构。

---

## 基础结构

```javascript
const data = [
  {
    id: '1',
    label: '根节点',
  },

  {
    id: '2',
    parentId: '1',
    label: '子节点',
  },
];
```

---

## 字段说明

| 字段        | 说明     |
| --------- | ------ |
| id        | 节点唯一ID |
| parentId  | 父节点ID  |
| label     | 节点显示文字 |
| collapsed | 是否默认收缩 |

---

## 默认收缩

```javascript
{
  id: '2',
  parentId: '1',
  label: '子节点',
  collapsed: true,
}
```

---

# 4. 初始化

```javascript
const tree = new SimpleTree({
  container: '#app',
  data,
});
```

---

# 5. 完整示例

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />

  <style>
    html,
    body {
      margin: 0;
      width: 100%;
      height: 100%;
    }

    #app {
      width: 100%;
      height: 100%;
    }
  </style>
</head>

<body>

<div id="app"></div>

<script src="./mindtree.js"></script>

<script>

const data = [

  {
    id: '1',
    label: '前端',
  },

  {
    id: '2',
    parentId: '1',
    label: 'HTML',
  },

  {
    id: '3',
    parentId: '1',
    label: 'CSS',
  },

  {
    id: '4',
    parentId: '1',
    label: 'JavaScript',
  },



  {
    id: '100',
    label: '后端',
  },

  {
    id: '101',
    parentId: '100',
    label: 'Node.js',
  },

  {
    id: '102',
    parentId: '100',
    label: 'Java',
  },

];

new SimpleTree({

  container: '#app',

  data,

  direction: 'right',

  showToggle: true,

  nodeColor: '#ffffff',

  fontSize: 16,

  fontColor: '#222',

});

</script>

</body>
</html>
```

---

# 6. 配置项

## container

容器元素。

```javascript
container: '#app'
```

也可以：

```javascript
container: document.getElementById('app')
```

---

## data

树数据。

```javascript
data: [...]
```

---

## direction

树展开方向。

支持：

| 值     | 方向 |
| ----- | -- |
| right | 向右 |
| left  | 向左 |
| down  | 向下 |
| up    | 向上 |

示例：

```javascript
direction: 'right'
```

---

## showToggle

是否显示展开 / 收缩按钮。

```javascript
showToggle: true
```

---

## nodeColor

节点背景色。

```javascript
nodeColor: '#ffffff'
```

---

## fontSize

字体大小。

```javascript
fontSize: 16
```

---

## fontColor

字体颜色。

```javascript
fontColor: '#222'
```

---

# 7. 支持功能

---

## 节点展开 / 收缩

点击：

* 节点
* * / - 按钮

即可展开或收缩。

---

## 多树支持

支持：

```text
多个 root 节点
```

例如：

```javascript
[
  { id: '1', label: '树A' },
  { id: '2', label: '树B' },
  { id: '3', label: '树C' },
]
```

会自动显示为：

```text
树A

树B

树C
```

---

## 画布拖拽

按住空白区域拖动。

---

## 滚轮缩放

鼠标滚轮：

* 放大
* 缩小

支持：

```text
以鼠标位置为中心缩放
```

---

## SVG 曲线连线

节点之间自动绘制贝塞尔曲线。

---

# 8. 推荐数据规模

推荐：

| 节点数量     | 状态    |
| -------- | ----- |
| < 500    | 非常流畅  |
| 500~2000 | 可用    |
| > 2000   | 建议虚拟化 |

---

# 9. 推荐应用场景

* 思维导图
* 课程结构图
* 技术架构图
* 文件结构
* 知识树
* Graph Viewer
* AI Agent Flow

---

# 10. 后续可扩展功能

MindTree 当前架构已经支持继续扩展：

* 节点拖拽
* minimap
* 框选
* 搜索
* 自动布局
* 动画
* 虚拟滚动
* 无限画布
* 导出 PNG
* 导出 SVG
* 编辑节点
* 连线编辑

---

# 11. License

MIT License
