import React from 'react';
import {
  inject,
  observer,
} from 'mobx-react';
import PropTypes from 'prop-types'; // eslint-disable-line
import queryString from 'query-string';
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';

import { Redirect } from 'react-router-dom';

import UserWrapper from './user';
import loginStyles from './styles/login-style';

@inject(stores => ({
  appStore: stores.appStore,
  user: stores.appStore.user,
}))
@observer
class UserLogin extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    appStore: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
  }

  state = {
    accesstoken: '',
    helpText: '',
  }

  getFrom = () => {
    const { from } = queryString.parse(this.props.location.search);
    return from || '/user/info';
  }

  handleInput = (e) => {
    this.setState({
      accesstoken: e.target.value.trim(),
    });
  }

  handleLogin = () => {
    if (!this.state.accesstoken) {
      this.setState({
        helpText: '必须填写',
      });
      return;
    }
    this.setState({
      helpText: '',
    });
    this.props.appStore.login(this.state.accesstoken)
      .catch(err => this.props.appStore.notify({
        message: err,
      }));
  }

  render() {
    const { classes } = this.props;
    const { isLogin } = this.props.user;
    const from = this.getFrom();
    if (isLogin) {
      return (
        <Redirect to={from} />
      );
    }
    return (
      <UserWrapper>
        <div className={classes.root}>
          <TextField
            label="请输入cnode accesstoken"
            placeholder="请输入cnode accesstoken"
            required
            helpText={this.state.helpText}
            value={this.state.accesstoken}
            onChange={this.handleInput}
            className={classes.input}
          />
          <Button
            raised
            color="accent"
            onClick={this.handleLogin}
            className={classes.loginButton}
          >
            登录
          </Button>
        </div>
      </UserWrapper>
    );
  }
}

export default withStyles(loginStyles)(UserLogin);
