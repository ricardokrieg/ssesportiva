import {
  CLEAR_TICKET,
  GET_TICKET_LOADING,
  GET_TICKET_SUCCESS,
  GET_TICKET_ERROR,
} from '../actions/actionTypes';

const initialState = {
  data: null,
  loading: false,
  error: null,
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
      };
    case GET_TICKET_LOADING:
      return {
        ...state,
        loading: true,
        data: null,
        error: null,
      };
    default:
      return state;
  }
}
