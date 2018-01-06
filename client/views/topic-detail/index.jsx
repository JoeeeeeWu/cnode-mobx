import React from 'react';
import PropTypes from 'prop-types'; // eslint-disable-line
import marked from 'marked';
import Helmet from 'react-helmet';

import {
  inject,
  observer,
} from 'mobx-react';

import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import { CircularProgress } from 'material-ui/Progress';

import Container from '../layout/container';
import Reply from './reply';
import { topicDetailStyle } from './styles';
// import { TopicStore } from '../../store/topic-store';

@inject(stores => ({
  topicStore: stores.topicStore,
}))
@observer
class TopicDetail extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
  }

  componentDidMount = () => {
    const { id } = this.props.match.params;
    this.props.topicStore.getTopicDetail(id);
  }

  getTopic = () => {
    const { id } = this.props.match.params;
    return this.props.topicStore.detailMap[id];
  }

  render() {
    const topic = this.getTopic();
    console.log(topic);
    const { classes } = this.props;
    if (!topic) {
      return (
        <Container>
          <section className={classes.loadingContainer}>
            <CircularProgress color="accent" />
          </section>
        </Container>
      );
    }
    return (
      <div>
        <Container>
          <Helmet>
            <title>{topic.title}</title>
          </Helmet>
          <header className={classes.header}>
            <h3>{topic.title}</h3>
          </header>
          <section className={classes.body}>
            <p dangerouslySetInnerHTML={{ __html: marked(topic.content) }} />
          </section>
        </Container>
        {
          topic.createdReplies && topic.createdReplies.length > 0 ?
            (
              <Paper>
                <header className={classes.replyHeader}>
                  <span>我的最新回复</span>
                </header>
                {
                  topic.createdReplies.map(reply => (
                    <Reply reply={reply} key={reply.id} />
                  ))
                }
              </Paper>
            ) :
            null
        }
      </div>
    );
  }
}

TopicDetail.wrappedComponent.propTypes = {
  topicStore: PropTypes.object.isRequired,
};

export default withStyles(topicDetailStyle)(TopicDetail);
