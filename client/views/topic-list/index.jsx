import React from 'react';
import Helmet from 'react-helmet';
// import PropTypes from 'prop-types';
import Tabs, { Tab } from 'material-ui/Tabs';

import Container from '../layout/container';
import TopicListItem from './list-item';

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
        <TopicListItem topic={{}} onClick={this.listItemClick} />
      </Container>
    );
  }
}

export default TopicList;
