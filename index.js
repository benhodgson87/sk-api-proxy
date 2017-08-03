require('es6-promise').polyfill();
require('isomorphic-fetch');

const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const port = process.env.PORT || 8080

app.use(bodyParser.json())

const createUrl = query => {
    const endpoint = decodeURI(query)
    const apiUrl = 'http://api.songkick.com/api/3.0/'
    const apiKey = (endpoint.includes('?') ? `&` : `?`) + `apikey=${process.env.SK_API_KEY}`
    return `${apiUrl}${endpoint}${apiKey}`
}

const request = endpoint => {
    const url = createUrl(endpoint)
    console.log(`Received: ${endpoint} | Requesting: ${url}`)

    return new Promise((resolve, reject) => {
        fetch(url, { method: 'GET' })
        .then(r => r.json())
        .then(data => {
            resolve(data)
        })
        .catch(err => {
            reject(err)
        })
    })
}

app.get('/', function (req, res) {
    const endpoint = req.query.get

    if (!!req.query.get && !!process.env.SK_API_KEY) {
        request(endpoint)
        .then(data => {
            res.send(data)
        })
        .catch(err => {
            res.send(err)
        })
    } else {
        res.send('Please pass a get parameter containing the SK API resource you want to retrieve.')
    }
})

app.post('/', function(req, res){
    const endpoint = req.body.endpoint

    if (!!req.body.endpoint && !!process.env.SK_API_KEY) {
        request(endpoint)
        .then(data => {
            res.send(data)
        })
        .catch(err => {
            res.send(err)
        })
    } else {
        res.send('Please post a body object containing the SK API resource you want to retrieve.')
    }
});


app.listen(port, function () {
    console.log(`API proxy listening on port ${port}`)
})
