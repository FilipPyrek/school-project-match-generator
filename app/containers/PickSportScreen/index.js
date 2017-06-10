// @flow
import { connect } from 'react-redux';
import PickSport from '../../components/PickSport';
import * as PickSportActions from './actions';
import { newFile } from '../../lib/file/actions';

function mapStateToProps(state) {
  return {
    ...state.get('pickSport').toJS(),
    error: state.getIn(['file', 'error']),
  };
}

const mapDispatchToProps = {
  onTeamsCountChange: PickSportActions.setTeamsCount,
  onRoundsCountChange: PickSportActions.setRoundsCount,
  onRoundMatchesCountChange: PickSportActions.setRoundMatchesCount,
  onSubmit: newFile,
  onContinue: PickSportActions.nextStage,
  onCheckRestriction: PickSportActions.setRestriction,
};

export default connect(mapStateToProps, mapDispatchToProps)(PickSport);
