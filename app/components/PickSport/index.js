// @flow
import React from 'react';
/* eslint-disable flowtype-errors/show-errors */
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import RaisedButton from 'material-ui/RaisedButton';
/* eslint-enable */

type PickSportType = {
  sport: string,
  onChange: () => void,
  onSubmit: () => void
};

export default function PickSport(props: PickSportType) {
  const { sport, onChange, onSubmit } = props;
  return (
    <div>
      <RadioButtonGroup
        name="sport"
        valueSelected={sport}
        onChange={(_, value) => onChange(value)}
      >
        <RadioButton
          value="football"
          label="Fotbal"
        />
        <RadioButton
          value="tenis"
          label="Tenis"
        />
        <RadioButton
          value="volleyball"
          label="Volejbal"
        />
      </RadioButtonGroup>
      <div style={{ margin: '50px' }}>
        <RaisedButton label="Vytvořit" onTouchTap={onSubmit} primary />
      </div>
    </div>
  );
}
