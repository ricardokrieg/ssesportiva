import { GET_GAME, GET_GAMES_BY_DATE } from './actionTypes';

export const getGame = (id) => {
  return { type: GET_GAME, payload: { id } };
};

export const getGamesByDate = (date) => {
  return { type: GET_GAMES_BY_DATE, payload: { date } };
};
