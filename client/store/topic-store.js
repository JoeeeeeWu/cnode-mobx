import {
  observable,
  // toJS,
  computed,
  action,
  extendObservable,
} from 'mobx';
// import { create } from 'domain';

import { topicSchema } from '../util/variable-define';
import { get } from '../util/http';

const createTopic = topic => Object.assign({}, topicSchema, topic);

class Topic {
  constructor(data) {
    extendObservable(this, data);
  }
  @observable
  syncing = false;
}

class TopicStore {
  @observable
  topics;
  @observable
  details;
  @observable
  syncing;

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
  addTopic = (topic) => {
    this.topics.push(new Topic(createTopic(topic)));
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
        res.data.forEach((topic) => {
          this.addTopic(topic);
        });
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

  @action getTopicDetail = id => new Promise((resolve, reject) => {
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
}

export default TopicStore;
