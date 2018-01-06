import React from 'react';
import {
  Route,
  Redirect,
} from 'react-router-dom';

import TopicList from '../views/topic-list';
import TopicDetail from '../views/topic-detail';
import UserLogin from '../views/user/login';

export default () => [
  <Route path="/" render={() => <Redirect to="/index" />} exact key="/" />,
  <Route path="/index" component={TopicList} exact key="index" />,
  <Route path="/detail/:id" component={TopicDetail} exact key="detail" />,
  <Route path="/user/login" component={UserLogin} exact key="login" />,
];
