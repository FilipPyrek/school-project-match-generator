// @flow
import React from 'react';
import type { Match, Result } from '../../lib/competitionGenerator/allVsAllGenerator';
import { muiTheme } from '../../containers/Theme';

type AllVsAllTableType = {
  generatorResult: Result
};

export default function AllVsAllTable(props: AllVsAllTableType) {
  const { generatorResult } = props;

  const containerStyle = {
    border: '1px solid',
    boxSizing: 'border-box',
    borderColor: muiTheme.palette.primary1Color,
    width: '100%',
    textAlign: 'center',
    padding: '1vmin 2vmin 2vmin 0',
  };
  const tdStyle = {
    border: '1px solid',
    borderColor: muiTheme.palette.primary1Color,
    padding: '4px',
  };

  return (
    <div>
      {Array(generatorResult.tablesAllVsAll.length).fill(0).map((_, i) =>
        <div key={i} style={containerStyle}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <th
                  colSpan={generatorResult.tablesAllVsAll[i].length + 1}
                  style={{ lineHeight: '4vmin' }}
                >
                  {i + 1}. kolo
                </th>
              </tr>
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
                      const { result = {} } = cellMatch;
                      const { team1Score = null, team2Score = null } = result;
                      // const team1: Team = generatorResult.input.teams[cellMatch.team1Index];
                      // const team2: Team = generatorResult.input.teams[cellMatch.team2Index];
                      return (
                        typeof team1Score === 'number' && typeof team2Score === 'number'
                          ?
                            <td key={k} style={tdStyle}>
                              {String(team1Score)} : {String(team2Score)}
                            </td>
                          :
                            <td key={k} style={tdStyle} />
                      );
                    }
                    return (
                      <td
                        key={k}
                        style={{
                          backgroundColor: muiTheme.palette.primary1Color,
                          border: '1px solid',
                          borderColor: muiTheme.palette.primary1Color,
                        }}
                      />
                    );
                  })}
                </tr>,
              )}
            </tbody>
          </table>
        </div>,
      )}
    </div>
  );
}
