import React from 'react';
import Helmet from 'react-helmet';
import {
  observer,
  inject,
} from 'mobx-react';
import PropTypes from 'prop-types'; // eslint-disable-line
import queryString from 'query-string';
import Tabs, { Tab } from 'material-ui/Tabs';
import List from 'material-ui/List';
import { CircularProgress } from 'material-ui/Progress';

import { TopicStore } from '../../store/store';
import Container from '../layout/container';
import TopicListItem from './list-item';
import { tabs } from '../../util/variable-define';

@inject(stores => ({
  appStore: stores.appStore,
  topicStore: stores.topicStore,
}))
@observer
class TopicList extends React.Component {
  static propTypes = {
    // user: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
  }

  static contextTypes = {
    router: PropTypes.object,
  }

  componentDidMount = () => {
    const tab = this.getTab(this.props.location.search);
    this.props.topicStore.fetchTopics(tab);
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.location.search !== this.props.location.search) {
      const tab = this.getTab(nextProps.location.search);
      this.props.topicStore.fetchTopics(tab);
    }
  }

  getTab = (search) => {
    const { tab = 'all' } = queryString.parse(search);
    return tab;
  }

  changeTab = (e, value) => {
    this.context.router.history.push({
      pathname: '/index',
      search: `?tab=${value}`,
    });
  }

  goToTopic = (id) => {
    this.context.router.history.push(`/detail/${id}`);
  }

  render() {
    const {
      topicStore: {
        topics,
        createdTopics,
        syncing: syncingTopics,
      },
    } = this.props;
    const tab = this.getTab(this.props.location.search);

    return (
      <Container>
        <Helmet>
          <title>This is topic list</title>
          <meta name="description" content="This is description" />
        </Helmet>
        <Tabs value={tab} onChange={this.changeTab}>
          {
            Object.keys(tabs).map(t => <Tab key={t} label={tabs[t]} value={t} />)
          }
        </Tabs>
        {
          createdTopics && createdTopics.length > 0 ?
            <List style={{ backgroundColor: '#dfdfdf' }}>
              {
                createdTopics.map(topic => (
                  <TopicListItem
                    key={topic.id}
                    topic={topic}
                    onClick={() => this.goToTopic(topic.id)}
                  />
                ))
              }
            </List> :
            null
        }
        <List>
          {
            topics.map(topic => (
              <TopicListItem
                key={topic.id}
                topic={topic}
                onClick={() => this.goToTopic(topic.id)}
              />
            ))
          }
        </List>
        {
          syncingTopics ?
            (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  padding: '40px',
                }}
              >
                <CircularProgress color="accent" size={100} />
              </div>
            ) :
            null
        }
      </Container>
    );
  }
}

TopicList.wrappedComponent.propTypes = {
  topicStore: PropTypes.instanceOf(TopicStore).isRequired,
};

export default TopicList;
