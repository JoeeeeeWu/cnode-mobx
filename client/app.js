import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';
import { AppContainer } from 'react-hot-loader'; // eslint-disable-line

import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import { lightBlue, pink } from 'material-ui/colors';

import App from './views/App';
import { AppStore, TopicStore } from './store/store';

const theme = createMuiTheme({
  palette: {
    primary: pink,
    accent: lightBlue,
    type: 'light',
  },
});

const initialState = window.__INITIAL__STATE__ || {}; // eslint-disable-line

const createApp = (TheApp) => {
  class Main extends React.Component {
    // Remove the server-side injected CSS.
    componentDidMount() {
      const jssStyles = document.getElementById('jss-server-side');
      if (jssStyles && jssStyles.parentNode) {
        jssStyles.parentNode.removeChild(jssStyles);
      }
    }

    render() {
      return <TheApp />;
    }
  }
  return Main;
};

const appStore = new AppStore();
// appStore.init(initialState.appStore);
const topicStore = new TopicStore(initialState.topicStore);

const root = document.getElementById('root');
const render = (Component) => {
  ReactDOM.hydrate(
    <AppContainer>
      <Provider appStore={appStore} topicStore={topicStore}>
        <BrowserRouter>
          <MuiThemeProvider theme={theme}>
            <Component />
          </MuiThemeProvider>
        </BrowserRouter>
      </Provider>
    </AppContainer>,
    root,
  );
};

render(createApp(App));

if (module.hot) {
  module.hot.accept('./views/App.jsx', () => {
    const NextApp = require('./views/App.jsx').default; // eslint-disable-line
    render(NextApp);
  });
}
