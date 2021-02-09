import { all } from 'redux-saga/effects';

import { watchSignin, watchGetMemberDetails } from './auth';

import { watchGetGroups } from './groups';

import { watchGetChampionship } from './championship';

import { watchGetGame } from './game';

import { watchAddOption, watchRemoveOption, watchPlaceBet } from './bet';

export default function* rootSaga() {
  yield all([
    watchSignin(),
    watchGetMemberDetails(),
    watchGetGroups(),
    watchGetChampionship(),
    watchGetGame(),
    watchAddOption(),
    watchRemoveOption(),
    watchPlaceBet(),
  ]);
}
