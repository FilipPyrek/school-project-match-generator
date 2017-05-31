// @flow
import React from 'react';
/* eslint-disable flowtype-errors/show-errors */
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
/* eslint-enable */

type PickSportType = {
  sport: string,
  teamsCount: ?number,
  roundsCount: ?number,
  roundMatchesCount: ?number,
  onSportChage: () => void,
  onTeamsCountChange: () => void,
  onRoundsCountChange: () => void,
  onRoundMatchesCountChange: () => void,
  onSubmit: () => void
};

export default function PickSport(props: PickSportType) {
  const {
    sport,
    teamsCount,
    roundsCount,
    roundMatchesCount,
    onSportChage,
    onTeamsCountChange,
    onRoundsCountChange,
    onRoundMatchesCountChange,
    onSubmit,
  } = props;
  return (
    <div>
      <RadioButtonGroup
        name="sport"
        valueSelected={sport}
        onChange={(_, value) => onSportChage(value)}
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
      <TextField
        hintText="Počet týmů"
        onChange={(e) => onTeamsCountChange(
          e.target.value ? Number(e.target.value) : null,
        )}
        value={teamsCount || ''}
      />
      <br />
      <TextField
        hintText="Počet kol"
        onChange={(e) => onRoundsCountChange(
          Number(e.target.value),
        )}
        value={roundsCount || ''}
      />
      <br />
      <TextField
        hintText="Počet zápasů v jednom kole"
        onChange={(e) => onRoundMatchesCountChange(
          Number(e.target.value),
        )}
        value={roundMatchesCount || ''}
      />
      <br />
      <div style={{ margin: '50px' }}>
        <RaisedButton
          label="Vytvořit"
          onTouchTap={() => onSubmit(
            { sport, teamsCount, roundsCount, roundMatchesCount },
          )}
          primary
        />
      </div>
    </div>
  );
}
