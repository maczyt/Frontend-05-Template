class Request {
  constructor(opts) {
    this.method = opts.method || 'GET'
    this.host = opts.host
    this.port = opts.port || 80
    this.path = opts.path || '/'
    this.body = opts.body || {}
    this.headers = opts.headers || {}
    if (!this.headers['Content-Type']) {
      this.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    }

    this.bodyText = ''
    if (this.headers['Content-Type'] === 'application/json') {
      this.bodyText = JSON.stringify(this.body)
    } else if (this.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
      this.bodyText = Object.keys(this.body).map(key => `${key}=${encodeURIComponent(this.body[key])}`).join('&')
    }

    this.headers['Content-Length'] = this.bodyText.length
  }

  toString() {
    return `${this.method} ${this.path} HTTP/1.1\r\n${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join('\r\n')}\r\n\r\n${this.bodyText}`
  }

  send(connection) {
    return new Promise((resolve, reject) => {
      const parser = new ResponseParser()
      if (connection) {
        connection.write(this.toString())
      } else {
        connection = require('net').createConnection({
          host: this.host,
          port: this.port,
        }, () => {
          connection.write(this.toString())
        })
      }

      connection.on('data', (data) => {
        console.log(data.toString())
        parser.receive(data.toString())
        resolve(parser.response)
        connection.end()
      })

      connection.on('error', (err) => {
        reject(err)
        connection.end()
      })
    })
  }
}

class ResponseParser {
  constructor() {
    // state machine
    this.waiting_status_line = 0
    this.waiting_status_line_end = 1
    this.waiting_header_name = 2
    this.waiting_header_space = 3
    this.waiting_header_value = 4
    this.waiting_header_line_end = 5
    this.waiting_header_block_end = 6
    this.waiting_body = 7

    this.current = this.waiting_status_line
    this.statusLine = ''
    this.headers = {}
    this.headerName = ''
    this.headerValue = ''
    this.bodyContent = ''
  }

  get response() {
    this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/)
    return {
      statusCode: RegExp.$1,
      statusText: RegExp.$2,
      headers: this.headers,
      body: this.bodyContent
    }
  }

  receive(text) {
    for (let c of text) {
      this.receiveChar(c)
    }
  }
  receiveChar(c) {
    if (this.current === this.waiting_status_line) {
      if (c === '\r') {
        this.current = this.waiting_status_line_end
      } else {
        this.statusLine += c
      }
    } else if (this.current === this.waiting_status_line_end) {
      if (c === '\n') {
        this.current = this.waiting_header_name
      }
    } else if (this.current === this.waiting_header_name) {
      if (c === ':') {
        this.current = this.waiting_header_space
      } else if (c === '\r') {
        this.current = this.waiting_header_block_end
      } else {
        this.headerName += c
      }
    } else if (this.current === this.waiting_header_space) {
      if (c === ' ') {
        this.current = this.waiting_header_value
      }
    } else if (this.current === this.waiting_header_value) {
      if (c === '\r') {
        this.current = this.waiting_header_line_end
        this.headers[this.headerName] = this.headerValue
        this.headerName = ''
        this.headerValue = ''
      } else {
        this.headerValue += c
      }
    } else if (this.current === this.waiting_header_line_end) {
      if (c === '\n') {
        this.current = this.waiting_header_name
      }
    } else if (this.current === this.waiting_header_block_end) {
      if (c === '\n') {
        this.current = this.waiting_body
      }
    } else if (this.current === this.waiting_body) {
      this.bodyContent += c
    }
  } 
}

void async function() {
  const request = new Request({
    method: 'POST',
    host: 'localhost',
    port: 8080,
    path: '/',
    headers: {
      'X-Foo': 'customed'
    },
    body: {
      name: 'xx'
    }
  })

  request.send().then((response) => {
    console.log(response)
  }) 
}()