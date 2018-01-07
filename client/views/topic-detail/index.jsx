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

import SimpleMDE from 'react-simplemde-editor';

import Container from '../layout/container';
import Reply from './reply';
import { topicDetailStyle } from './styles';
// import { TopicStore } from '../../store/topic-store';

@inject(stores => ({
  topicStore: stores.topicStore,
  user: stores.appStore.user,
}))
@observer
class TopicDetail extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
  }

  state = {
    newReply: '',
  }

  componentDidMount = () => {
    const { id } = this.props.match.params;
    this.props.topicStore.getTopicDetail(id);
  }

  getTopic = () => {
    const { id } = this.props.match.params;
    return this.props.topicStore.detailMap[id];
  }

  handleNewReplyChange = (value) => {
    this.setState({
      newReply: value,
    });
  }

  render() {
    const topic = this.getTopic();
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
                <section>
                  <SimpleMDE
                    onChange={this.handleNewReplyChange}
                    value={this.state.newReply}
                    options={{
                      toolbar: false,
                      autoFocus: false,
                      spellChecker: false,
                      placeholder: '添加您的精彩回复！',
                    }}
                  />
                </section>
                <section>
                  {
                    topic.createdReplies.map(reply => (
                      <Reply reply={reply} key={reply.id} />
                    ))
                  }
                </section>
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
  // user: PropTypes.object.isRequired,
};

export default withStyles(topicDetailStyle)(TopicDetail);
