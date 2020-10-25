/********* 词法分析开始 **********/
const reg = /(\d+)|(\s+)|([\r\n]+)|([+]+)|([\-]+)|([*]+)|([/]+)/g
const tokens = ['Number', 'WhiteSpace', 'LineBreak', '+', '-', '*', '/']
function* lexicalAnalysis(str) {
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
/********* 词法分析结束 **********/

/********* 语法分析开始 **********/
function grammerAnalysis(source) {
  const tokens =  [...lexicalAnalysis(source)]
    .filter(token => token.type !== 'WhiteSpace')
  
  return Expression(tokens)
}


// Expression:=
//   AddSubExpression |
//   Expression EOF
function Expression(tokens) {
  if (tokens[0].type === 'AddSubExpression') {
    const node = ASTNode.makeExpression()
    node.children.push(tokens.shift())
    tokens.unshift(node)
    return Expression(tokens)
  }
  if (
    tokens[0].type === 'Expression' && 
    tokens[1] && 
    tokens[1].type === 'EOF'
  ) {
    return tokens[0]
  }
  AddSubExpression(tokens)
  return Expression(tokens)
}

// AddSubExpression:=
//   MultiplyDivideExpression |
//   AddSubExpression + AddSubExpression |
//   AddSubExpression - AddSubExpression
function AddSubExpression(tokens) {
  if (tokens[0].type === 'MultiplyDivideExpression') {
    const node = ASTNode.makeAddSub()
    node.children.push(tokens.shift())
    tokens.unshift(node)
    return AddSubExpression(tokens)
  }
  if (
    tokens[0].type === 'AddSubExpression' && 
    tokens[1] && 
    (tokens[1].value === '+' || tokens[1].value === '-')
  ) {
    const node = ASTNode.makeAddSub()
    node.operator = tokens[1].value
    node.children.push(tokens.shift())
    node.children.push(tokens.shift())
    // 第三个转成 AddSubExpression
    AddSubExpression(tokens)
    node.children.push(tokens.shift())
    tokens.unshift(node)
    return AddSubExpression(tokens)
  }
  if (tokens[0].type === 'AddSubExpression') {
    return tokens[0]
  }
  MultiplyDivideExpression(tokens)
  return AddSubExpression(tokens)
}

// MultiplyDivideExpression:=
//   Number |
//   MultiplyDivideExpression * MultiplyDivideExpression
//   MultiplyDivideExpression / MultiplyDivideExpression
function MultiplyDivideExpression(tokens) {
  if (tokens[0].type === 'Number') {
    const node = ASTNode.makeMultiplyDivide()
    node.children.push(tokens.shift())
    tokens.unshift(node)
    return MultiplyDivideExpression(tokens)
  }
  if (
    tokens[0].type === 'MultiplyDivideExpression' && 
    tokens[1] && 
    (tokens[1].value === '*' || tokens[1].value === '/')
  ) {
    const node = ASTNode.makeMultiplyDivide()
    node.operator = tokens[1].value
    node.children.push(tokens.shift())
    node.children.push(tokens.shift())
    // 第三个转成 MultiplyDivideExpression
    MultiplyDivideExpression(tokens)
    node.children.push(tokens.shift())
    tokens.unshift(node)
    return MultiplyDivideExpression(tokens)
  }
  if (tokens[0].type === 'MultiplyDivideExpression') {
    return tokens[0]
  }
  return MultiplyDivideExpression(tokens)
} 


class ASTNode {
  constructor(type, children, operator) {
    this.type = type
    this.children = children
    this.operator = operator
  }

  static makeMultiplyDivide() {
    return new ASTNode('MultiplyDivideExpression', [], null)
  }

  static makeAddSub() {
    return new ASTNode('AddSubExpression', [], null)
  }

  static makeExpression() {
    return new ASTNode('Expression', [], null)
  }
}
/********* 语法分析结束 **********/
console.log(grammerAnalysis('1+2*5+3'))