import React from 'react';
import PropTypes from 'prop-types'; // eslint-disable-line
import {
  withRouter,
} from 'react-router-dom';

import Routes from '../config/router';
import AppBar from './layout/app-bar';

function App({ location }) {
  return (
    <div>
      <AppBar location={location} key="app-bar" />
      <Routes key="routes" />,
    </div>
  );
}

App.propTypes = {
  location: PropTypes.object.isRequired,
};

export default withRouter(App);
