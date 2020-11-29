/**
 * 不同进制的
 * @param {*} str 
 * @param {*} radix 
 */
function toNumber(str, radix = 10) {
  const [inte = '', de = ''] = str.split('.')
  return [...inte].reverse().reduce((s, n, index) => {
    return s + Math.pow(radix, index) * n
  }, 0) + [...de].reduce((s, n, index) => {
    return s + n * Math.pow(radix, -(index + 1))
  }, 0)
}

console.log(
  toNumber('457', 16)
)
console.assert(toNumber('456', 16) === 1111, 'ok')