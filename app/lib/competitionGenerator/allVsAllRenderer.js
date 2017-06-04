// @flow
import React from 'react';
import type { Team, Match, Result } from './allVsAllGenerator';

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

export function renderSeasonsTable(generatorResult: Result) {
  // edit this function, add parameter as callback for edit button
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
      {Array(generatorResult.tablesSeasons.length).fill(0).map((_, i) =>
        <table key={i} style={tableStyle}>
          <tbody>
            <tr>
              <th>Seasson {i}</th>
            </tr>

            {Array(generatorResult.tablesSeasons[i].length).fill(0).map((__, j) => {
              const cellMatchIndex: number | null = generatorResult.tablesSeasons[i][j];
              if (cellMatchIndex !== null) {
                const cellMatch: Match = generatorResult.allMatches[cellMatchIndex];
                const team1: Team = generatorResult.input.teams[cellMatch.team1Index];
                const team2: Team = generatorResult.input.teams[cellMatch.team2Index];
                if (cellMatch.result) {
                  if (cellMatch.result.team1Score && cellMatch.result.team2Score) {
                    return (
                      <tr key={j}>
                        <td style={tdStyle}>
                          {team1.name} {' / '} {team2.name}
                        </td>
                        <td style={tdStyle}>
                          {cellMatch.result.team1Score} {' / '}
                          {cellMatch.result.team2Score}
                          <a>Edit result button</a>
                        </td>
                      </tr>
                    );
                  }
                  const winnerTeam: Team = generatorResult.input
                      .teams[cellMatch.result.winnerTeamIndex];
                  return (
                    <tr key={j}>
                      <td style={tdStyle}>
                        {team1.name} {' / '} {team2.name}
                      </td>
                      <td style={tdStyle}>
                        {'Winner: '} {winnerTeam.name}
                        <a>Edit result button</a>
                      </td>
                    </tr>
                  );
                }
                return (
                  <tr key={j}>
                    <td style={tdStyle}>
                      {team1.name} <br /> {team2.name}
                    </td>
                    <td style={tdStyle}>
                      <a>Set result button</a>
                    </td>
                  </tr>
                );
              }
              return (
                <tr key={j}>
                  <td style={tdStyle}>
                    {'No match'}
                  </td>
                  <td style={tdStyle} />
                </tr>
              );
            })}
          </tbody>
        </table>,
      )}
    </div>
  );
}
