import { ADD_OPTION, REMOVE_OPTION } from './actionTypes';

export const addOption = (game, option) => {
  return { type: ADD_OPTION, payload: { game, option } };
};

export const removeOption = (option) => {
  return { type: REMOVE_OPTION, payload: { option } };
};
