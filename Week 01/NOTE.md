# 学习笔记

## Tic Tac Toe

- html
- css

哪方即将获得胜利？

> 找到棋盘上空闲的点，往里塞某方棋子（为不影响当前棋盘，通过深拷贝一份数据进行后续操作），判断是否已获得胜利来判断即将胜利


引入 AI 机制

> 通过策略模式
>
> 1. 我要赢
> 2. 不能输

## 策略模式

> 定义：定义一系列的算法，把它们一个个封装起来，并且使它们可以相互替换

### 角色

- `Context` 封装角色

> 上下文，屏蔽高层模块对策略、算法的直接访问，封装可能存在的变化

- `Strategy` 抽象策略角色

> 定义每个策略或算法必须具有的方法和属性

- `ConcreteStrategy` 具体策略角色

> 实现抽象策略的操作，具体的算法

``` typescript
// Strategy
iterface IStrategy {
  doSomething(): void
}

// ConcreteStrategy
class C1 implements IStrategy {
  doSomething() {
    // 具体实现
  }
}
class C2 implements IStrategy {
  doSomething() {
    // 具体实现
  }
}

// Context
// 暴露给外层使用
class Context {
  private strategy
  constructor(strategy) {
    this.strategy = strategy
  }
  doSomething() {
    this.strategy.doSomething()
  }
}

```
