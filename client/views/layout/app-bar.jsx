import React from 'react';
import PropTypes from 'prop-types'; // eslint-disable-line
import {
  inject,
  observer,
} from 'mobx-react';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import ToolBar from 'material-ui/Toolbar';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import HomeIcon from 'material-ui-icons/Home';

const styles = {
  root: {
    width: '100%',
  },
  flex: {
    flex: 1,
  },
};

@inject(stores => ({
  user: stores.appStore.user,
}))
@observer
class MainAppBar extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
  }

  static contextTypes = {
    router: PropTypes.object,
  }

  onHomeIconClick = () => {
    this.context.router.history.push('/');
  }

  goToCreate = () => {
    this.context.router.history.push('/topic/create');
  }

  goToUser = () => {
    const { location } = this.props;
    if (location.pathname !== '/user/login') {
      if (this.props.user.isLogin) {
        this.context.router.history.push('/user/info');
      } else {
        this.context.router.history.push({
          pathname: '/user/login',
          search: `?from=${location.pathname}`,
        });
      }
    }
  }

  render() {
    const {
      classes,
      user,
    } = this.props;
    console.log(this.props);
    return (
      <div className={classes.root}>
        <AppBar position="fixed">
          <ToolBar>
            <IconButton color="contrast" onClick={this.onHomeIconClick}>
              <HomeIcon />
            </IconButton>
            <Typography type="title" color="inherit" className={classes.flex}>
              CNODE
            </Typography>
            <Button raised color="accent" onClick={this.goToCreate}>
              新建话题
            </Button>
            <Button color="contrast" onClick={this.goToUser}>
              {user.isLogin ? user.info.loginname : '登录'}
            </Button>
          </ToolBar>
        </AppBar>
      </div>
    );
  }
}

MainAppBar.wrappedComponent.propTypes = {
  user: PropTypes.object.isRequired,
};

export default withStyles(styles)(MainAppBar);
