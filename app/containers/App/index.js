// @flow
import React, { Component } from 'react';
import type { Children } from 'react';
import { remote } from 'electron';
/* eslint-disable flowtype-errors/show-errors */
import AppBar from 'material-ui/AppBar';
/* eslint-enable */
import * as Color from 'material-ui/styles/colors';
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
      <div
        style={{
          border: `solid 5px ${Color.green700}`,
          borderTopWidth: '0px',
          height: '100vh',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <AppBar
          title="O co jde"
          style={{
            WebkitAppRegion: 'drag',
            height: '64px',
            boxShadow: 'none',
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
        {this.props.children}
      </div>
    );
  }
}
