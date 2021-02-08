import { combineReducers } from 'redux';
import { firebaseReducer } from 'react-redux-firebase';

import authReducer from './auth';
import groupsReducer from './groups';
import championshipReducer from './championship';

export default combineReducers({
  firebase: firebaseReducer,
  auth: authReducer,
  groups: groupsReducer,
  championship: championshipReducer,
});
