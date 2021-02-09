import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { isLoaded } from 'react-redux-firebase';
import { ReactReduxFirebaseProvider } from 'react-redux-firebase';
import { isNull } from 'lodash';
import { PersistGate } from 'redux-persist/integration/react';

import App from './App';
import firebase from './services/firebase';
import { getMemberDetails } from './actions/auth';
import configureStore from './services/configureStore';

const { store, persistor } = configureStore();

const rrfProps = {
  firebase,
  config: {},
  dispatch: store.dispatch,
};

firebase.auth().onAuthStateChanged((user) => {
  if (!isNull(user)) {
    store.dispatch(getMemberDetails());
  }
});

// TODO add loader
function AuthIsLoaded({ children }) {
  const auth = useSelector((state) => state.firebase.auth);
  if (!isLoaded(auth)) return <div>splash screen...</div>;
  return children;
}

render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ReactReduxFirebaseProvider {...rrfProps}>
        <BrowserRouter>
          <AuthIsLoaded>
            <App />
          </AuthIsLoaded>
        </BrowserRouter>
      </ReactReduxFirebaseProvider>
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);
