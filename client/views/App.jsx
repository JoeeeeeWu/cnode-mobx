import React from 'react';

import Routes from '../config/router';
import AppBar from './layout/app-bar';

function App() {
  return (
    <div>
      <AppBar key="app-bar" />
      <Routes key="routes" />,
    </div>
  );
}

export default App;
