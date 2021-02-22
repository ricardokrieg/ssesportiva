import { all } from 'redux-saga/effects';

import { watchSignin, watchSignout, watchGetMemberDetails } from './auth';

import { watchGetGroups } from './groups';

import { watchGetChampionship } from './championship';

import { watchGetGame, watchGetGamesByDate } from './game';

import { watchAddOption, watchRemoveOption, watchPlaceBet } from './bet';

import { watchGetTicket, watchSetTicketResult } from './ticket';

import { watchGetPendingBet, watchConfirmPendingBet } from './pending_bet';

import { watchGetConfirmedBets } from './confirmed_bet';

import { watchGetPendingTickets } from './pending_ticket';

import { watchGetMembers } from './member';

import { watchGetClients, watchGetClient, watchAddClient } from './client';

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
    watchGetConfirmedBets(),
    watchGetPendingTickets(),
    watchGetMembers(),
    watchGetClients(),
    watchGetClient(),
    watchAddClient(),
  ]);
}
