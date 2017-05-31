// @flow
import { remote } from 'electron';
import { push } from 'react-router-redux';
import fs from 'fs';
import { generateMatch, MatchGeneratorResult } from '../../lib/matchGenerator/matchGenerator';
import { Team, Round, Input } from '../../lib/matchGenerator/base';

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
  matchData: MatchGeneratorResult
};

export function saveFile(data: SaveFileType) {
  const { sport, filename, matchData } = data;
  fs.writeFileSync(filename, JSON.stringify({
    sport,
    matchData,
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
    matchData: generateMatch(
      new Input(
        Array(teamsCount).fill(0).map((_, i) => new Team(`${i + 1}. Team`, [])),
        Array(roundsCount).fill(0).map((_, i) => new Round(`${i + 1}. Round`)),
        roundMatchesCount,
        4, // MATCHES_TEAM_IN_ROUND
        2, // MAX_TEAM_MATCHES_CONSECUTIVELY
        -1, // MAX_TEAM_PAUSES_CONSECUTIVELY
      ),
    ),
  })))
  .then(() => dispatch(push('/edit')))
  .catch(console.log);
}
