import {
  CLEAR_PENDING_BET,
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
  ticketCode: null,
  confirmLoading: false,
  confirmError: null,
};

export default function pendingBetReducer(state = initialState, action) {
  switch (action.type) {
    case CLEAR_PENDING_BET:
      return {
        ...initialState,
      };
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
        ticketCode: null,
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
        ticketCode: null,
      };
    case CONFIRM_PENDING_BET_LOADING:
      return {
        ...state,
        confirmLoading: true,
      };
    case CONFIRM_PENDING_BET_SUCCESS:
      const {
        payload: { ticketCode },
      } = action;

      return {
        ...state,
        ticketCode,
        confirmLoading: false,
        confirmError: null,
        data: null,
      };
    case CONFIRM_PENDING_BET_ERROR:
      return {
        ...state,
        ticketCode: null,
        confirmLoading: false,
        confirmError: action.payload.error,
      };
    default:
      return state;
  }
}
