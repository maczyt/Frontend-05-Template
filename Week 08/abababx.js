// abababx

// 状态分析
// a -> b
// b -> a | x

// ab ab ab x
// 12 34 56 7

function match(str) {
  let state = start
  for (let c of str) {
    state = state(c)
  }
  return state === end
}

function start(c) {
  return c === 'a' ? a1 : start
}
function a1(c) {
  return c === 'b' ? b1 : start(c)
}
function b1(c) {
  return c === 'a' ? a2 : start(c)
}
function a2(c) {
  return c === 'b' ? b2: start(c)
}
function b2(c) {
  return c === 'a' ? a3 : start(c)
}
function a3(c) {
  return c === 'b' ? b3 : start(c)
}
function b3(c) {
  return c === 'x' ? end : start(c)
}
function end(c) {
  return end
}

console.log(match('abababeabababx'))