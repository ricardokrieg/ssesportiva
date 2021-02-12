import {
  GET_PENDING_BET_LOADING,
  GET_PENDING_BET_SUCCESS,
  GET_PENDING_BET_ERROR,
  CONFIRM_PENDING_BET_LOADING,
  CONFIRM_PENDING_BET_SUCCESS,
  CONFIRM_PENDING_BET_ERROR,
} from '../actions/actionTypes';

const initialState = {
  data: null,
  loading: false,
  error: null,
  confirmed: false,
  confirmLoading: false,
  confirmError: null,
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
        confirmed: false,
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
        confirmed: false,
      };
    case CONFIRM_PENDING_BET_LOADING:
      return {
        ...state,
        confirmLoading: true,
      };
    case CONFIRM_PENDING_BET_SUCCESS:
      return {
        ...state,
        confirmed: true,
        confirmLoading: false,
        confirmError: null,
        data: null,
      };
    case CONFIRM_PENDING_BET_ERROR:
      return {
        ...state,
        confirmed: false,
        confirmLoading: false,
        confirmError: action.payload.error,
        data: null,
      };
    default:
      return state;
  }
}
