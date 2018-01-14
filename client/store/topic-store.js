import {
  observable,
  // toJS,
  computed,
  action,
  extendObservable,
} from 'mobx';
// import { create } from 'domain';

import { topicSchema } from '../util/variable-define';
import { get, post } from '../util/http';

const createTopic = topic => Object.assign({}, topicSchema, topic);

class Topic {
  constructor(data) {
    extendObservable(this, data);
  }
  @observable
  createdReplies = [];
  @observable
  syncing = false;

  @action
  doReply = content => new Promise((resolve, reject) => {
    post(`/topic/${this.id}/replies`, {
      content,
    })
      .then((res) => {
        if (res.success) {
          this.createdReplies.push({
            create_at: Date.now(),
            id: res.reply_id,
            content,
          });
          resolve({
            replyId: res.reply_id,
            content,
          });
        } else {
          reject();
        }
      })
      .catch(reject);
  });
}

class TopicStore {
  @observable
  topics;
  @observable
  details;
  @observable
  syncing = false;
  @observable
  cteatedTopics;
  @observable
  tab = undefined;

  constructor({ syncing = false, topics = [], details = [] } = {}) {
    this.syncing = syncing;
    this.topics = topics.map(topic => new Topic(createTopic(topic)));
    this.details = details.map(detail => new Topic(createTopic(detail)));
  }

  @computed get detailMap() {
    return this.details.reduce((result, detail) => {
      result[detail.id] = detail; // eslint-disable-line
      return result;
    }, {});
  }

  @action
  fetchTopics = tab => new Promise((resolve, reject) => {
    this.syncing = true;
    this.topics = [];
    get('/topics', {
      mdrender: false,
      tab,
    }).then((res) => {
      if (res.success) {
        this.topics = res.data.map(topic => new Topic(createTopic(topic)));
        resolve();
      } else {
        reject();
      }
      this.syncing = false;
    }).catch((err) => {
      reject(err);
      this.syncing = false;
    });
  })

  @action
  getTopicDetail = id => new Promise((resolve, reject) => {
    if (this.detailMap[id]) {
      resolve(this.detailMap[id]);
    } else {
      get(`/topic/${id}`, {
        mdrender: false,
      }).then((res) => {
        if (res.success) {
          const topic = new Topic(createTopic(res.data));
          this.details.push(topic);
          resolve(topic);
        } else {
          reject();
        }
      }).catch(err => reject(err));
    }
  })

  @action
  createTopic = (title, tab, content) => new Promise((resolve, reject) => {
    post('/topics', {
      title,
      content,
      tab,
      needAccessToken: true,
    }).then((res) => {
      if (res.success) {
        const topic = {
          title,
          content,
          tab,
          id: res.topic_id,
          create_at: Date.now(),
        };
        this.cteatedTopics.push(new TopicStore(createTopic(topic)));
        resolve(topic);
      } else {
        reject(new Error(res.error_msg || '未知错误'));
      }
    }).catch((err) => {
      if (err.response) {
        reject(new Error(err.response.data.error_msg || '未知错误'));
      } else {
        reject(new Error('未知错误'));
      }
    });
  });
}

export default TopicStore;
