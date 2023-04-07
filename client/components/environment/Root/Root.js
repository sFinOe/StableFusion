import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { HistoryRouter as Router } from 'redux-first-history/rr6';
import { NextUIProvider } from '@nextui-org/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import Main from '_components/environment/Main';

const queryClient = new QueryClient();

export default function Root({ history, store }) {
  return (
    <QueryClientProvider client={queryClient}>
    <NextUIProvider>
      <Provider store={store}>
        <Router history={history}>
          <Main />
        </Router>
      </Provider>
    </NextUIProvider>
    </QueryClientProvider>
  );
}

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};
