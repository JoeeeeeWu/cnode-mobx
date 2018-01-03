import {
  observable,
  toJS,
  computed,
  action,
  extendObservable,
} from 'mobx';

import { topicSchema } from '../util/variable-define';
import { get } from '../util/http';
import { create } from 'domain';

const createTopic = topic => Object({}, topicSchema, topic);

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
  syncing;

  constructor({ syncing, topics } = { syncing: false, topics: [] }) {
    this.syncing = syncing;
    this.topics = topics.map(topic => new Topic(createTopic(topic)));
  }

  addTopic = (topic) => {
    this.topics.push(new Topic(createTopic(topic)));
  }

  @action
  fetchTopics = () => new Promise((resolve, reject) => {
    this.syncing = true;
    get('/topics', {
      mdrender: false,
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
}
