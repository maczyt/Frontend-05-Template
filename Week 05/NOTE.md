# 学习笔记

## Proxy

1. 拦截对象的`get`、`set`
2. 通过初始化调用 `effect` 的 `callback` 来触发 callback 中用到的数据的 `getter` 收集依赖
3. 当对应的依赖触发 `setter` 时候，调用订阅的 `callbacks`

## Draggable

** 拖拽元素的 `mousedown`，`document` 的 `mousemove` 和 `mouseup`
