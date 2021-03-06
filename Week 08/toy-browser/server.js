const express = require('express')
const app = express()
const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.post('/', (req, res) => {
  console.log(JSON.stringify(req.body))
  res.send('Hello World\n')
})

app.listen(8080, () => {
  console.log('Server Startedddd')
})