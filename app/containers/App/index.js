// @flow
import React, { Component } from 'react';
import type { Children } from 'react';
import { remote } from 'electron';
/* eslint-disable flowtype-errors/show-errors */
import AppBar from 'material-ui/AppBar';
import * as Color from 'material-ui/styles/colors';
/* eslint-enable */
import WindowClose from '../../components/WindowCloseButton';
import WindowMaximize from '../../components/WindowMaximizeButton';
import WindowMinimize from '../../components/WindowMinimizeButton';

const maximize = () => {
  const win = remote.BrowserWindow.getFocusedWindow();
  if (win.isMaximized()) win.unmaximize(); else win.maximize();
};

const minimize = () => {
  const win = remote.BrowserWindow.getFocusedWindow();
  win.minimize();
};

const close = () => {
  const win = remote.BrowserWindow.getFocusedWindow();
  win.close();
};

const windowControlsButton = {
  size: '18px',
  style: { margin: '18px 8px', float: 'left' },
};

export default class App extends Component {

  props: {
    children: Children
  };

  render() {
    return (
      <div>
        <AppBar
          title="O co jde"
          style={{
            WebkitAppRegion: 'drag',
            position: 'absolute',
            top: '0px',
            left: '0px',
            backgroundColor: Color.green700,
            height: '64px',
          }}
          iconElementRight={
            <div style={{ WebkitAppRegion: 'no-drag' }}>
              <WindowMinimize onClick={minimize} {...windowControlsButton} />
              <WindowMaximize onClick={maximize} {...windowControlsButton} />
              <WindowClose onClick={close} {...windowControlsButton} />
              <div style={{ clear: 'both' }} />
            </div>
          }
        />
        <div
          style={{
            border: `solid 5px ${Color.green700}`,
            height: '100vh',
            width: '100%',
            boxSizing: 'border-box'
          }}
        >
          {this.props.children}
        </div>
      </div>
    );
  }
}
