import moment from 'moment';

import {
  GET_GROUPS_SUCCESS,
  GET_GROUPS_ERROR,
  GET_GROUPS_LOADING,
} from '../actions/actionTypes';

const initialState = {
  data: [],
  loading: false,
  loadedAt: null,
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
      const {
        payload: { groups },
      } = action;

      return {
        ...state,
        data: groups,
        error: null,
        loading: false,
        loadedAt: moment(),
      };
    case GET_GROUPS_ERROR:
      const {
        payload: { error },
      } = action;

      return {
        ...state,
        data: [],
        error,
        loading: false,
        loadedAt: null,
      };
    default:
      return state;
  }
}
