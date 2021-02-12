import { GET_PENDING_BET, CONFIRM_PENDING_BET } from './actionTypes';

export const getPendingBet = (code) => {
  return { type: GET_PENDING_BET, payload: { code } };
};

export const confirmPendingBet = (code, name) => {
  return { type: CONFIRM_PENDING_BET, payload: { code, name } };
};
