学习笔记

`LL` 算法构建 `AST`

## RegExp

如果不设置`global`，那么对应的正则对象是无状态的，每次`exec`都会从字符串头开始
否则是有状态的，会有`lastIndex`，每次`exec`都是从上一次结束的位置开始，那么可以遍历完字符串


## LL 语法分析

**不断的消元**

分析下四则运算的构成

```
Expression:=
  AddSubExpression |
  Expression EOF

AddSubExpression:=
  MultiplyDivideExpression |
  AddSubExpression + AddSubExpression |
  AddSubExpression - AddSubExpression

MultiplyDivideExpression:=
  Number |
  MultiplyDivideExpression * MultiplyDivideExpression
  MultiplyDivideExpression / MultiplyDivideExpression
```