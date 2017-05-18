// @flow

export const SET_SPORT = '@@lib/file/SET_SPORT';

export function setSport(name: string) {
  return {
    type: SET_SPORT,
    payload: {
      name,
    },
  };
}
