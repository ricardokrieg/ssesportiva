import { all } from 'redux-saga/effects';

import { watchSignin, watchSignout, watchGetMemberDetails } from './auth';

import { watchGetGroups } from './groups';

import { watchGetChampionship } from './championship';

import { watchGetGame, watchGetGamesByDate } from './game';

import { watchAddOption, watchRemoveOption, watchPlaceBet } from './bet';

import { watchGetTicket, watchSetTicketResult } from './ticket';

import { watchGetPendingBet, watchConfirmPendingBet } from './pending_bet';

export default function* rootSaga() {
  yield all([
    watchSignin(),
    watchSignout(),
    watchGetMemberDetails(),
    watchGetGroups(),
    watchGetChampionship(),
    watchGetGame(),
    watchGetGamesByDate(),
    watchAddOption(),
    watchRemoveOption(),
    watchPlaceBet(),
    watchGetTicket(),
    watchSetTicketResult(),
    watchGetPendingBet(),
    watchConfirmPendingBet(),
  ]);
}
