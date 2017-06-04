// @flow
import { Record, fromJS } from 'immutable';
import { SET_SPORT, OPEN_FILE, SET_ERROR } from './actions';

type actionType = {
  type: string,
  payload?: {
    name?: string,
    message?: string
  }
};

const FileState = Record({
  name: '',
  fileData: {},
  error: null,
});
const initialState = new FileState();

export default function fileReducer(state: FileState = initialState, action: actionType) {
  switch (action.type) {
    case SET_SPORT: {
      const { payload = {} } = action;
      return state.set('name', payload.name || 'football');
    }
    case SET_ERROR: {
      const { payload = {} } = action;
      return state.set('error', payload.message);
    }
    case OPEN_FILE: {
      return state.set('fileData', fromJS(action.payload));
    }
    default:
      return state;
  }
}
