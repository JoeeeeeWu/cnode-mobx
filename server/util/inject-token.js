const axios = require('axios');
const querystring = require('query-string');

const baseUrl = 'https://cnodejs.org/api/v1';

const maps = {
  '/topics': {
    type: 'post',
  },
  '/topic/.+': {
    type: 'get',
    required: false,
    json: true,
  },
  '/topics/update': {
    type: 'post',
  },
  '/topic_collect/collect': {
    type: 'post',
  },
  'topic_collect/de_collect': {
    type: 'post',
  },
  '/messages': {
    type: 'get',
  },
  'message/mark_all': {
    type: 'post',
  },
  '/message/mark_one/:.+': {
    type: 'post',
  },
  '/topic/.+/replies': {
    type: 'post',
  },
  '/reply/.+/ups': {
    type: 'post',
  },
  '/message/count': {
    type: 'get',
  },
};

const array = Object.keys(maps).map(url => ({
  type: maps[url].type.toUpperCase(),
  required: maps[url].required !== false,
  reg: new RegExp(`^${url}$`),
}));

module.exports = (req, res) => {
  const {
    path,
    session: {
      user: {
        accessToken,
      } = {},
    },
    query: {
      needAccessToken,
    },
  } = req;
  if (needAccessToken && !accessToken) {
    res.status(401).send({
      success: false,
      msg: 'need login',
    });
  }
  const body = accessToken ? Object.assign({}, req.body, {
    accesstoken: accessToken,
  }) : req.body;
  axios(`${baseUrl}${path}`, {
    headers: {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: req.method,
      params: req.query,
      data: querystring.stringify(body),
    },
  }).then((resp) => {
    if (res.status === 200) {
      res.send(resp.data);
    } else {
      res.status(resp.status).send(resp.data);
    }
  }).catch((err) => {
    if (err.response) {
      res.status(500).send(err.response.data);
    } else {
      res.status(500).send({
        success: false,
        msg: '未知错误',
      });
    }
  });
};
