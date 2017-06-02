// @flow
import React from 'react';
import type { Match, Result } from '../../lib/competitionGenerator/allVsAllGenerator';

type EditTableType = {
  file: {
    sport: string,
    competitionData: Result
  }
};

export default function EditTable(props: EditTableType) {
  const generatorResult: Result = props.file.competitionData;

  const tableStyle = {
    border: '1px solid black',
    marginBottom: '8px',
    borderSpacing: '0',
  };
  const tdStyle = {
    border: '1px solid black',
    padding: '4px',
  };
  return ( // Simple table drawing. I did found index, as only usable key value...
    <div>
      <h3>{props.file.sport}</h3>
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
                  const tableLineCell = generatorResult.tablesAllVsAll[i][j][k];
                  if (tableLineCell !== null) { // Is match in cell? (Is cell free?)
                    const cellMatch: Match = generatorResult.allMatches[tableLineCell];
                    const team1 = generatorResult.input.teams[cellMatch.team1Index];
                    const team2 = generatorResult.input.teams[cellMatch.team2Index];
                    return (
                      <td key={k} style={tdStyle}>
                        {team1.name} <br /> {team2.name}
                      </td>
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

  // Just old test:
  //
  // const domTables = [];
  // generatorResult.tablesAllVsAll.forEach((table: AllVsAllTable) => {
  //   const domLines = [];
  //   table.forEach((tableLine: Array<number>) => {
  //     const domCells = [];
  //     tableLine.forEach((tableLineCell: number) => {
  //       let domCell;
  //       if (tableLineCell !== null) {
  //         const cellMatch: Match = generatorResult.allMatches[tableLineCell];
  //         const team1 = generatorResult.input.teams[cellMatch.team1Index];
  //         const team2 = generatorResult.input.teams[cellMatch.team2Index];
  //         domCell = (
  //           <td>
  //             {team1.name} {' / '} {team2.name}
  //           </td>
  //         );
  //       } else {
  //         domCell = (
  //           <td>
  //             {'No match'}
  //           </td>
  //         );
  //       }
  //       domCells.push(domCell);
  //     });
  //     const domLine = (
  //       <tr>
  //         {domCells}
  //       </tr>
  //     );
  //     domLines.push(domLine);
  //   });
  //   const domTable = (
  //     <table>
  //       {domLines}
  //     </table>
  //   );
  //   domTables.push(domTable);
  // });
  // return (
  //   <div>
  //     <h3>{props.file.sport}</h3>
  //     {domTables}
  //   </div>
  // );


  // And backup:
  //
  // return (
  //   <pre>
  //     {props.file.sport}
  //     {'\n'}
  //     {JSON.stringify(props.file.competitionData, null, 2)}
  //   </pre>
  // );
}
