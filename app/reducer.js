// @flow
import { combineReducers } from 'redux-immutable';
import router from './lib/router/reducer';
import file from './lib/file/reducer';
import pickSport from './containers/PickSportScreen/reducer';

const rootReducer = combineReducers({
  file,
  pickSport,
  router,
});

export default rootReducer;
