# Pusher Active Connections
An example REST API app that returns active websocket connections for Pusher channels.

## Local Setup
- `$ git clone https://github.com/rveitch/docraptor-logs.git`
- `$ npm install`
- Copy `template.env.txt` and rename it to `.env`
- Add your local environment variable keys to the `.env` file and save it.
- Run `$ npm start` or `$ node app` to initialize the app.
- Visit http://localhost:3000 in your browser.

## Configuration
### Local
Update the .env file with the config variables.

### Heroku
Add the config variables to your Heroku app settings.

#### Config Variables
```
PUSHER_APPID=xxx
PUSHER_KEY=xxx
PUSHER_SECRET=xxx
```

## Routes

|  Path            | Description |
|  --------------- | ----------- |
|  `/`             | Default route. Returns totals for current connected `users`, `calendars`, and `organizations`.  |
|  `/all`          | Returns an object containing all connected channels of any type. |
|  `/users`        | Returns an object containing all connected users. |
|  `/user/:id`     | Returns a single user, by id |
|  `/calendars`    | Returns an object containing all connected calendars. |
|  `/calendar/:id` | Returns a single calendar, by id |
|  `/orgs`         | Returns an object containing all connected organizations. |
|  `/org/:id`      | Returns a single organization, by id |
