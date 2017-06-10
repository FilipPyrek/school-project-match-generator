// @flow
export const SET_TEAMS_COUNT = '@@app/PickSportScreen/SET_TEAMS_COUNT';
export const SET_ROUNDS_COUNT = '@@app/PickSportScreen/SET_ROUNDS_COUNT';
export const SET_ROUND_MATCHES_COUNT = '@@app/PickSportScreen/SET_ROUND_MATCHES_COUNT';
export const NEXT_STAGE = '@@app/PickSportScreen/NEXT_STAGE';
export const SET_RESTRICTION = '@@app/PickSportScreen/SET_RESTRICTION ';

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

export function nextStage() {
  return {
    type: NEXT_STAGE,
  };
}

type SetRestrictionType = {
  isRestricted: boolean,
  teamId: number,
  roundId: number,
};

export function setRestriction(data: SetRestrictionType) {
  return {
    type: SET_RESTRICTION,
    payload: data,
  };
}
