const axios = require('axios');
const querystring = require('query-string');

const baseUrl = 'http://cnodejs.org/api/v1';

module.exports = (req, res) => {
  const { path } = req;
  const user = req.session.user || {};
  const { needAccessToken } = req.query;

  if (needAccessToken && !user.accessToken) {
    res.status(401)
      .send({
        success: false,
        msg: 'need login',
      });
  }

  const query = Object.assign({}, req.query);
  if (query.needAccessToken) delete query.needAccessToken;
  console.log(`${baseUrl}${path}`);
  console.log(req.body);
  console.log(user);
  axios(`${baseUrl}${path}`, {
    method: req.method,
    params: query,
    data: querystring.stringify(Object.assign({}, req.body, {
      accesstoken: user.accessToken,
    })),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
    .then((resp) => {
      console.log(resp);
      if (resp.status === 200) {
        res.send(resp.data);
      } else {
        res.status(resp.status)
          .send(resp.data);
      }
    })
    .catch((err) => {
      if (err.response) {
        res.status(500)
          .send(err.response.data);
      } else {
        res.status(500)
          .send({
            success: false,
            msg: '未知错误',
          });
      }
    });
};
