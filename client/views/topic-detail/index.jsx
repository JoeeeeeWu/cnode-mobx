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
import Button from 'material-ui/Button';
import IconReply from 'material-ui-icons/Reply';
import SimpleMDE from 'react-simplemde-editor';

import Container from '../layout/container';
import Reply from './reply';
import { topicDetailStyle } from './styles';
// import { TopicStore } from '../../store/topic-store';

@inject(stores => ({
  topicStore: stores.topicStore,
  appStore: stores.appStore,
  user: stores.appStore.user,
}))
@observer
class TopicDetail extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
  }

  static contextTypes = {
    router: PropTypes.object,
  }

  state = {
    newReply: '',
    showEditor: false,
  }

  componentDidMount = () => {
    const { id } = this.props.match.params;
    this.props.topicStore.getTopicDetail(id);
    setTimeout(() => {
      this.setState({
        showEditor: true,
      });
    }, 1000);
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

  handleReply = () => {
    this.getTopic().doReply(this.state.newReply)
      .then(() => {
        this.setState({
          newReply: '',
        });
        this.props.appStore.notify({
          message: '评论成功',
        });
      })
      .catch(() => {
        this.props.appStore.notify({
          message: '评论失败',
        });
      });
  }

  goToLogin = () => {
    const { location } = this.props;
    this.context.router.history.push({
      pathname: '/user/login',
      search: `?from=${location.pathname}`,
    });
  }

  render() {
    const topic = this.getTopic();
    const {
      classes,
      user,
    } = this.props;
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
              <Paper elevation={4} className={classes.replies}>
                <header className={classes.replyHeader}>
                  <span>我的最新回复</span>
                </header>
                {
                  topic.createdReplies.map(reply => (
                    <Reply
                      reply={Object.assign({}, reply, {
                        author: {
                          avatar_url: user.info.avatar_url,
                          loginname: user.info.loginname,
                        },
                      })}
                      key={reply.id}
                    />
                  ))
                }
              </Paper>
            ) :
            null
        }
        <Paper elevation={4} className={classes.replies}>
          <header className={classes.replyHeader}>
            <span>共{`${topic.reply_count}条回复`}</span>
          </header>
          {
            this.state.showEditor && user.isLogin &&
            <section className={classes.replyEditor}>
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
              <Button fab color="primary" onClick={this.handleReply} className={classes.replyButton}>
                <IconReply />
              </Button>
            </section>
          }
          {
            !user.isLogin && (
              <section className={classes.notLoginButton}>
                <Button raised color="accent" onClick={this.goToLogin}>登录进行回复</Button>
              </section>
            )
          }
          <section>
            {
              topic.replies.map(reply => <Reply reply={reply} key={reply.id} />)
            }
          </section>
        </Paper>
      </div>
    );
  }
}

TopicDetail.wrappedComponent.propTypes = {
  topicStore: PropTypes.object.isRequired,
  appStore: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

export default withStyles(topicDetailStyle)(TopicDetail);
