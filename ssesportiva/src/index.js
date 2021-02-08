import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { BrowserRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { isLoaded } from 'react-redux-firebase';
import { ReactReduxFirebaseProvider } from 'react-redux-firebase';
import { isNull } from 'lodash';

import App from './App';
import reducers from './reducers';
import rootSaga from './sagas';
import firebase from './services/firebase';
import { getMemberDetails } from './actions/auth';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(reducers, {}, applyMiddleware(sagaMiddleware));

const rrfProps = {
  firebase,
  config: {},
  dispatch: store.dispatch,
};

sagaMiddleware.run(rootSaga);

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
    <ReactReduxFirebaseProvider {...rrfProps}>
      <BrowserRouter>
        <AuthIsLoaded>
          <App />
        </AuthIsLoaded>
      </BrowserRouter>
    </ReactReduxFirebaseProvider>
  </Provider>,
  document.getElementById('root')
);
