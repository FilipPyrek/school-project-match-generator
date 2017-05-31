// @flow
import { connect } from 'react-redux';
import EditTable from '../../components/EditTable';
// import * as PickSportActions from './actions';

function mapStateToProps(state) {
  return {
    file: state.getIn(['file', 'fileData']).toJS(),
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
