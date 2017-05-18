// @flow
import { connect } from 'react-redux';
import PickSport from '../../components/PickSport';
import * as PickSportActions from './actions';

function mapStateToProps(state) {
  return {
    sport: state.get('pickSport'),
  };
}

const mapDispatchToProps = {
  onChange: PickSportActions.selectSport,
  onSubmit: PickSportActions.submit,
};

export default connect(mapStateToProps, mapDispatchToProps)(PickSport);
