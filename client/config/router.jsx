import React from 'react';
import {
  Route,
  Redirect,
} from 'react-router-dom';

import TopicList from '../views/topic-list';

export default () => [
  <Route path="/" render={() => <Redirect to="/list" />} exact key="first" />,
  <Route path="/list" component={TopicList} key="list" />,
];
