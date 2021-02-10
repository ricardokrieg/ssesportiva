import { GET_TICKET } from './actionTypes';

export const getTicket = (id) => {
  return { type: GET_TICKET, payload: { id } };
};
