import { ADD_OPTION, REMOVE_OPTION, SET_BET_VALUE } from './actionTypes';

export const addOption = (game, option) => {
  return { type: ADD_OPTION, payload: { game, option } };
};

export const removeOption = (option) => {
  return { type: REMOVE_OPTION, payload: { option } };
};

export const setBetValue = (value) => {
  return { type: SET_BET_VALUE, payload: { value } };
};
