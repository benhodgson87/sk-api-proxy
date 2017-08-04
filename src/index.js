import Express from 'express'
import BodyParser from 'body-parser'
import ApiHandler from './libs/apiHandler'

const api = new ApiHandler()
const app = Express()
const port = process.env.PORT || 8080

const logFeedback = (req, res, next) => {
  if (!process.env.SK_API_KEY) console.log('>> ERROR: No API Key Defined!')
  console.log(`>> Received ${req.method}: ${req.originalUrl}`)
  next()
}

const requestHandler = (req, res) => {
  if (req.method === 'GET' && process.env.SK_API_KEY) {
    api.request(req.originalUrl)
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.send(err)
    })
  } else {
    res.send('An error occurred. Please ensure you have passed the correct parameters, or try again later.')
  }
}

app.use(BodyParser.json())
app.use(logFeedback)
app.use(requestHandler)

app.listen(port, () => {
  console.log(`API proxy listening on port ${port}`)
})
