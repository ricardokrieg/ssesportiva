import { reduce } from 'lodash';

import {
  ADD_OPTION_SUCCESS,
  REMOVE_OPTION_SUCCESS,
  SET_BET_VALUE,
} from '../actions/actionTypes';

const initialState = {
  value: 0.0,
  quote: 1.0,
  expectedReturn: 0.0,
  options: [],
};

const calculateQuote = (options) => {
  const quote = reduce(
    options,
    (quote, option) => {
      return quote * (1 / option.quote);
    },
    1.0
  );

  return 1 / quote;
};

export default function betReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_OPTION_SUCCESS:
    case REMOVE_OPTION_SUCCESS:
      const {
        payload: { options },
      } = action;

      const quote = calculateQuote(options);

      return {
        ...state,
        quote,
        expectedReturn: quote * state.value,
        options,
      };
    case SET_BET_VALUE:
      const {
        payload: { value },
      } = action;

      return {
        ...state,
        value,
        expectedReturn: state.quote * value,
      };
    default:
      return state;
  }
}
