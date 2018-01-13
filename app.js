/* eslint-disable new-cap, no-console, func-names, object-shorthand */
const dotenv = require('dotenv');
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const async = require('async');
const Pusher = require('pusher');

dotenv.load();
const rootUrl = (process.env.ROOT_URL || 'http://localhost');
const port = Number(process.env.PORT || 3000);

/* ****************************** PUSHER SETUP ***************************** */
const pusherAppId = process.env.PUSHER_APPID || null;
const pusherKey = process.env.PUSHER_KEY || null;
const pusherSecret = process.env.PUSHER_SECRET || null;

const pusher = new Pusher({
  appId: pusherAppId,
  key: pusherKey,
  secret: pusherSecret,
  encrypted: true,
});

/* ****************************** EXPRESS SETUP ***************************** */

const app = express();
app.set('json spaces', 2);
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/* ****************************** EXPRESS ROUTES **************************** */

// Default Route
app.get('/', (req, res) => {
  async.parallel({
    users: function (callback) {
      pusher.get({ path: '/channels', params: { filter_by_prefix: 'user-' } }, (error, request, response) => {
        const result = JSON.parse(response.body);
        const total = Object.keys(result.channels).length;
        callback(null, total);
      });
    },
    calendars: function (callback) {
      pusher.get({ path: '/channels', params: { filter_by_prefix: 'calendar-' } }, (error, request, response) => {
        const result = JSON.parse(response.body);
        const total = Object.keys(result.channels).length;
        callback(null, total);
      });
    },
    organizations: function (callback) {
      pusher.get({ path: '/channels', params: { filter_by_prefix: 'organization-' } }, (error, request, response) => {
        const result = JSON.parse(response.body);
        const total = Object.keys(result.channels).length;
        callback(null, total);
      });
    },
  }, (err, results) => res.json(results));
});

// All Channels
app.get('/all', (req, res) => {
  pusher.get({ path: '/channels', params: {} }, (error, request, response) => {
    const result = JSON.parse(response.body);
    return res.json(result);
  });
});

/* **** Organization **** */
// All Orgs
app.get('/orgs', (req, res) => {
  const channelPath = '/channels';
  const channelParams = { filter_by_prefix: 'organization-' };

  pusher.get({ path: channelPath, params: channelParams }, (error, request, response) => {
    const result = JSON.parse(response.body);
    const responseObject = {
      online: Object.keys(result.channels).length,
      users: result.channels,
    };
    return res.json(responseObject);
  });
});

// Single Org
app.get('/org/:id', (req, res) => {
  if (!req.params.id) {
    return res.status(401).json({ error: 'Organizations ID is required.' });
  }

  const userId = req.params.id;
  const channelPath = `/channels/organization-${userId}`;
  const channelParams = { info: 'subscription_count' };

  return pusher.get({ path: channelPath, params: channelParams }, (error, request, response) => {
    const result = JSON.parse(response.body);
    return res.json(result);
  });
});

/* **** Calendars **** */
// All Calendars
app.get('/calendars', (req, res) => {
  const channelPath = '/channels';
  const channelParams = { filter_by_prefix: 'calendar-' };

  pusher.get({ path: channelPath, params: channelParams }, (error, request, response) => {
    const result = JSON.parse(response.body);
    const responseObject = {
      online: Object.keys(result.channels).length,
      users: result.channels,
    };
    return res.json(responseObject);
  });
});

// Single Calendar
app.get('/calendar/:id', (req, res) => {
  if (!req.params.id) {
    return res.status(401).json({ error: 'Calendar ID is required.' });
  }

  const userId = req.params.id;
  const channelPath = `/channels/calendar-${userId}`;
  const channelParams = { info: 'subscription_count' };

  return pusher.get({ path: channelPath, params: channelParams }, (error, request, response) => {
    const result = JSON.parse(response.body);
    return res.json(result);
  });
});

/* **** Users **** */

// All Users
app.get('/users', (req, res) => {
  const channelPath = '/channels';
  const channelParams = { filter_by_prefix: 'user-' };

  pusher.get({ path: channelPath, params: channelParams }, (error, request, response) => {
    const result = JSON.parse(response.body);
    const responseObject = {
      online: Object.keys(result.channels).length,
      users: result.channels,
    };
    return res.json(responseObject);
  });
});

// Single User
app.get('/user/:id', (req, res) => {
  if (!req.params.id) {
    return res.status(401).json({ error: 'User ID is required.' });
  }

  const userId = req.params.id;
  const channelPath = `/channels/user-${userId}`;
  const channelParams = { info: 'subscription_count' };

  return pusher.get({ path: channelPath, params: channelParams }, (error, request, response) => {
    const result = JSON.parse(response.body);
    return res.json(result);
  });
});

/* ******************************* SERVER LISTEN **************************** */

// Server Listen
app.listen(port, () => {
  console.log(`\nApp server is running on ${rootUrl}:${port}\n`);
});
