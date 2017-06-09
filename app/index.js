import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Root from './containers/Root';
import { configureStore, history } from './store/configureStore';
import { openFile, saveFile } from './lib/file/actions';
import './app.global.css';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const store = configureStore();

window.addEventListener('keyup', (e) => {
  const { keyCode, altKey, ctrlKey, shiftKey } = e;
  if (!altKey && ctrlKey && !shiftKey) {
    switch (keyCode) { // eslint-disable-line default-case
      case 79: {
        store.dispatch(openFile());
        break;
      }
      case 83: {
        const file = store.getState().get('file').toJS();
        if (file.filename) {
          store.dispatch(saveFile({
            filename: file.filename,
            competitionData: file.fileData.competitionData,
          }));
        }
        break;
      }
    }
  }
});

render(
  <AppContainer>
    <Root store={store} history={history} />
  </AppContainer>,
  document.getElementById('root'),
);

if (module.hot) {
  module.hot.accept('./containers/Root', () => {
    const NextRoot = require('./containers/Root'); // eslint-disable-line global-require
    render(
      <AppContainer>
        <NextRoot store={store} history={history} />
      </AppContainer>,
      document.getElementById('root'),
    );
  });
}
