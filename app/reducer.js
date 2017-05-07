// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import counter from './containers/CounterPage/reducer';

const rootReducer = combineReducers({
  counter,
  router,
});

export default rootReducer;
