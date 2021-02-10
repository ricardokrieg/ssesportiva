import {
  GET_CHAMPIONSHIP_SUCCESS,
  GET_CHAMPIONSHIP_ERROR,
  GET_CHAMPIONSHIP_LOADING,
} from '../actions/actionTypes';

const initialState = {
  data: null,
  loading: false,
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
      const {
        payload: { championship },
      } = action;

      return {
        ...state,
        data: championship,
        error: null,
        loading: false,
      };
    case GET_CHAMPIONSHIP_ERROR:
      const {
        payload: { error },
      } = action;

      return {
        ...state,
        data: null,
        error,
        loading: false,
      };
    default:
      return state;
  }
}
