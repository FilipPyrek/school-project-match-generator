// @flow
import React from 'react';
import type { Result } from '../../lib/competitionGenerator/allVsAllGenerator';
import { renderAllVsAllTable, renderSeasonsTable } from '../../lib/competitionGenerator/allVsAllRenderer';

type EditTableType = {
  file: {
    sport: string,
    competitionData: Result
  }
};

export default function EditTable(props: EditTableType) {
  const generatorResult: Result = props.file.competitionData;

  return ( // Simple table drawing. I did found index, as only usable key value...
    <div>
      <h3>{props.file.sport}</h3>
      {renderAllVsAllTable(generatorResult)}
      <br />
      {renderSeasonsTable(generatorResult)}
    </div>
  );
}
