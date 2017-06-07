// @flow
import { remote } from 'electron';
import { push } from 'react-router-redux';
import fs from 'fs';
import { generate, makeInput, makeTeam } from '../../lib/competitionGenerator/allVsAllGenerator';
import type { Result } from '../../lib/competitionGenerator/allVsAllGenerator';

export const SET_SPORT = '@@lib/file/SET_SPORT';
export const SET_ERROR = '@@lib/file/SET_ERROR';
export const SET_RESULT = '@@lib/file/SET_RESULT';
export const OPEN_FILE = '@@lib/file/SAVE_FILE';

export function setSport(name: string) {
  return {
    type: SET_SPORT,
    payload: {
      name,
    },
  };
}

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

type SaveFileType = {
  sport: string,
  filename: string,
  competitionData: Result
};

export function saveFile(data: SaveFileType) {
  const { sport, filename, competitionData } = data;
  fs.writeFileSync(filename, JSON.stringify({
    sport,
    competitionData,
  }), { encoding: 'UTF8' });
  return {
    type: OPEN_FILE,
    payload: data,
  };
}

type NewFileType = {
  sport: string,
  teamsCount: number,
  roundsCount: number,
  roundMatchesCount: number
};

export function newFile(data: NewFileType) {
  const { sport, teamsCount, roundsCount, roundMatchesCount } = data;
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
    sport,
    competitionData: generate(
      makeInput(
        Array(teamsCount).fill(0).map((_, i) => makeTeam(`${i + 1}. Tým`, [])), // TEAMS
        roundsCount, // SEASONS_COUNT
        roundMatchesCount, // MAX_MATCHES_IN_SEASON
        4, // MATCHES_TEAM_IN_ROUND
        2, // MAX_TEAM_MATCHES_CONSECUTIVELY
        -1, // MAX_TEAM_PAUSES_CONSECUTIVELY
        true, // ALLOW_INCOMPLETE_TABLE
      ),
    ),
  })))
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
      payload: data,
    });
  })
  .then(() => dispatch(push('/edit')))
  .catch(() => dispatch(push('/')));
}
