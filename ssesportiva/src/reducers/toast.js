import { OPEN_TOAST, CLOSE_TOAST } from '../actions/actionTypes';

const initialState = {
  show: false,
  title: '',
  message: '',
  type: '',
};

export default function toastReducer(state = initialState, action) {
  switch (action.type) {
    case OPEN_TOAST:
      const {
        payload: { title, message, type },
      } = action;

      return {
        ...state,
        show: true,
        title,
        message,
        type,
      };
    case CLOSE_TOAST:
      return {
        ...state,
        show: false,
        title: '',
        message: '',
        type: '',
      };
    default:
      return state;
  }
}
