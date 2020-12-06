const StateMachine = require('javascript-state-machine')
const EOF = Symbol('EOF')

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

}
const stack = new Stack()
let str = ''
stack.push({ 
  tagName: 'document',
  children: [],
})
const fsm = new StateMachine({
  init: 'data',
  data: (content = '') => {
    return {
      content,
    }
  },
  transitions: [
    {
      name: 'makeElement',
      from: 'data',
      to: 'tagOpen',
    },
    {
      name: 'makeAttributeName',
      from: ['tagOpen', 'attributeName', 'makeAttributeValue'],
      to: 'attributeName'
    },
    {
      name: 'makeAttributeValue',
      from: 'attributeName',
      to: 'attributeValue'
    }
  ],
  methods: {
    onMakeAttributeName(...args) {
      console.log('args', args)
    },
    onTransition: function({
      transition,
      from,
      to,
    }) {
      console.log('ff', transition)
      if (from === 'tagOpen') {
        stack.push({
          tagName: this.content,
          children: [],
          attributes: {},
        })
        this.content = ''
        return
      }
    }
  }
})

let currentToken = null

function data(c) {
  if (c === '<') {
    return tagOpen
  } else if (c === EOF) {
    emit({
      type: 'EOF'
    })
    return 
  } else {
    emit({
      type: 'text',
      content: c
    })
    return data
  }
}

// 开始标签
function tagOpen(c) {
  if (c === '/') {
    return endTagOpen
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: 'startTag',
      tagName: '',
    }
    return tagName(c)
  } else {
    return
  }
}
// 结束标签
function endTagOpen(c) {
  if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: 'endTag',
      tagName: '',
    }
    return tagName(c)
  } else if (c === '>') {
    
  } else if (c === EOF) {

  } else {

  }
}
// 标签名
function tagName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    emit(currentToken)
    currentToken = {
      type: 'attribute',
      content: '',
    }
    return beforeAttributeName
  } else if (c === '/') {
    return selfCloseStartTag
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentToken.tagName += c
    return tagName
  } else if (c === '>') {
    emit(currentToken)
    return data
  } else {
    return tagName
  }
}

function beforeAttributeName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    currentToken.content += c
    return beforeAttributeName
  } else if (c === '>') {
    emit(currentToken)
    return data
  } else if (c === '=') {
    currentToken.content += c
    return beforeAttributeName
  } else {
    currentToken.content += c
    return beforeAttributeName
  }
}

function selfCloseStartTag(c) {
  if (c === '>') {
    currentToken.isSelfClosing = true
    return data
  } else if (c === EOF) {

  } else {

  }
}

function parser(html) {
  let state = data
  for (let c of html) {
    // switch
    state = state(c)
    // console.log(fsm.state)
  }
  console.log(fsm.content, fsm)
}

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
  } else if (c === '!') {
    throw new Error('不支持注释节点')
  } else {
    throw new TypeError(`错误的字符: ${c}`)
  }
}

function attributeName(c) {
  if (c === '=') {
    fsm.makeAttributeValue()
    return attributeValue
  } else if (c.match(/^[\t\r\n ]$/)) {
    fsm.makeAttribute()
    return attributeName
  } else if (c === '>') {

  } else {
    fsm.content += c
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
    fsm.content += c
    return singleQuoteValue
  }
}
function doubleQuoteValue(c) {
  if (c === '"') {
    fsm.makeAttributeName()
    return attributeName
  } else {
    fsm.content += c
    return doubleQuoteValue
  }
}

// WIP
module.exports = parser