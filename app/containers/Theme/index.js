// @flow
import React, { Children } from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import * as Color from 'material-ui/styles/colors';

type ThemeType = {
  /* eslint-disable react/require-default-props */
  // disabled because of https://github.com/facebook/flow/issues/1355
  children?: Children
  /* eslint-enable */
};

export const muiTheme = getMuiTheme({
  palette: {
    primary1Color: Color.green700,
  },
});


export default function Theme({ children }: ThemeType) {
  return (
    <MuiThemeProvider muiTheme={muiTheme}>
      {children}
    </MuiThemeProvider>
  );
}
