import { reduce } from 'lodash';

import {
  ADD_OPTION_SUCCESS,
  REMOVE_OPTION_SUCCESS,
  SET_BET_VALUE,
  SET_NAME,
  PLACE_BET_LOADING,
  PLACE_BET_SUCCESS,
  PLACE_BET_ERROR,
  CLEAR_BET,
} from '../actions/actionTypes';

const initialState = {
  value: 0.0,
  quote: 1.0,
  expectedReturn: 0.0,
  options: [],
  error: null,
  loading: false,
  code: '',
  name: '',
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
  let quote, expectedReturn;

  switch (action.type) {
    case ADD_OPTION_SUCCESS:
    case REMOVE_OPTION_SUCCESS:
      const {
        payload: { options },
      } = action;

      quote = calculateQuote(options);
      expectedReturn = quote * state.value;

      return {
        ...state,
        quote,
        expectedReturn,
        options,
      };
    case SET_BET_VALUE:
      const {
        payload: { value },
      } = action;

      expectedReturn = state.quote * value;

      return {
        ...state,
        value: parseFloat(value),
        expectedReturn,
      };
    case SET_NAME:
      return {
        ...state,
        name: action.payload.value,
      };
    case PLACE_BET_LOADING:
      return {
        ...state,
        loading: true,
        code: '',
      };
    case PLACE_BET_SUCCESS:
      const {
        payload: { code },
      } = action;

      quote = 1.0;
      expectedReturn = quote * state.value;

      return {
        ...state,
        loading: false,
        error: null,
        code,
        options: [],
        quote,
        expectedReturn,
      };
    case PLACE_BET_ERROR:
      const {
        payload: { error },
      } = action;

      return {
        ...state,
        loading: false,
        code: '',
        error,
      };
    case CLEAR_BET:
      return {
        ...state,
        code: '',
        loading: false,
      };
    default:
      return state;
  }
}
