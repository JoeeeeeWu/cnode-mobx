import React from 'react';
import Helmet from 'react-helmet';
import {
  observer,
  inject,
} from 'mobx-react';
import PropTypes from 'prop-types'; // eslint-disable-line
import Tabs, { Tab } from 'material-ui/Tabs';
import List from 'material-ui/List';
import { CircularProgress } from 'material-ui/Progress';

import Container from '../layout/container';
import TopicListItem from './list-item';
import { AppState, TopicStore } from '../../store/store';

@inject(stores => ({
  appState: stores.appState,
  topicStore: stores.topicStore,
}))
@observer
class TopicList extends React.Component {
  state = {
    tabIndex: 0,
  }

  changeTab = (e, index) => {
    this.setState({
      tabIndex: index,
    });
  }

  listItemClick = () => {

  }

  render() {
    const {
      tabIndex,
    } = this.state;
    const {
      topicStore: {
        topics,
        syncing: syncingTopics,
      },
    } = this.props;

    return (
      <Container>
        <Helmet>
          <title>This is topic list</title>
          <meta name="description" content="This is description" />
        </Helmet>
        <Tabs value={tabIndex} onChange={this.changeTab}>
          <Tab label="全部" />
          <Tab label="分享" />
          <Tab label="工作" />
          <Tab label="问答" />
          <Tab label="精品" />
          <Tab label="测试" />
        </Tabs>
        <List>
          {
            topics.map(topic => <TopicListItem topic={topic} onClick={this.listItemClick} />)
          }
        </List>
      </Container>
    );
  }
}

TopicList.wrappedComponent.propTypes = {
  appState: PropTypes.instanceOf(AppState),
  topicStore: PropTypes.instanceOf(TopicStore),
};

export default TopicList;
