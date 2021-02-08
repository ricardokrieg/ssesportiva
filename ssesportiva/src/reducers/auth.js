import {
  GET_MEMBER_DETAILS_SUCCESS,
  GET_MEMBER_DETAILS_ERROR,
} from '../actions/actionTypes';

const initialState = {
  user: null,
  error: null,
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case GET_MEMBER_DETAILS_SUCCESS:
    case GET_MEMBER_DETAILS_ERROR:
      const {
        payload: { user, error },
      } = action;

      return {
        ...state,
        user,
        error,
      };
    default:
      return state;
  }
}
