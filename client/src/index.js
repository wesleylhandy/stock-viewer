import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import store from './store';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import StateLoader from './StateLoader';

const stateLoader = new StateLoader();

store.subscribe(() => stateLoader.saveState(store.getState()));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();
