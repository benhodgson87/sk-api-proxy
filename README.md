# sk-api-proxy

A quickly thrown together Express proxy for the Songkick API to bypass lack of CORS / avoid using JSONP.

## Usage

Set an environment variable of `SK_API_KEY` with your Songkick API Key.

You can run the repo locally using `npm run dev` / `yarn dev`.

To use it remotely, simply push it up to Heroku - or your preferred equivalent.

## API Requests

The proxy mirrors the original Songkick API paths, although omitting the version.

So, you can just fire a fetch request off to `http://your-heroku-instance/api/path/`.

eg. `http://your-heroku-instance/search/artists.json?query=Beyoncé` returns `http://api.songkick.com/api/3.0/search/artists.json?query=Beyoncé`
