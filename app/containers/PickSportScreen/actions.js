// @flow

export const SELECT_SPORT = '@@app/PickSportScreen/SELECT_SPORT';
export const SUBMIT = '@@app/PickSportScreen/SUBMIT';

export function selectSport(name: string) {
  return {
    type: SELECT_SPORT,
    payload: {
      name,
    },
  };
}

export function submit() {
  return {
    type: SUBMIT,
  };
}
