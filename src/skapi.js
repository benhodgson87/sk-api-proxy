require('es6-promise').polyfill()
require('isomorphic-fetch')

const jdu = require('jdu')

class SKApi {
    constructor() {
        this.apiUrl = 'http://api.songkick.com/api/3.0/'
        this.apiKey = process.env.SK_API_KEY
    }

    createUrl(query) {
        const endpoint = jdu.replace(query)
        const apiKey = (endpoint.includes('?') ? `&` : `?`) + `apikey=${this.apiKey}`
        return `${this.apiUrl}${endpoint}${apiKey}`
    }

    request(endpoint) {
        const url = this.createUrl(endpoint)        
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
}

module.exports = new SKApi()
