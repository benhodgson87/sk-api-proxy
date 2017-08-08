import ApiHandler from './apiHandler'
import * as config from '../config';

describe('API Handler', () => {
  describe('when creating a Songkick API URL', () => {
    beforeEach(() => {
      config.API_URL = 'http://songkick.com/api'
      config.API_KEY = '0q9w8e7r6t'
    })

    test('should use params passed to constructor', () => {
      const api = new ApiHandler('http://api.songkick.com', '1a2b3c4d5e')
      const url = api.createUrl('/artists/search')
      expect(url).toEqual('http://api.songkick.com/artists/search?apikey=1a2b3c4d5e')
    })

    test('should fallback to config values when constructor params empty', () => {
      const api = new ApiHandler()
      const url = api.createUrl('/artists/search')
      expect(url).toEqual('http://songkick.com/api/artists/search?apikey=0q9w8e7r6t')
    })

    test('should prepend api string with "&" if endpoint has an existing query string', () => {
      const api = new ApiHandler()
      const url = api.createUrl('/artists/search?query=dusky')
      expect(url).toEqual('http://songkick.com/api/artists/search?query=dusky&apikey=0q9w8e7r6t')
    })

    test('should strip diacritic characters that the Songkick API cries about', () => {
      const api = new ApiHandler()
      const url = api.createUrl('/artists/search?query=beyoncé')
      expect(url).toEqual('http://songkick.com/api/artists/search?query=beyonce&apikey=0q9w8e7r6t')
    })
  })

  describe('when making requests to the API', () => {
    test('should make a fetch request with the correct URL', () => {
      fetch.mockResponse(JSON.stringify({ foo: 'bar' }))
      const api = new ApiHandler()
      return api.request('/artists/search?query=armand%20van%20helden')
        .then(() => {
          expect(fetch.mock.calls[0]).toContain(
            'http://songkick.com/api/artists/search?query=armand%20van%20helden&apikey=0q9w8e7r6t',
          )
        })
    })

    test('should get a promise from the API and pass through the response', () => {
      fetch.mockResponse(JSON.stringify({
        displayName: 'Armand Van Helden',
        artistId: '0123456789qwertyuiop',
      }))

      const api = new ApiHandler()
      return api.request('/artists/search?query=armand%20van%20helden')
        .then(r => {
          expect(r.displayName).toEqual('Armand Van Helden')
          expect(r.artistId).toEqual('0123456789qwertyuiop')
        })
    })
  })
})
