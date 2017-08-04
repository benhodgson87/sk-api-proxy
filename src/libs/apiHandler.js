import jdu from 'jdu'
import 'isomorphic-fetch'
import * as config from '../config'

export default class ApiHandler {
  constructor(apiUrl, apiKey) {
    this.apiUrl = apiUrl || config.API_URL
    this.apiKey = apiKey || config.API_KEY
  }

  createUrl(query) {
    const endpoint = jdu.replace(query)
    const apiKey = `${(endpoint.includes('?') ? '&' : '?')}apikey=${this.apiKey}`
    return `${this.apiUrl}${endpoint}${apiKey}`
  }

  request(endpoint) {
    const url = this.createUrl(endpoint)
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: 'GET',
        headers: new Headers({
          'content-type': 'application/json; charset=utf-8',
        }),
      })
      .then(r => r.json())
      .then(data => resolve(data))
      .catch(err => reject(err))
    })
  }
}
