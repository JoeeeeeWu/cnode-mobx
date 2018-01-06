import AppStore from './app-store';
import TopicStore from './topic-store';

export { AppStore, TopicStore };

export default {
  AppStore,
  TopicStore,
};

export const createStoreMap = () => ({
  appStore: new AppStore(),
  topicStore: new TopicStore(),
});
