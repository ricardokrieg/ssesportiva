import {
  GET_MEMBERS_SUCCESS,
  GET_MEMBERS_ERROR,
  GET_MEMBERS_LOADING,
} from '../actions/actionTypes';

const initialState = {
  data: [],
  loading: false,
  error: null,
};

export default function memberReducer(state = initialState, action) {
  switch (action.type) {
    case GET_MEMBERS_LOADING:
      return {
        ...state,
        loading: true,
      };
    case GET_MEMBERS_SUCCESS:
      const {
        payload: { members },
      } = action;

      return {
        ...state,
        data: members,
        error: null,
        loading: false,
      };
    case GET_MEMBERS_ERROR:
      const {
        payload: { error },
      } = action;

      return {
        ...state,
        data: [],
        error,
        loading: false,
      };
    default:
      return state;
  }
}
