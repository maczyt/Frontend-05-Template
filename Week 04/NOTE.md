# 学习笔记

- 字典树（Trie）
> 大量高重复字符串的存储和分析

- KMP
> 长字符串中找模式

- WildCard
> 带通配符的字符串模式

- 正则
> 字符串通用模式匹配

- 状态机
> 通用的字符串分析

- LL LR
> 字符串多层级结构分析

## KMP

原生JS中字符串的`indexOf`并不是采用KMP算法（效率一般），而是使用了`Boyer-Moore`算法，而`includes`底层实现也是利用了`indexOf`是否等于-1来检测的

### 参考资料

[字符串匹配的KMP算法](http://www.ruanyifeng.com/blog/2013/05/Knuth%E2%80%93Morris%E2%80%93Pratt_algorithm.html)