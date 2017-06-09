// @flow
import { Record, fromJS } from 'immutable';
import {
  SAVE_FILE,
  OPEN_FILE,
  SET_ERROR,
  SET_RESULT,
  HIDE_SAVE_SNACKBAR,
} from './actions';

type actionType = {
  type: string,
  payload?: {
    name?: string,
    filename?: string,
    message?: string,
    cellMatchIndex?: number,
    teamId?: number,
    value?: number | null,
    data?: any
  }
};

const FileState = Record({
  filename: '',
  fileData: {},
  error: null,
  showSaveSnackbar: false,
});
const initialState = new FileState();

export default function fileReducer(state: FileState = initialState, action: actionType) {
  switch (action.type) {
    case SET_RESULT: {
      const { payload = {} } = action;
      const { cellMatchIndex, teamId, value } = payload;
      return state.setIn([
        'fileData',
        'competitionData',
        'allMatches',
        String(cellMatchIndex),
        'result',
        `team${String(teamId)}Score`,
      ], value);
    }
    case SET_ERROR: {
      const { payload = {} } = action;
      return state.set('error', payload.message);
    }
    case SAVE_FILE: {
      return state.set('showSaveSnackbar', true);
    }
    case HIDE_SAVE_SNACKBAR: {
      return state.set('showSaveSnackbar', false);
    }
    case OPEN_FILE: {
      const { payload = {} } = action;
      const { filename, data } = payload;
      return state.set('filename', filename).set('fileData', fromJS(data));
    }
    default:
      return state;
  }
}
