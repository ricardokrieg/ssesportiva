import { all } from 'redux-saga/effects';

import { watchSignin, watchSignout, watchGetMemberDetails } from './auth';

import { watchGetGroups } from './groups';

import { watchGetChampionship } from './championship';

import { watchGetGame } from './game';

import { watchAddOption, watchRemoveOption, watchPlaceBet } from './bet';

import { watchGetTicket } from './ticket';

import { watchGetPendingBet } from './pending_bet';

export default function* rootSaga() {
  yield all([
    watchSignin(),
    watchSignout(),
    watchGetMemberDetails(),
    watchGetGroups(),
    watchGetChampionship(),
    watchGetGame(),
    watchAddOption(),
    watchRemoveOption(),
    watchPlaceBet(),
    watchGetTicket(),
    watchGetPendingBet(),
  ]);
}
