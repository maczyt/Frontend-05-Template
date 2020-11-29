function rk(source, target) {
  const targetHash = get_hash(target)
  for (let i = 0; i <= source.length - target.length; i ++) {
    const currentStr = source.slice(i, target.length + i)
    const hash = get_hash(currentStr)
    if (hash === targetHash && matchStr(currentStr, target)) {
      return i
    }
  }
  return -1;
  function matchStr(str1, str2) {
    if (str1.length !== str2.length) return false
    for (let i = 0; i < str1.length; i ++) {
      if (str1[i] !== str2[i]) return false
    }
    return true
  }
  
  function get_hash(str) {
    let hash = 5381
    let i = str.length
    while(i) {
      hash = (hash * 33) ^ str.charCodeAt(--i);
    }
    return hash >>> 0;
  }
}



console.log(rk('abcabc', 'a'))
console.log(rk('accabc', 'ad'))