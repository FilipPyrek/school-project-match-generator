// @flow
import React from 'react';
import type { Team, TeamPoints, Result, ResultRanking } from '../../lib/competitionGenerator/allVsAllGenerator';
import { generateRanking } from '../../lib/competitionGenerator/allVsAllGenerator';
import { muiTheme } from '../../containers/Theme';


type RenderPointsTableType = {
  generatorResult: Result
};

export default function PointsTable(props: RenderPointsTableType) {
  const { generatorResult }: { generatorResult: Result } = props;
  const resultRanking: ResultRanking = generateRanking(generatorResult);

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
    <div style={containerStyle}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          <tr>
            <th style={{ lineHeight: '4vmin' }}>Position</th>
            <th style={{ lineHeight: '4vmin' }}>Team name</th>
            <th style={{ lineHeight: '4vmin' }}>Points</th>
          </tr>

          {Array(resultRanking.tableRanking.length).fill(0).map((__, i) => {
            // Foreach team in table
            const teamIndex: number = resultRanking.tableRanking[i];
            const team: Team = generatorResult.input.teams[teamIndex];
            const teamPoints: TeamPoints = resultRanking.tablePoints[teamIndex];
            return (
              <tr key={i}>
                <td style={tdStyle}>
                  {i + 1}
                </td>
                <td style={tdStyle}>
                  {team.name}
                </td>
                <td style={tdStyle}>
                  {teamPoints.total}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
