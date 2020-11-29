function match(str) {
  let state = start
  for (let c of str) {
    state = state(c)
  }
  return state === end
}

function start(c) {
  if (c === 'a') {
    return foundA1
  } 
  return start
}
function foundA1(c) {
  if (c === 'b') {
    return foundB1
  }
  return start(c)
}
function foundB1(c) {
  if (c === 'c') {
    return foundC
  }
  return start(c)
}
function foundC(c) {
  if (c === 'a') {
    return foundA2
  }
  return start(c)
}
function foundA2(c) {
  if (c === 'b') {
    return foundB2
  }
  return start(c)
}
function foundB2(c) {
  if (c === 'x') {
    return end
  }
  return foundB1(c)
}
function end(c) {
  return end
}

console.log(match('xxxabcabx'))