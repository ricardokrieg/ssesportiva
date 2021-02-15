import {
  GET_CONFIRMED_BETS_SUCCESS,
  GET_CONFIRMED_BETS_ERROR,
  GET_CONFIRMED_BETS_LOADING,
} from '../actions/actionTypes';

const initialState = {
  data: [],
  loading: false,
  error: null,
};

export default function confirmedBetReducer(state = initialState, action) {
  switch (action.type) {
    case GET_CONFIRMED_BETS_LOADING:
      return {
        ...state,
        loading: true,
      };
    case GET_CONFIRMED_BETS_SUCCESS:
      const {
        payload: { confirmedBets },
      } = action;

      return {
        ...state,
        data: confirmedBets,
        loading: false,
        error: null,
      };
    case GET_CONFIRMED_BETS_ERROR:
      const {
        payload: { error },
      } = action;

      return {
        ...state,
        data: [],
        loading: false,
        error,
      };
    default:
      return state;
  }
}
