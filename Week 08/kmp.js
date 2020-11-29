// 1. 跳转表 (p)
// 2. 匹配 (str)

/**
 * kmp
 * @param {string} str 
 * @param {string} p 
 */
function match(str, p) {
  const matched = []
  const next = build(p)
  let j = 0
  for (let i = 0; i < str.length; i ++) {
    if (str[i] === p[j]) j ++
    else {
      while (j > 0 && str[i] !== p[j]) {
        j = next[j - 1]
      }
      if (str[i] === p[j]) j ++
    }

    if (j === p.length) {
      matched.push(i - p.length + 1)
      j = next[j]
    }
  }
  return matched
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

console.log(match('middiddippi', 'iddipi'))
