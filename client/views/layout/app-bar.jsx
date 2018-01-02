import React from 'react';
import PropTypes from 'prop-types'; // eslint-disable-line
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

class MainAppBar extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  }

  onHomeIconClick = () => {

  }

  createButtonClick = () => {

  }

  loginButtonClick = () => {

  }

  render() {
    const { classes } = this.props;
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
            <Button raised color="accent" onClick={this.createButtonClick}>
              新建话题
            </Button>
            <Button color="contrast" onClick={this.loginButtonClick}>
              登录
            </Button>
          </ToolBar>
        </AppBar>
      </div>
    );
  }
}

export default withStyles(styles)(MainAppBar);
