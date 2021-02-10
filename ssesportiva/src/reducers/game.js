import {
  GET_GAME_SUCCESS,
  GET_GAME_ERROR,
  GET_GAME_LOADING,
} from '../actions/actionTypes';

const initialState = {
  data: null,
  loading: false,
  error: null,
};

export default function gameReducer(state = initialState, action) {
  switch (action.type) {
    case GET_GAME_LOADING:
      return {
        ...state,
        loading: true,
      };
    case GET_GAME_SUCCESS:
    case GET_GAME_ERROR:
      const {
        payload: { game, error },
      } = action;

      return {
        ...state,
        data: game,
        error,
        loading: false,
      };
    default:
      return state;
  }
}
