import { OPEN_TOAST, CLOSE_TOAST } from '../actions/actionTypes';

const initialState = {
  show: false,
  message: null,
};

export default function toastReducer(state = initialState, action) {
  switch (action.type) {
    case OPEN_TOAST:
      const {
        payload: { message },
      } = action;

      return {
        ...state,
        show: true,
        message,
      };
    case CLOSE_TOAST:
      return {
        ...state,
        show: false,
        message: null,
      };
    default:
      return state;
  }
}
