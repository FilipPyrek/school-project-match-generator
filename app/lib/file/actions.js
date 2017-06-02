// @flow
import { remote } from 'electron';
import { push } from 'react-router-redux';
import fs from 'fs';
import { generate, makeInput, makeTeam } from '../../lib/competitionGenerator/allVsAllGenerator';
import type { Result } from '../../lib/competitionGenerator/allVsAllGenerator';

export const SET_SPORT = '@@lib/file/SET_SPORT';
export const SAVE_FILE = '@@lib/file/SAVE_FILE';

export function setSport(name: string) {
  return {
    type: SET_SPORT,
    payload: {
      name,
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
  }));
  return {
    type: SAVE_FILE,
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
    new Promise((resolve, reject) =>
      remote.dialog.showSaveDialog(
        { title: 'Uložit soubor' },
        (filename: ?string) =>
          filename
            ? resolve(filename)
            : reject(),
    ),
  )
  .catch(() => dispatch(push('/pick-sport')))
  .then((filename) => dispatch(saveFile({
    filename,
    sport,
    competitionData: generate(
      makeInput(
        Array(teamsCount).fill(0).map((_, i) => makeTeam(`${i + 1}. Team`, [])), // TEAMS
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
  .catch(console.log);
}
