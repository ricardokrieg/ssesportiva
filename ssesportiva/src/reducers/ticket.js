import {
  GET_TICKET_LOADING,
  GET_TICKET_SUCCESS,
  GET_TICKET_ERROR,
} from '../actions/actionTypes';

const initialState = {
  ticket: null,
  error: null,
  loading: true,
};

export default function ticketReducer(state = initialState, action) {
  switch (action.type) {
    case GET_TICKET_SUCCESS:
      const {
        payload: { ticket },
      } = action;

      return {
        ...state,
        ticket,
        error: null,
        loading: false,
      };
    case GET_TICKET_ERROR:
      const {
        payload: { error },
      } = action;

      return {
        ...state,
        error,
        ticket: null,
        loading: false,
      };
    case GET_TICKET_LOADING:
      return {
        ...state,
        ticket: null,
        error: null,
        loading: true,
      };
    default:
      return state;
  }
}
