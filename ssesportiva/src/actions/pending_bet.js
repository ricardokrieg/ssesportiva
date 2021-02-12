import { GET_PENDING_BET } from './actionTypes';

export const getPendingBet = (code) => {
  return { type: GET_PENDING_BET, payload: { code } };
};
