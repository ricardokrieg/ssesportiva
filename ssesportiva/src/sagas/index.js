import { all } from 'redux-saga/effects';

import { watchSignin, watchGetMemberDetails } from './auth';

import { watchGetGroups } from './groups';

import { watchGetChampionship } from './championship';

export default function* rootSaga() {
  yield all([
    watchSignin(),
    watchGetMemberDetails(),
    watchGetGroups(),
    watchGetChampionship(),
  ]);
}
