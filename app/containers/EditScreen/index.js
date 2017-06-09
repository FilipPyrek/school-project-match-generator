// @flow
import { connect } from 'react-redux';
import EditTable from '../../components/EditTable';
import * as FileActions from '../../lib/file/actions';

function mapStateToProps(state) {
  return {
    file: state.getIn(['file', 'fileData']).toJS(),
    showSaveSnackbar: state.getIn(['file', 'showSaveSnackbar']),
  };
}

const mapDispatchToProps = {
  onSetResult: FileActions.setResult,
  onRequestCloseSnackbar: FileActions.hideSaveSnackbar,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditTable);
