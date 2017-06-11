// @flow
import React from 'react';
import { fromJS } from 'immutable';
/* eslint-disable flowtype-errors/show-errors */
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
/* eslint-enable */

type PickSportType = {
  error: ?string | null,
  teamsCount: ?number,
  roundsCount: ?number,
  roundMatchesCount: ?number,
  stage: number,
  teamRestrictions: any,
  onTeamsCountChange: () => void,
  onRoundsCountChange: () => void,
  onRoundMatchesCountChange: () => void,
  onSubmit: () => void,
  onContinue: () => void,
  onCheckRestriction: () => void
};

export default function PickSport(props: PickSportType) {
  const {
    error = '',
    teamsCount,
    roundsCount,
    roundMatchesCount,
    onTeamsCountChange,
    onRoundsCountChange,
    onRoundMatchesCountChange,
    onSubmit,
    stage,
    teamRestrictions,
    onContinue,
    onCheckRestriction,
  } = props;
  const restrictions = fromJS(teamRestrictions);
  return (
    <div style={{ paddingTop: '10vmin' }}>
      {
        stage === 0
        ?
          <div style={{ textAlign: 'center' }}>
            <table style={{ display: 'inline-block', textAlign: 'left' }}>
              <tbody>
                <tr>
                  <td>Počet týmů</td>
                  <td>
                    <TextField
                      hintText="Počet týmů"
                      onChange={(e) => onTeamsCountChange(
                        Number(e.target.value),
                      )}
                      value={teamsCount || ''}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Počet etap</td>
                  <td>
                    <TextField
                      hintText="Počet etap"
                      onChange={(e) => onRoundsCountChange(
                        Number(e.target.value),
                      )}
                      value={roundsCount || ''}
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{ paddingRight: '2vmin' }}>
                    Počet zápasů v jedné etapě
                  </td>
                  <td>
                    <TextField
                      hintText="Počet zápasů v jedné etapě"
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
                      label="Pokračovat"
                      onTouchTap={onContinue}
                      primary
                      disabled={
                           Number(teamsCount) < 2
                        || Number(roundsCount) < 1
                        || Number(roundMatchesCount) < 1
                      }
                      style={{ marginTop: '2vmin' }}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        :
          <div style={{ textAlign: 'center' }}>
            <table style={{ display: 'inline-block', textAlign: 'left' }}>
              <tbody>
                <tr>
                  <th />
                  {
                    Array(roundsCount).fill(0).map((_, i) => (
                      <th key={i} style={{ padding: '1vmin' }}>
                        {i + 1}. etapa
                      </th>
                    ))
                  }
                </tr>
                {
                  Array(teamsCount).fill(0).map((_, teamId) => (
                    <tr key={teamId}>
                      <td>{teamId + 1}. tým</td>
                      {
                        Array(roundsCount).fill(0).map((__, roundId) => (
                          <td key={roundId} style={{ textAlign: 'center', padding: '1vmin' }}>
                            <div style={{ display: 'inline-block' }}>
                              <Checkbox
                                label=""
                                checked={
                                  !restrictions.getIn(
                                    [String(teamId), String(roundId)],
                                    false,
                                  )
                                }
                                onCheck={(___, isChecked) => onCheckRestriction({
                                  isRestricted: !isChecked,
                                  teamId,
                                  roundId,
                                })}
                              />
                            </div>
                          </td>
                        ))
                      }
                    </tr>
                  ))
                }
                <tr>
                  {Array(roundsCount).fill(0).map((_, j) => <td key={j} />)}
                  <td>
                    <RaisedButton
                      label="Uložit"
                      primary
                      onTouchTap={() => onSubmit(
                        { teamsCount, roundsCount, roundMatchesCount, teamRestrictions },
                      )}
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
      }
    </div>
  );
}
