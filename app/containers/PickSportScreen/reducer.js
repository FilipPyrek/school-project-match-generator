// @flow
import { Map, fromJS } from 'immutable';
import { LOCATION_CHANGE } from 'react-router-redux';
import {
  SET_TEAMS_COUNT,
  SET_ROUNDS_COUNT,
  SET_ROUND_MATCHES_COUNT,
  NEXT_STAGE,
  SET_RESTRICTION,
} from './actions';

type actionType = {
  type: string,
  payload?: {
    count?: ?number,
    pathname?: string,
    isRestricted?: boolean,
    teamId?: number,
    roundId?: number
  }
};

const initialState = fromJS({
  teamsCount: null,
  roundsCount: null,
  roundMatchesCount: null,
  stage: 0,
  teamRestrictions: {},
});

export default function pickSportReducer(state: Map = initialState, action: actionType) {
  switch (action.type) {
    case SET_TEAMS_COUNT: {
      const { payload = {} } = action;
      return state.set('teamsCount', Math.round(Number(payload.count)));
    }
    case SET_ROUNDS_COUNT: {
      const { payload = {} } = action;
      return state.set('roundsCount', Math.round(Number(payload.count)));
    }
    case SET_ROUND_MATCHES_COUNT: {
      const { payload = {} } = action;
      return state.set('roundMatchesCount', Math.round(Number(payload.count)));
    }
    case LOCATION_CHANGE: {
      const { payload = {} } = action;
      const { pathname } = payload;
      return pathname === '/pick-sport' ? initialState : state;
    }
    case NEXT_STAGE: {
      const { teamsCount, roundsCount, roundMatchesCount } = state.toJS();
      if (teamsCount > 1 && roundsCount > 0 && roundMatchesCount > 0) {
        return state.set('stage', 1);
      }
      return state;
    }
    case SET_RESTRICTION: {
      const { payload = {} } = action;
      const { isRestricted, teamId, roundId } = payload;
      return state.setIn(['teamRestrictions', teamId, roundId], isRestricted);
    }
    default:
      return state;
  }
}
