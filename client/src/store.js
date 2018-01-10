import { createStore, compose } from 'redux';

//import the root reducer
import rootReducer from './reducers/index';

// create an object for the default data
import StateLoader from './StateLoader'

const enhancers = compose(
  window.devToolsExtension ? window.devToolsExtension() : f => f
)

const stateLoader = new StateLoader();

const store = createStore(rootReducer, stateLoader.loadState(), enhancers);

if (module.hot) {
  module.hot.accept('./reducers/', () => {
    const nextRootReducer = require('./reducers/index').default;
    store.replaceReducer(nextRootReducer)
  })
}

export default store;