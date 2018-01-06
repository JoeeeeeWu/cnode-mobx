import React from 'react';
import {
  inject,
  observer,
} from 'mobx-react';
import { withStyles } from 'material-ui/styles';
import loginStyles from './styles/login-style';

@inject(stores => ({
  appStore: stores.appStore,
  user: stores.appStore.user,
}))
@observer
class UserLogin extends React.Component {
  render() {
    return (
      <div>haha</div>
    );
  }
}

export default withStyles(loginStyles)(UserLogin);
