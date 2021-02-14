import { GET_TICKET, CLEAR_TICKET, SET_TICKET_RESULT } from './actionTypes';

export const getTicket = (id) => {
  return { type: GET_TICKET, payload: { id } };
};

export const clearTicket = () => {
  return { type: CLEAR_TICKET };
};

export const setTicketResult = (code, result) => {
  return { type: SET_TICKET_RESULT, payload: { code, result } };
};
