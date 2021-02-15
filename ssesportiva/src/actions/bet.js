import {
  ADD_OPTION,
  REMOVE_OPTION,
  SET_BET_VALUE,
  SET_NAME,
  PLACE_BET,
  CLEAR_BET,
} from './actionTypes';

export const addOption = (championship, game, quote, option) => {
  return { type: ADD_OPTION, payload: { championship, game, quote, option } };
};

export const removeOption = (option) => {
  return { type: REMOVE_OPTION, payload: { option } };
};

export const setBetValue = (value) => {
  return { type: SET_BET_VALUE, payload: { value } };
};

export const setName = (value) => {
  return { type: SET_NAME, payload: { value } };
};

export const placeBet = () => {
  return { type: PLACE_BET };
};

export const clearBet = () => {
  return { type: CLEAR_BET };
};
