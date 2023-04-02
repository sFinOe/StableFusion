import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { HistoryRouter as Router } from 'redux-first-history/rr6';
import { NextUIProvider } from '@nextui-org/react';

import Main from '_components/environment/Main';

export default function Root({ history, store }) {
  return (
    <NextUIProvider>
      <Provider store={store}>
        <Router history={history}>
          <Main />
        </Router>
      </Provider>
    </NextUIProvider>
  );
}

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};
