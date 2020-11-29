# 学习笔记

## 类型转换

> 比较重要的就是装箱和拆箱操作了

如果没有设置`Symbol.toPrimitive`
Object的拆箱：字符串的操作一般优先调用`toString`（除了 `+` 的情况下）

装箱转换

Number -> `new Number()`
String -> `new String()`
Boolean -> `new Boolean()`
Symbol -> `new Object(Symbol())`

**`undefined` 和 `null` 没有包装类 所以`null.xxx`会报错**， 

## 预处理

会把 `var` 声明的变量预处理提前出来
