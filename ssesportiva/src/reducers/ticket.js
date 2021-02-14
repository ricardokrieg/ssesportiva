import {
  CLEAR_TICKET,
  GET_TICKET_LOADING,
  GET_TICKET_SUCCESS,
  GET_TICKET_ERROR,
  SET_TICKET_RESULT_ERROR,
  SET_TICKET_RESULT_LOADING,
} from '../actions/actionTypes';

const initialState = {
  data: null,
  loading: false,
  error: null,
  loadingSetTicket: false,
  errorSetTicket: null,
};

export default function ticketReducer(state = initialState, action) {
  switch (action.type) {
    case CLEAR_TICKET:
      return {
        ...initialState,
      };
    case GET_TICKET_SUCCESS:
      const {
        payload: { ticket },
      } = action;

      return {
        ...state,
        data: ticket,
        loading: false,
        error: null,
        loadingSetTicket: false,
        errorSetTicket: null,
      };
    case GET_TICKET_ERROR:
      const {
        payload: { error },
      } = action;

      return {
        ...state,
        error,
        data: null,
        loading: false,
        loadingSetTicket: false,
      };
    case GET_TICKET_LOADING:
      return {
        ...state,
        loading: true,
        loadingSetTicket: false,
        data: null,
        error: null,
        errorSetTicket: null,
      };
    case SET_TICKET_RESULT_LOADING:
      return {
        ...state,
        loadingSetTicket: true,
        errorSetTicket: null,
      };
    case SET_TICKET_RESULT_ERROR:
      return {
        ...state,
        errorSetTicket: action.payload.error,
        loading: false,
        loadingSetTicket: false,
      };
    default:
      return state;
  }
}
