import { combineReducers } from 'redux';
import { firebaseReducer } from 'react-redux-firebase';

import authReducer from './auth';
import groupsReducer from './groups';
import championshipReducer from './championship';
import gameReducer from './game';
import gamesByDateReducer from './games_by_date';
import betReducer from './bet';
import toastReducer from './toast';
import ticketReducer from './ticket';
import pendingBetReducer from './pending_bet';
import confirmedBetReducer from './confirmed_bet';
import pendingTicketReducer from './pending_ticket';
import memberReducer from './member';

export default combineReducers({
  firebase: firebaseReducer,
  auth: authReducer,
  groups: groupsReducer,
  championship: championshipReducer,
  game: gameReducer,
  gamesByDate: gamesByDateReducer,
  bet: betReducer,
  toast: toastReducer,
  ticket: ticketReducer,
  pendingBet: pendingBetReducer,
  confirmedBet: confirmedBetReducer,
  pendingTicket: pendingTicketReducer,
  member: memberReducer,
});
