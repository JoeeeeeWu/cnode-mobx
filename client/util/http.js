import axios from 'axios';

const baseUrl = process.env.API_BASE || '';

const parseUrl = (url, params) => {
  const str = Object.keys(params).reduce((result, key) => {
    result += `${key}=${params[key]}&`; // eslint-disable-line
    return result;
  }, '');
  return `${baseUrl}/api${url}?${str.substr(0, str.length - 1)}`;
};

export const get = (url, params = {}) => (
  new Promise((resolve, reject) => {
    axios.get(parseUrl(url, params))
      .then(res => resolve(res.data))
      .catch(reject);
  })
);

export const post = (url, params, data) => (
  new Promise((resolve, reject) => {
    axios.post(`${baseUrl}/api${url}`, data)
      .then(res => resolve(res.data))
      .catch(reject);
  })
);
