// @flow
import React from 'react';
/* eslint-disable flowtype-errors/show-errors */
import { Tabs, Tab } from 'material-ui/Tabs';
import Snackbar from 'material-ui/Snackbar';
/* eslint-enable */
import type { Result } from '../../lib/competitionGenerator/allVsAllGenerator';
import AllVsAllTable from '../AllVsAllTable';
import SeasonsTable from '../SeasonsTable';

type EditTableType = {
  file: {
    competitionData: Result
  },
  showSaveSnackbar: boolean,
  onSetResult: (cellMatchIndex: number, teamId: number, value: number | null) => void,
  onRequestCloseSnackbar: () => void
};

export default function EditTable(props: EditTableType) {
  const generatorResult: Result = props.file.competitionData;
  const { showSaveSnackbar, onSetResult, onRequestCloseSnackbar } = props;

  return ( // Simple table drawing. I did found index, as only usable key value...
    <div>
      <Tabs>
        <Tab label="Zadávat">
          <div style={{ height: 'calc(100vh - 117px)', overflow: 'auto' }}>
            <SeasonsTable generatorResult={generatorResult} onSetResultValue={onSetResult} />
          </div>
        </Tab>
        <Tab label="Výsledky">
          <div style={{ height: 'calc(100vh - 117px)', overflow: 'auto' }}>
            <AllVsAllTable generatorResult={generatorResult} />
          </div>
        </Tab>
      </Tabs>
      <Snackbar
        open={showSaveSnackbar}
        message="Uloženo"
        autoHideDuration={2000}
        onRequestClose={onRequestCloseSnackbar}
      />
    </div>
  );
}
