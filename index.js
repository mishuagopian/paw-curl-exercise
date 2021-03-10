const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const port = 3000

const headers = [
  ">,MqBuN?$uS&+v:|t/2Yesgt4JJC,@",
  "mv{MBiZJc0TJ|C()c(xlD[s$Q,~f)B",
  "xPDVUk!Ib@l[a]r%T~~%iL#C`>,4-A",
  "y^D(*Rj?a(-D33G#rZM9K@asTW3V={"
]

const names = []

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())


const authMiddleware = (req, res, next) => {
  const header = req.header('Authorization')
  if (header && headers.includes(header)) {
    return next()
  }
  res.status(401)
  res.json({ error: 'Invalid Authorization header. You can get one at /random_header' })
}

app.use((req, res, next) => {
  console.log(`${req.method} @ ${req.path}`)
  next()
})

app.get('/random_header', (req, res) => {
  const header = headers[Math.floor(Math.random() * headers.length)]
  res.send(`Hello paw student. Your Authorization header is: ${header}`)
})

app.post('/name', [authMiddleware], (req, res) => {
  if (!req.body || !req.body.name) {
    res.status(400)
    res.json({ error: '"name" param missing' })
  } else {
    names.push(req.body.name)
    res.status(200)
    res.json({ message: `Position ${names.length}` })
  }
})

app.get('/names', (req, res, next) => {
  if (req.header('paw-secret') != 'paw-secret-2021') {
    next()
  } else {
    res.status(200)
    res.json({ names })
  }
})

app.use((req, res) => {
  res.status(404)
  res.json({ message: 'Nothing here!' })
})

app.listen(port, () => {
  console.log(`PAW CURL exercise listening at port: ${port}.`)
  console.log('We expect students to POST their names at /name')
})
