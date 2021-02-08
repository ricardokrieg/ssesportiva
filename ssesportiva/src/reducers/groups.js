import {
  GET_GROUPS_SUCCESS,
  GET_GROUPS_ERROR,
  GET_GROUPS_LOADING,
} from '../actions/actionTypes';

const initialState = {
  data: [],
  loading: false,
  loaded: false,
  error: null,
};

export default function groupsReducer(state = initialState, action) {
  switch (action.type) {
    case GET_GROUPS_LOADING:
      return {
        ...state,
        loading: true,
      };
    case GET_GROUPS_SUCCESS:
    case GET_GROUPS_ERROR:
      const {
        payload: { groups, error },
      } = action;

      return {
        ...state,
        data: groups,
        error,
        loading: false,
        loaded: !error,
      };
    default:
      return state;
  }
}
