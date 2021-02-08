import { GET_GAME } from './actionTypes';

export const getGame = (id) => {
  return { type: GET_GAME, payload: { id } };
};
