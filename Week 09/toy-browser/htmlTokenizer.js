const StateMachine = require('javascript-state-machine')

class Stack {
  constructor() {
    this.data = []
  }

  push(d) {
    this.data.push(d)
  }

  pop() {
    return this.data.pop()
  }

  peek() {
    return this.data[this.data.length - 1]
  }

}

const fsm = new StateMachine({
  init: 'data',
  data: (content = '') => {
    const stack = new Stack()
    stack.push({ 
      tagName: 'document',
      children: [],
    })
    return {
      content,
      stack,
      attributeName: '',
      attributeValue: '',
    }
  },
  transitions: [
    {
      name: 'makeData',
      from: '*',
      to: 'data',
    },
    {
      name: 'makeElement',
      from: 'data',
      to: 'tagOpen',
    },
    {
      name: 'makeElementEnd',
      from: 'tagOpen',
      to: 'tagEnd',
    },
    {
      name: 'makeAttributeName',
      from: ['tagOpen', 'attributeName', 'attributeValue'],
      to: 'attributeName'
    },
    {
      name: 'makeAttributeValue',
      from: 'attributeName',
      to: 'attributeValue'
    }
  ],
  methods: {
    onMakeData({ from }) {
      if (from === 'tagOpen') {
        this.stack.push({
          tagName: this.content,
          children: [],
          attributes: {},
        })
        this.content = ''
      }
      if (from === 'tagEnd') {
        const token = this.stack.pop()
        if (this.content !== token.tagName) {
          throw new TypeError('标签不匹配')
        }
        currentToken = this.stack.peek()
        currentToken.children = currentToken.children || []
        currentToken.children.push(token)
        this.content = ''
      }
      // 判断单标签元素
      if (['attributeName', 'tagOpen'].includes(from)) {
        let currentToken = this.stack.peek()
        const singles = [
          'meta', 'br', 'hr', 'img',
          'input', 'param', 'link'
        ]
        if (singles.includes(currentToken.tagName)) {
          const token = this.stack.pop()
          currentToken = this.stack.peek()
          currentToken.children = currentToken.children || []
          currentToken.children.push(token)
        }
      }
    },
    onMakeElement() {
      if (this.content) {
        const currentToken = this.stack.peek()
        currentToken.children = currentToken.children || []
        currentToken.children.push({
          type: 'text',
          content: this.content,
        })
        this.content = ''
      }
    },
    onMakeAttributeName({ from, }) {
      if (from === 'tagOpen') {
        this.stack.push({
          tagName: this.content,
          children: [],
          attributes: {},
        })
        this.content = ''
      } else if (
        from === 'attributeName' ||
        from === 'attributeValue'
      ) {
        const currentToken = this.stack.peek()
        currentToken.attributes = currentToken.attributes || {}
        const name = this.attributeName.trim()
        if (name) {
          const value = this.attributeValue === '' ? true : this.attributeValue
          currentToken.attributes[name] = value
        }
        this.attributeName = this.attributeValue = ''
      }
    },
  }
})

function data(c) {
  if (c === '<') {
    fsm.makeElement()
    return tagOpen
  } else {
    fsm.content += c
    return data
  }
}

function tagOpen(c) {
  if (c.match(/^[a-zA-Z]$/)) {
    fsm.content += c
    return tagOpen
  } else if (c.match(/^[\t\r\n ]$/)) {
    fsm.makeAttributeName()
    return attributeName
  } else if (c === '>')  {
    fsm.makeData()
    return data
  } else if (c === '/') {
    fsm.makeElementEnd()
    return tagEnd
  } else if (c === '!') {
    throw new Error('不支持注释节点')
  } else {
    throw new TypeError(`错误的字符: ${c}`)
  }
}

function tagEnd(c) {
  if (c === '>') {
    fsm.makeData()
    return data
  } else if (c.match(/^[\t\r\n ]$/)) {
    throw new TypeError(`错误的字符: ${c}`)
  } else {
    fsm.content += c
    return tagEnd
  }
}

function attributeName(c) {
  if (c === '=') {
    fsm.makeAttributeValue()
    return attributeValue
  } else if (c.match(/^[\t\r\n ]$/)) {
    fsm.makeAttributeName()
    return attributeName
  } else if (c === '>') {
    fsm.makeData()
    return data
  } else {
    fsm.attributeName += c
    return attributeName
  }
}

function attributeValue(c) {
  if (c === '"') {
    return doubleQuoteValue
  } else if (c === "'") {
    return singleQuoteValue
  }
}
function singleQuoteValue(c) {
  if (c === "'") {
    fsm.makeAttributeName()
    return attributeName
  } else {
    fsm.attributeValue += c
    return singleQuoteValue
  }
}
function doubleQuoteValue(c) {
  if (c === '"') {
    fsm.makeAttributeName()
    return attributeName
  } else {
    fsm.attributeValue += c
    return doubleQuoteValue
  }
}

function parser(html) {
  let state = data
  for (let c of html) {
    state = state(c)
  }
  console.log(JSON.stringify(fsm.stack.peek(), null, 2))

  return fsm.stack.peek()
}

module.exports = parser