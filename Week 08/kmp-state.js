// 1. 跳转表 (p)
// 2. 匹配 (str)

/**
 * kmp
 * @param {string} str 
 * @param {string} p 
 */
function match(str, p) {
  const table = build(p)
  let j = 0
  let state = next
  let matchIndex = -1
  for (let i = 0; i < str.length; i ++) {
    state = state(str[i])
    if (state === end) {
      matchIndex = i - p.length + 1
    }
  }
  return matchIndex
  // 状态机 start
  // 考虑是模式串的状态
  function next(c) {
    if (c === p[j]) {
      j ++
    } else {
      while (j > 0 && c !== p[j]) {
        j = table[j - 1]
      }
      if (c === p[j]) j ++
    }
    if (j === p.length) {
      return end
    }
    return next
  }
  function end(c) {
    return end
  }
  // 状态机 end
}



// 临时表
function build(p) {
  const next = [0]
  let i = 1
  let j = 0
  for (i = 1; i < p.length; i ++) {
    if (p[j] === p[i]) {
      next[i] = ++ j
    } else {
      while (j > 0 && p[j] !== p[i]) {
        j = next[j - 1]
      }
      if (p[j] === p[i]) {
        next[i] = ++ j
      } else {
        next[i] = 0
      }
    }
  }
  return next
}

console.log(match('middiddippi', 'iddippi'))
