import {
  ADD_OPTION_SUCCESS,
  REMOVE_OPTION_SUCCESS,
} from '../actions/actionTypes';

const initialState = {
  options: [],
};

export default function betReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_OPTION_SUCCESS:
    case REMOVE_OPTION_SUCCESS:
      const {
        payload: { options },
      } = action;

      return {
        ...state,
        options,
      };
    default:
      return state;
  }
}
