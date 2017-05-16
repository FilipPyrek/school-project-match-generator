// @flow
import React, { Children } from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

type ThemeType = {
  /* eslint-disable react/require-default-props */
  // disabled because of https://github.com/facebook/flow/issues/1355
  children?: Children
  /* eslint-enable */
};

export const muiTheme = getMuiTheme({
});


export default function Theme({ children }: ThemeType) {
  return (
    <MuiThemeProvider muiTheme={muiTheme}>
      {children}
    </MuiThemeProvider>
  );
}
