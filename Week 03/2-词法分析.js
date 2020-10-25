

const reg = /(\d+)|(\s+)|([\r\n]+)|([+]+)|([\-]+)|([*]+)|([/]+)/g
const tokens = ['Number', 'WhiteSpace', 'LineBreak', '+', '-', '*', '/']
exports.lexicalAnalysis = function* lexicalAnalysis(str) {
  let result
  while (true) {
    result = reg.exec(str)
    if (!result) {
      break
    }
    
    let token
    for (let i = 1; i <= tokens.length; i ++) {
      if (result[i]) {
        token = {
          type: tokens[i - 1],
          value: result[0]
        }
        break
      }
    }
    yield token
  }
  yield {
    type: 'EOF'
  }
}

// for (let token of lexicalAnalysis('1 + 4*5')) {
//   console.log(token)
// }