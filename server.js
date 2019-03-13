const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const Chatkit = require('@pusher/chatkit-server')

const app = express()

const chatkit = new Chatkit.default({
  instanceLocator: 'v1:us1:c22c854b-461b-470d-a2c1-9acff36ee5e3',
  key: '898b45f1-9112-434d-ba02-4135ab148f32:nc/y4VTY7ejXMmvwppfzrxe3mp8l76+80Xgpq7VXqZM='
})

app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())
app.use(cors())

app.post('/users', (req, res) => {
  const {
    username
  } = req.body

  chatkit
    .createUser({
      id: username,
      name: username
    })
    .then(() => {
      res.sendStatus(201)
    })
    .catch(err => {
      if (err.error === 'services/chatkit/user_already_exists') {
        console.log(`User already exists: ${username}`)
        res.sendStatus(200)
      } else {
        res.status(err.status).json(err)
      }
    })
})

app.post('/authenticate', (req, res) => {
  const authData = chatkit.authenticate({
    userId: req.query.user_id
  })
  res.status(authData.status).send(authData.body)
})

const port = 3001

app.listen(port, err => {
  if (err) {
    console.log(err)
  } else {
    console.log(`Running on port ${port}`)
  }
})
