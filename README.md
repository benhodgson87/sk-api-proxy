# sk-api-proxy

A quickly thrown together Express proxy for the Songkick API to bypass lack of CORS / avoid using JSONP.

## Usage

Clone this repo, and push it up to Heroku (or similar).

Set an environment variable of `SK_API_KEY` with your Songkick API Key.

## API Requests

The proxy mirrors the original Songkick API paths, although omitting the version.

So, you can just fire a fetch request off to `http://your-heroku-instance/api/path/`.

eg. `http://your-heroku-instance/search/artists.json?query=Beyoncé` returns `http://api.songkick.com/api/3.0/search/artists.json?query=Beyoncé`
