import {
  observable,
  // computed,
  action,
} from 'mobx';

import { get, post } from '../util/http';

let notifyId = 0;

export default class AppStore {
  @observable
  user = {
    isLogin: false,
    info: {},
    detail: {
      syncing: false,
      recent_topics: [],
      recent_replies: [],
    },
    collections: {
      syncing: false,
      list: [],
    },
  };
  @observable
  activeNotifications = [];

  @action
  notify = (config) => {
    config.id = notifyId; // eslint-disable-line
    notifyId += 1;
    this.activeNotifications.push(config);
  }

  @action
  login = accessToken => new Promise((resolve, reject) => {
    post('/user/login', {
      accessToken,
    }).then((res) => {
      if (res.success) {
        this.user.isLogin = true;
        this.user.info = res.data;
        resolve();
        this.notify({ message: '登录成功' });
      } else {
        reject(res);
      }
    }).catch(reject);
  });

  @action
  getUserDetail = () => {
    this.user.detail.syncing = true;
    return new Promise((resolve, reject) => {
      get(`/user/${this.user.info.loginname}`)
        .then((res) => {
          if (res.success) {
            this.user.detail.recent_replies = res.data.recent_replies;
            this.user.detail.recent_topics = res.data.recent_topics;
            resolve();
          }
          this.user.detail.syncing = false;
        }).catch((err) => {
          reject(err.message);
          this.user.detail.syncing = false;
        });
    });
  }

  @action
  getUserCollection = () => {
    this.user.collections.syncing = true;
    return new Promise((resolve, reject) => {
      get(`/topic_collect/${this.user.info.loginname}`)
        .then((res) => {
          if (res.success) {
            this.user.collections.list = res.data;
            resolve();
          }
          this.user.collections.syncing = false;
        }).catch((err) => {
          reject(err.message);
          this.collections.syncing = false;
        });
    });
  }
}

