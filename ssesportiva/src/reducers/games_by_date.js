import {
  GET_GAMES_BY_DATE_SUCCESS,
  GET_GAMES_BY_DATE_ERROR,
  GET_GAMES_BY_DATE_LOADING,
} from '../actions/actionTypes';

const initialState = {
  data: [],
  loading: false,
  error: null,
};

export default function gamesByDateReducer(state = initialState, action) {
  switch (action.type) {
    case GET_GAMES_BY_DATE_LOADING:
      return {
        ...state,
        loading: true,
      };
    case GET_GAMES_BY_DATE_SUCCESS:
      const {
        payload: { groups },
      } = action;

      return {
        ...state,
        data: groups,
        error: null,
        loading: false,
      };
    case GET_GAMES_BY_DATE_ERROR:
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
