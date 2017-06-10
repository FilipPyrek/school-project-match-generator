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
    <div>
      {
        stage === 0
        ?
          <div>
            <table>
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
                      label="Pokračovat"
                      onTouchTap={onContinue}
                      primary
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        :
          <div>
            <table>
              <tbody>
                <tr>
                  <th />
                  {
                    Array(roundsCount).fill(0).map((_, i) => (
                      <th key={i}>
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
                          <td key={roundId} style={{ textAlign: 'center' }}>
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
