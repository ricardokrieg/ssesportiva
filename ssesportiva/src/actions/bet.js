import {
  ADD_OPTION,
  REMOVE_OPTION,
  SET_BET_VALUE,
  PLACE_BET,
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

export const placeBet = () => {
  return { type: PLACE_BET };
};
