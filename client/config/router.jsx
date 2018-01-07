import React from 'react';
import {
  Route,
  Redirect,
  withRouter,
} from 'react-router-dom';
import {
  inject,
  observer,
} from 'mobx-react';
import PropTypes from 'prop-types'; // eslint-disable-line

import TopicList from '../views/topic-list';
import TopicDetail from '../views/topic-detail';
import UserLogin from '../views/user/login';
import UserInfo from '../views/user/info';
import TopicCreate from '../views/topic-create';

const PrivateRoute = ({ isLogin, component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      isLogin ?
        <Component {...props} /> :
        <Redirect
          to={{
            pathname: '/user/login',
            search: `?from=${rest.path}`,
          }}
        />
    )}
  />
);

PrivateRoute.propTypes = {
  component: PropTypes.element.isRequired,
  isLogin: PropTypes.bool,
};

PrivateRoute.defaultProps = {
  isLogin: false,
};

const InjectedPrivateRoute = withRouter(inject(stores => ({
  isLogin: stores.appStore.user.isLogin,
}))(observer(PrivateRoute)));

export default () => [
  <Route path="/" render={() => <Redirect to="/index" />} exact key="/" />,
  <Route path="/index" component={TopicList} exact key="index" />,
  <Route path="/detail/:id" component={TopicDetail} key="detail" />,
  <Route path="/user/login" component={UserLogin} exact key="login" />,
  <InjectedPrivateRoute path="/user/info" component={UserInfo} exact key="user-info" />,
  <InjectedPrivateRoute path="/topic/create" component={TopicCreate} key="create" />,
];
