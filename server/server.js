const express = require('express');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const session = require('express-session');
const serverRender = require('./util/server-render');
const fs = require('fs');
const path = require('path');

const isDev = process.env.NODE_ENV === 'development';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  maxAge: 10 * 60 * 1000,
  name: 'tid',
  resave: false,
  saveUninitialized: false,
  secret: 'react mobx',
}));

app.use(favicon(path.join(__dirname, '../favicon.ico')));

app.use('/api/user', require('./util/handle-login'));
app.use('/api', require('./util/proxy'));

if (!isDev) {
  const serverEntry = require('../disk/server-entry'); // eslint-disable-line
  const template = fs.readFileSync(path.join(__dirname, '../disk/server.ejs'), 'utf-8');
  app.use('/public', express.static(path.join(__dirname, '../disk')));
  app.get('*', (req, res, next) => {
    serverRender(serverEntry, template, req, res).catch(next);
  });
} else {
  const devStatic = require('./util/dev-static'); // eslint-disable-line
  devStatic(app);
}

app.use((error, req, res) => {
  console.log(error);
  res.status(500).send(error);
});

app.listen(3333, () => {
  console.log('server is listening on port 3333'); // eslint-disable-line
});
