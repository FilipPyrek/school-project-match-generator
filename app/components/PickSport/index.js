// @flow
import React from 'react';
/* eslint-disable flowtype-errors/show-errors */
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
/* eslint-enable */

type PickSportType = {
  sport: string,
  error: ?string | null,
  teamsCount: ?number,
  roundsCount: ?number,
  roundMatchesCount: ?number,
  onTeamsCountChange: () => void,
  onRoundsCountChange: () => void,
  onRoundMatchesCountChange: () => void,
  onSubmit: () => void
};

export default function PickSport(props: PickSportType) {
  const {
    sport,
    error = '',
    teamsCount,
    roundsCount,
    roundMatchesCount,
    onTeamsCountChange,
    onRoundsCountChange,
    onRoundMatchesCountChange,
    onSubmit,
  } = props;
  return (
    <div>
      <table>
        <tbody>
          <tr>
            <td>Počet týmů</td>
            <td>
              <TextField
                hintText="Počet týmů"
                onChange={(e) => onTeamsCountChange(
                  e.target.value ? Number(e.target.value) : null,
                )}
                value={teamsCount || ''}
              />
            </td>
          </tr>
          <tr>
            <td>Počet kol</td>
            <td>
              <TextField
                hintText="Počet kol"
                onChange={(e) => onRoundsCountChange(
                  Number(e.target.value),
                )}
                value={roundsCount || ''}
              />
            </td>
          </tr>
          <tr>
            <td>Počet zápasů v jednom kole</td>
            <td>
              <TextField
                hintText="Počet zápasů v jednom kole"
                onChange={(e) => onRoundMatchesCountChange(
                  Number(e.target.value),
                )}
                value={roundMatchesCount || ''}
              />
            </td>
          </tr>
          <tr>
            <td>&nbsp;</td>
            <td>
              <RaisedButton
                label="Vytvořit"
                onTouchTap={() => onSubmit(
                  { sport, teamsCount, roundsCount, roundMatchesCount },
                )}
                primary
              />
            </td>
          </tr>
        </tbody>
      </table>
      {
        error
          ?
            <div
              style={{
                color: 'red',
                fontSize: '2vmin',
                marginTop: '5vmin',
              }}
            >
              Chyba: {error}
            </div>
          : ''
      }
    </div>
  );
}
