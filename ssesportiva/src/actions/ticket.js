import { GET_TICKET, CLEAR_TICKET } from './actionTypes';

export const getTicket = (id) => {
  return { type: GET_TICKET, payload: { id } };
};

export const clearTicket = () => {
  return { type: CLEAR_TICKET };
};
