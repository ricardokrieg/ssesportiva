import {
  GET_CHAMPIONSHIP_SUCCESS,
  GET_CHAMPIONSHIP_ERROR,
  GET_CHAMPIONSHIP_LOADING,
} from '../actions/actionTypes';

const initialState = {
  data: null,
  loading: false,
  loaded: false,
  error: null,
};

export default function championshipReducer(state = initialState, action) {
  switch (action.type) {
    case GET_CHAMPIONSHIP_LOADING:
      return {
        ...state,
        loading: true,
      };
    case GET_CHAMPIONSHIP_SUCCESS:
    case GET_CHAMPIONSHIP_ERROR:
      const {
        payload: { championship, error },
      } = action;

      return {
        ...state,
        data: championship,
        error,
        loading: false,
        loaded: !error,
      };
    default:
      return state;
  }
}
