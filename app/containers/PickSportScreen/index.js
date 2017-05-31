// @flow
import { connect } from 'react-redux';
import PickSport from '../../components/PickSport';
import * as PickSportActions from './actions';
import { newFile } from '../../lib/file/actions';

function mapStateToProps(state) {
  return state.get('pickSport').toJS();
}

const mapDispatchToProps = {
  onSportChage: PickSportActions.selectSport,
  onTeamsCountChange: PickSportActions.setTeamsCount,
  onRoundsCountChange: PickSportActions.setRoundsCount,
  onRoundMatchesCountChange: PickSportActions.setRoundMatchesCount,
  onSubmit: newFile,
};

export default connect(mapStateToProps, mapDispatchToProps)(PickSport);
