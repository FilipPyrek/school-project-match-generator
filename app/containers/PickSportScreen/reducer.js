// @flow
import { SELECT_SPORT } from './actions';

type actionType = {
  type: string,
  payload?: {
    name?: string
  }
};

export default function pickSportReducer(state: string = 'football', action: actionType) {
  switch (action.type) {
    case SELECT_SPORT: {
      const { payload = {} } = action;
      return payload.name || 'football';
    }
    default:
      return state;
  }
}
