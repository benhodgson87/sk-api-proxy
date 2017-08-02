require('es6-promise').polyfill();
require('isomorphic-fetch');

const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const port = 5555

app.use(bodyParser.json())

app.get('/', function (req, res) {
    res.send('This is a proxy to add CORS support to the Songkick API. Please send a POST request.')
})

app.post('/', function(req, res){
    console.log(req.body)
    const endpoint = req.body.endpoint
    const apiKey = (endpoint.includes('?') ? `&` : `?`) + `apikey=${req.body.apiKey}`
    const apiUrl = `http://api.songkick.com/api/3.0/${endpoint}${apiKey}`

    fetch(apiUrl, { method: 'GET' })
    .then(resp => resp.json())
    .then(data => {
        res.send(data)
    })
    .catch(err => {
        res.send(err)
    })
});


app.listen(port, function () {
    console.log(`API proxy running on localhost:${port}!`)
})
