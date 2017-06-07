// @flow
import { connect } from 'react-redux';
import EditTable from '../../components/EditTable';
import * as FileActions from '../../lib/file/actions';

function mapStateToProps(state) {
  return {
    file: state.getIn(['file', 'fileData']).toJS(),
  };
}

const mapDispatchToProps = {
  onSetResult: FileActions.setResult,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditTable);
