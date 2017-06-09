// @flow
import { Map, fromJS } from 'immutable';
import { LOCATION_CHANGE } from 'react-router-redux';
import {
  SET_TEAMS_COUNT,
  SET_ROUNDS_COUNT,
  SET_ROUND_MATCHES_COUNT,
} from './actions';

type actionType = {
  type: string,
  payload?: {
    name?: string,
    count?: ?number,
    pathname?: string
  }
};

const initialState = fromJS({
  teamsCount: null,
  roundsCount: null,
  roundMatchesCount: null,
});

export default function pickSportReducer(state: Map = initialState, action: actionType) {
  switch (action.type) {
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
    case LOCATION_CHANGE: {
      const { payload = {} } = action;
      const { pathname } = payload;
      return pathname === '/pick-sport' ? initialState : state;
    }
    default:
      return state;
  }
}
