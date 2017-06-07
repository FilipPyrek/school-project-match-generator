// @flow
import React from 'react';
import type { Team, Match, Result } from './allVsAllGenerator';
/* eslint-disable flowtype-errors/show-errors */
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
/* eslint-enable */
import { muiTheme } from '../../containers/Theme';

export function renderAllVsAllTable(generatorResult: Result) {
  const tableStyle = {
    border: '1px solid black',
    marginBottom: '8px',
    borderSpacing: '0',
  };
  const tdStyle = {
    border: '1px solid black',
    padding: '4px',
  };

  return (
    <div>
      {Array(generatorResult.tablesAllVsAll.length).fill(0).map((_, i) =>
        // Foreach table in result
        <table key={i} style={tableStyle}>
          <tbody>
            <tr>
              <th />
              {Array(generatorResult.tablesAllVsAll[i].length).fill(0).map((__, j) => {
                const team = generatorResult.input.teams[j];
                return (
                  <th key={j}>
                    {team.name}
                  </th>
                );
              })}
            </tr>

            {Array(generatorResult.tablesAllVsAll[i].length).fill(0).map((__, j) =>
              // Foreach line in table
              <tr key={j}>
                <th>
                  {generatorResult.input.teams[j].name}
                </th>

                {Array(generatorResult.tablesAllVsAll[i][j].length).fill(0).map((___, k) => {
                  // Foreach cell in line
                  const cellMatchIndex: number | null = generatorResult.tablesAllVsAll[i][j][k];
                  if (cellMatchIndex !== null) { // Is match in cell? (Is cell free?)
                    const cellMatch: Match = generatorResult.allMatches[cellMatchIndex];
                    // const team1: Team = generatorResult.input.teams[cellMatch.team1Index];
                    // const team2: Team = generatorResult.input.teams[cellMatch.team2Index];
                    if (cellMatch.result) {
                      if (cellMatch.result.team1Score && cellMatch.result.team2Score) {
                        return (
                          <td key={k} style={tdStyle}>
                            {cellMatch.result.team1Score} {' / '}
                            {cellMatch.result.team2Score}
                          </td>
                        );
                      }
                      const winnerTeam: Team = generatorResult.input
                          .teams[cellMatch.result.winnerTeamIndex];
                      return (
                        <td key={k} style={tdStyle}>
                          {'Winner: '} {winnerTeam.name}
                        </td>
                      );
                    }
                    return (
                      <td key={k} style={tdStyle} />
                    );
                  }
                  return (
                    <td key={k} style={tdStyle}>
                      {'No match'}
                    </td>
                  );
                })}
              </tr>,
            )}
          </tbody>
        </table>,
      )}
    </div>
  );
}

type RenderSeansonsTableType = {
  generatorResult: Result,
  onSetResultValue: (cellMatchIndex: number, teamId: number, value: number | null) => void
};

export function SeasonsTable(props: RenderSeansonsTableType) {
  const { generatorResult, onSetResultValue } = props;

  return (
    <div>
      {Array(generatorResult.tablesSeasons.length).fill(0).map((_, i) =>
        <div
          style={{
            width: '25%',
            display: 'inline-block',
            border: 'solid 1px',
            borderColor: muiTheme.palette.primary1Color,
            boxSizing: 'border-box',
            float: 'left',
          }}
        >
          <Table key={i} selectable={false}>
            <TableBody displayRowCheckbox={false}>
              <TableRow key={-1}>
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
                  <TableRow>
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
