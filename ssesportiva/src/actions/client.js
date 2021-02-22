import { GET_CLIENTS, GET_CLIENT, ADD_CLIENT } from './actionTypes';

export const getClients = () => {
  return { type: GET_CLIENTS };
};

export const getClient = (id) => {
  return { type: GET_CLIENT, payload: { id } };
};

export const addClient = (name) => {
  return { type: ADD_CLIENT, payload: { name } };
};
