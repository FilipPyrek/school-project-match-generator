// @flow
import React from 'react';
import { MatchGeneratorResult } from '../../lib/matchGenerator/matchGenerator';

type EditTableType = {
  file: {
    sport: string,
    matchData: MatchGeneratorResult
  }
};

export default function EditTable(props: EditTableType) {
  return (
    <pre>
      {props.file.sport}
      {'\n'}
      {JSON.stringify(props.file.matchData, null, 2)}
    </pre>
  );
}
