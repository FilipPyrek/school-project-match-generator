// @flow
export const SET_TEAMS_COUNT = '@@app/PickSportScreen/SET_TEAMS_COUNT';
export const SET_ROUNDS_COUNT = '@@app/PickSportScreen/SET_ROUNDS_COUNT';
export const SET_ROUND_MATCHES_COUNT = '@@app/PickSportScreen/SET_ROUND_MATCHES_COUNT';

export function setTeamsCount(count: ?number) {
  return {
    type: SET_TEAMS_COUNT,
    payload: { count },
  };
}

export function setRoundsCount(count: ?number) {
  return {
    type: SET_ROUNDS_COUNT,
    payload: { count },
  };
}

export function setRoundMatchesCount(count: ?number) {
  return {
    type: SET_ROUND_MATCHES_COUNT,
    payload: { count },
  };
}
