// @flow
import { Record } from 'immutable';
import { SET_SPORT } from './actions';

type actionType = {
  type: string,
  payload?: {
    name?: string
  }
};

const FileState = Record({
  name: '',
});
const initialState = new FileState();

export default function fileReducer(state: FileState = initialState, action: actionType) {
  switch (action.type) {
    case SET_SPORT: {
      const { payload = {} } = action;
      return state.set('name', payload.name || 'football');
    }
    default:
      return state;
  }
}
