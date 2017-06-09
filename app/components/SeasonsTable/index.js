// @flow
import React from 'react';
/* eslint-disable flowtype-errors/show-errors */
import TextField from 'material-ui/TextField';
import { Table, TableBody, TableRow, TableRowColumn } from 'material-ui/Table';
/* eslint-enable */
import style from './style.scss';
import { muiTheme } from '../../containers/Theme';
import type { Team, Match, Result } from '../../lib/competitionGenerator/allVsAllGenerator';


type RenderSeansonsTableType = {
  generatorResult: Result,
  onSetResultValue: (cellMatchIndex: number, teamId: number, value: number | null) => void
};

export default function SeasonsTable(props: RenderSeansonsTableType) {
  const { generatorResult, onSetResultValue } = props;

  return (
    <div>
      {Array(generatorResult.tablesSeasons.length).fill(0).map((_, i) =>
        <div
          style={{ borderColor: muiTheme.palette.primary1Color }}
          className={style.tableContainer}
          key={i}
        >
          <Table selectable={false}>
            <TableBody displayRowCheckbox={false}>
              <TableRow>
                <TableRowColumn
                  colSpan={2}
                  style={{ textAlign: 'center', fontSize: '2vmin' }}
                >
                  {i + 1}. etapa
                </TableRowColumn>
              </TableRow>
              {Array(generatorResult.tablesSeasons[i].length).fill(0).map((__, j) => {
                const cellMatchIndex: number | null = generatorResult.tablesSeasons[i][j];
                if (cellMatchIndex !== null) {
                  const cellMatch: Match = generatorResult.allMatches[cellMatchIndex];
                  const { result = {} } = cellMatch;
                  const { team1Score = '', team2Score = '' } = result;
                  const team1: Team = generatorResult.input.teams[cellMatch.team1Index];
                  const team2: Team = generatorResult.input.teams[cellMatch.team2Index];
                  return (
                    <TableRow key={j}>
                      <TableRowColumn>
                        {team1.name} / {team2.name}
                      </TableRowColumn>
                      <TableRowColumn>
                        <TextField
                          name="team1"
                          value={team1Score === null ? '' : team1Score}
                          style={{ width: '5vmin' }}
                          inputStyle={{ textAlign: 'center' }}
                          onChange={({ target }) => onSetResultValue(
                              cellMatchIndex,
                              1,
                              target.value && Number.isInteger(Number(target.value))
                                ? Number(target.value)
                                : null,
                          )}
                        />
                        :
                        <TextField
                          name="team2"
                          value={team2Score === null ? '' : team2Score}
                          style={{ width: '5vmin' }}
                          inputStyle={{ textAlign: 'center' }}
                          onChange={({ target }) => onSetResultValue(
                              cellMatchIndex,
                              2,
                              target.value && Number.isInteger(Number(target.value))
                                ? Number(target.value)
                                : null,
                          )}
                        />
                      </TableRowColumn>
                    </TableRow>
                  );
                }
                return (
                  <TableRow key={j}>
                    <TableRowColumn colSpan={2}>-</TableRowColumn>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>,
      )}
      <div style={{ clear: 'both' }} />
    </div>
  );
}
