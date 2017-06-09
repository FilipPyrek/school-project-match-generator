// @flow
import React from 'react';
import type { Match, Result } from '../../lib/competitionGenerator/allVsAllGenerator';

type AllVsAllTableType = {
  generatorResult: Result
};

export default function AllVsAllTable(props: AllVsAllTableType) {
  const { generatorResult } = props;

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
                    <td key={k} style={tdStyle}>
                      {'-'}
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
