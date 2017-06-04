// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import style from './style.scss';
import { muiTheme } from '../Theme';
import { openFile } from '../../lib/file/actions';

class HomePage extends Component {

  props: {
    onOpenFile: () => void
  }

  render() {
    return (
      <div style={{ position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            backgroundColor: muiTheme.palette.primary1Color,
            left: 'calc(50% - 40vmin)',
            top: 'calc(50vh - 64px - 15vmin)',
          }}
        >
          <Link to="/pick-sport">
            <div className={style.button}>
              Nový
            </div>
          </Link>
        </div>
        <div
          style={{
            position: 'absolute',
            backgroundColor: muiTheme.palette.primary1Color,
            left: 'calc(50% + 10vmin)',
            top: 'calc(50vh - 64px - 15vmin)',
          }}
        >
          <div
            className={style.button}
            onClick={this.props.onOpenFile}
          >
            Otevřít
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps() {
  return {};
}

const mapDispatchToProps = {
  onOpenFile: openFile,
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
