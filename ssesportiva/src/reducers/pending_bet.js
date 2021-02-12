import { reduce } from 'lodash';

import {
  GET_PENDING_BET_LOADING,
  GET_PENDING_BET_SUCCESS,
  GET_PENDING_BET_ERROR,
} from '../actions/actionTypes';

const initialState = {
  data: null,
  loading: false,
  error: null,
};

export default function pendingBetReducer(state = initialState, action) {
  switch (action.type) {
    case GET_PENDING_BET_LOADING:
      return {
        ...state,
        loading: true,
      };
    case GET_PENDING_BET_SUCCESS:
      const {
        payload: { pendingBet },
      } = action;

      return {
        ...state,
        data: pendingBet,
        loading: false,
        error: null,
      };
    case GET_PENDING_BET_ERROR:
      const {
        payload: { error },
      } = action;

      return {
        ...state,
        data: null,
        loading: false,
        error,
      };
    default:
      return state;
  }
}
