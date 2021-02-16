import {
  GET_PENDING_TICKETS_SUCCESS,
  GET_PENDING_TICKETS_ERROR,
  GET_PENDING_TICKETS_LOADING,
} from '../actions/actionTypes';

const initialState = {
  data: [],
  loading: false,
  error: null,
};

export default function pendingTicketReducer(state = initialState, action) {
  switch (action.type) {
    case GET_PENDING_TICKETS_LOADING:
      return {
        ...state,
        loading: true,
      };
    case GET_PENDING_TICKETS_SUCCESS:
      const {
        payload: { pendingTickets },
      } = action;

      return {
        ...state,
        data: pendingTickets,
        loading: false,
        error: null,
      };
    case GET_PENDING_TICKETS_ERROR:
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
