import { fromJS } from 'immutable';
import { LOCATION_CHANGE } from 'react-router-redux';

const initialState = fromJS({
  location: null,
});

export default function routerReducer(state = initialState, action = {}) {
  if (action.type === LOCATION_CHANGE) {
    return state.concat(fromJS({ location: action.payload }));
  }

  return state;
}
