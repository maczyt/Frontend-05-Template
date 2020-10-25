

const reg = /(\d+)|(\s+)|([\r\n]+)|([+]+)|([\-]+)|([*]+)|([/]+)/g
const tokens = ['Number', 'WhiteSpace', 'LineBreak', '+', '-', '*', '/']
function  lexicalAnalysis(str) {
  const token = []
  let result
  while (true) {
    result = reg.exec(str)
    if (!result) {
      break
    }
    for (let i = 1; i <= tokens.length; i ++) {
      if (result[i]) {
        token.push({
          type: tokens[i - 1],
          value: result[0]
        })
        break
      }
    }
  }
  return token
}

lexicalAnalysis('1 + 4*5')