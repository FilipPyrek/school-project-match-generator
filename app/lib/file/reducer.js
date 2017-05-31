// @flow
import { Record, fromJS } from 'immutable';
import { SET_SPORT, SAVE_FILE } from './actions';

type actionType = {
  type: string,
  payload?: {
    name?: string
  }
};

const FileState = Record({
  name: '',
  fileData: {},
});
const initialState = new FileState();

export default function fileReducer(state: FileState = initialState, action: actionType) {
  switch (action.type) {
    case SET_SPORT: {
      const { payload = {} } = action;
      return state.set('name', payload.name || 'football');
    }
    case SAVE_FILE: {
      return state.set('fileData', fromJS(action.payload));
    }
    default:
      return state;
  }
}
