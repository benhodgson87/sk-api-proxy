require('es6-promise').polyfill()
require('isomorphic-fetch')

const express = require('express')
const bodyParser = require('body-parser')
const jdu = require('jdu')
const app = express()

const port = process.env.PORT || 8080

app.use(bodyParser.json())

const createUrl = query => {
    const endpoint = jdu.replace(query)
    const apiUrl = 'http://api.songkick.com/api/3.0/'
    const apiKey = (endpoint.includes('?') ? `&` : `?`) + `apikey=${process.env.SK_API_KEY}`
    return `${apiUrl}${endpoint}${apiKey}`
}

const request = endpoint => {
    const url = createUrl(endpoint)
    console.log(`-- Requesting: ${url}`)

    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'GET',
            headers: new Headers({
                'content-type': 'application/json; charset=utf-8'
            })
        })
        .then(r => r.json())
        .then(data => {
            resolve(data)
        })
        .catch(err => {
            reject(err)
        })
    })
}

const respond = (res, payload) => {
    res.set({ 'content-type': 'application/json; charset=utf-8' })
    res.send(payload)
}

app.get('/', function (req, res) {
    const endpoint = req.query.get
    console.log(`-- Received GET: ${endpoint}`)

    if (req.query.get && !!process.env.SK_API_KEY) {
        request(endpoint)
        .then(data => {
            respond(res, data)
        })
        .catch(err => {
            respond(res, err)
        })
    } else {
        respond(res, 'Please pass a get parameter containing the SK API resource you want to retrieve.')
    }
})

app.post('/', function(req, res){
    const endpoint = req.body.endpoint
    console.log(`-- Received POST: ${endpoint}`)

    if (!!req.body.endpoint && !!process.env.SK_API_KEY) {
        request(endpoint)
        .then(data => {
            respond(res, data)
        })
        .catch(err => {
            respond(res, err)
        })
    } else {
        respond(res, 'Please post a body object containing the SK API resource you want to retrieve.')
    }
});


app.listen(port, function () {
    console.log(`API proxy listening on port ${port}`)
})
