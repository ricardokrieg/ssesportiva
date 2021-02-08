import { GET_CHAMPIONSHIP } from './actionTypes';

export const getChampionship = (id) => {
  return { type: GET_CHAMPIONSHIP, payload: { id } };
};
