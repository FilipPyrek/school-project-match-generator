// @flow
import { Map, fromJS } from 'immutable';
import {
  SELECT_SPORT,
  SET_TEAMS_COUNT,
  SET_ROUNDS_COUNT,
  SET_ROUND_MATCHES_COUNT,
} from './actions';

type actionType = {
  type: string,
  payload?: {
    name?: string,
    count?: ?number
  }
};

const initialState = fromJS({
  sport: 'football',
  teamsCount: null,
  roundsCount: null,
  roundMatchesCount: null,
});

export default function pickSportReducer(state: Map = initialState, action: actionType) {
  switch (action.type) {
    case SELECT_SPORT: {
      const { payload = {} } = action;
      return state.set('sport', payload.name);
    }
    case SET_TEAMS_COUNT: {
      const { payload = {} } = action;
      return state.set('teamsCount', payload.count);
    }
    case SET_ROUNDS_COUNT: {
      const { payload = {} } = action;
      return state.set('roundsCount', payload.count);
    }
    case SET_ROUND_MATCHES_COUNT: {
      const { payload = {} } = action;
      return state.set('roundMatchesCount', payload.count);
    }
    default:
      return state;
  }
}
