// @flow
import React from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import Slider from 'material-ui/Slider';
import type { Result } from '../../lib/competitionGenerator/allVsAllGenerator';
import { renderAllVsAllTable, SeasonsTable } from '../../lib/competitionGenerator/allVsAllRenderer';

type EditTableType = {
  file: {
    sport: string,
    competitionData: Result
  },
  onSetResult: (cellMatchIndex: number, teamId: number, value: number | null) => void
};

export default function EditTable(props: EditTableType) {
  const generatorResult: Result = props.file.competitionData;
  const { onSetResult } = props;

  return ( // Simple table drawing. I did found index, as only usable key value...
    <div>
      <Tabs>
        <Tab label="Zadávat">
          <div style={{ height: 'calc(100vh - 117px)', overflow: 'auto' }}>
            <SeasonsTable generatorResult={generatorResult} onSetResultValue={onSetResult} />
          </div>
        </Tab>
        <Tab label="Výsledky">
          {/* renderAllVsAllTable(generatorResult)*/}
        </Tab>
      </Tabs>
    </div>
  );
}
