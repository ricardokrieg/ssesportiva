import { combineReducers } from 'redux';
import { firebaseReducer } from 'react-redux-firebase';

import authReducer from './auth';
import groupsReducer from './groups';
import championshipReducer from './championship';
import gameReducer from './game';
import betReducer from './bet';
import toastReducer from './toast';

export default combineReducers({
  firebase: firebaseReducer,
  auth: authReducer,
  groups: groupsReducer,
  championship: championshipReducer,
  game: gameReducer,
  bet: betReducer,
  toast: toastReducer,
});
