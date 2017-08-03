const Express = require('express')
const BodyParser = require('body-parser')
const SKApi = require('./src/skapi')

const app = Express()
const port = process.env.PORT || 8080

const getPayload = function(req) {
    return (req.method === 'GET') ? req.query.get : req.body.endpoint
}

const logFeedback = function(req, res, next) {
    const request = getPayload(req)
    if (!process.env.SK_API_KEY) console.log('>> ERROR: No API Key Defined!')
    console.log(`>> Received ${req.method}: ${request}`)
    next()
}

const requestHandler = function(req, res, next) {
    const request = getPayload(req)
    if (!!request && !!process.env.SK_API_KEY) {
        SKApi.request(request)
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

app.listen(port, function () {
    console.log(`API proxy listening on port ${port}`)
})
