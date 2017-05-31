// @flow
import { connect } from 'react-redux';
import EditTable from '../../components/EditTable';
// import * as PickSportActions from './actions';

function mapStateToProps(state) {
  return {
    sport: state.get('pickSport'),
  };
}

const mapDispatchToProps = {
  /* onSportChage: PickSportActions.selectSport,
  onTeamsCountChange: PickSportActions.setTeamsCount,
  onRoundsCountChange: PickSportActions.setRoundsCount,
  onRoundMatchesCountChange: PickSportActions.setRoundMatchesCount,
  onSubmit: PickSportActions.submit,*/
};

export default connect(mapStateToProps, mapDispatchToProps)(EditTable);
