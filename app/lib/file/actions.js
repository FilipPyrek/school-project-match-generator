// @flow
import { remote } from 'electron';
import { push } from 'react-router-redux';
import { fromJS, Map } from 'immutable';
import fs from 'fs';
import { generate, makeInput, makeTeam } from '../../lib/competitionGenerator/allVsAllGenerator';
import type { Result } from '../../lib/competitionGenerator/allVsAllGenerator';

export const SET_ERROR = '@@lib/file/SET_ERROR';
export const SET_RESULT = '@@lib/file/SET_RESULT';
export const OPEN_FILE = '@@lib/file/OPEN_FILE';
export const SAVE_FILE = '@@lib/file/SAVE_FILE';
export const HIDE_SAVE_SNACKBAR = '@@lib/file/HIDE_SAVE_SNACKBAR';

export function setResult(cellMatchIndex: number, teamId: number, value: number | null) {
  return {
    type: SET_RESULT,
    payload: { cellMatchIndex, teamId, value },
  };
}

export function setError(message: string) {
  return {
    type: SET_ERROR,
    payload: {
      message,
    },
  };
}

export function hideSaveSnackbar() {
  return {
    type: HIDE_SAVE_SNACKBAR,
  };
}

type SaveFileType = {
  filename: string,
  competitionData: Result
};

export function saveFile(data: SaveFileType) {
  const { filename, competitionData } = data;
  fs.writeFileSync(filename, JSON.stringify({
    competitionData,
  }), { encoding: 'UTF8' });
  return {
    type: SAVE_FILE,
    payload: data,
  };
}

type NewFileType = {
  teamsCount: number,
  roundsCount: number,
  roundMatchesCount: number,
  teamRestrictions: any
};

export function newFile(data: NewFileType) {
  const { teamsCount, roundsCount, roundMatchesCount, teamRestrictions } = data;
  const restrictions = fromJS(teamRestrictions);
  return (dispatch: () => void) =>
    new Promise((resolve) =>
      remote.dialog.showSaveDialog(
        {
          title: 'Uložit soubor',
          filters: [{
            name: 'Simple brackets soubory (*.sib)',
            extensions: ['sib'],
          }],
        },
        (filename: ?string) =>
          filename
            ? resolve(filename)
            : null,
    ),
  )
  .then((filename) => dispatch(saveFile({
    filename,
    competitionData: generate(
      makeInput(
        Array(teamsCount).fill(0).map((_, teamId) =>
          makeTeam(
            `${teamId + 1}. Tým`,
            restrictions.get(String(teamId), Map())
                         .filter((isRestricted) => isRestricted)
                         .keySeq()
                         .map((key) => Number(key))
                         .toArray(),
          ),
        ), // TEAMS
        roundsCount, // SEASONS_COUNT
        roundMatchesCount, // MAX_MATCHES_IN_SEASON
        4, // MATCHES_TEAM_IN_ROUND
        2, // MAX_TEAM_MATCHES_CONSECUTIVELY
        -1, // MAX_TEAM_PAUSES_CONSECUTIVELY
        true, // ALLOW_INCOMPLETE_TABLE
      ),
    ),
  })))
  .then(({ payload = {} } = {}) => {
    const loadedData = JSON.parse(fs.readFileSync(payload.filename, { encoding: 'UTF8' }));
    return dispatch({
      type: OPEN_FILE,
      payload: {
        filename: payload.filename,
        data: loadedData,
      },
    });
  })
  .then(() => dispatch(push('/edit')))
  .catch((e) => dispatch(setError(e.message)));
}

export function openFile() {
  return (dispatch: () => void) =>
    new Promise((resolve, reject) =>
      remote.dialog.showOpenDialog(
        {
          title: 'Otevřít soubor',
          filters: [{
            name: 'Simple brackets soubory (*.sib)',
            extensions: ['sib'],
          }],
          properties: [true, false, false, false, true, false, false],
        },
        (filename: ?Array<string>) =>
          filename && filename[0]
            ? resolve(filename[0])
            : reject(),
    ),
  )
  .then((filename) => {
    const data = JSON.parse(fs.readFileSync(filename, { encoding: 'UTF8' }));
    return dispatch({
      type: OPEN_FILE,
      payload: {
        filename,
        data,
      },
    });
  })
  .then(() => dispatch(push('/edit')))
  .catch(() => dispatch(push('/')));
}
