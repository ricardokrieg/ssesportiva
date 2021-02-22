import {
  GET_CLIENTS_SUCCESS,
  GET_CLIENTS_ERROR,
  GET_CLIENTS_LOADING,
  GET_CLIENT_SUCCESS,
  GET_CLIENT_ERROR,
  GET_CLIENT_LOADING,
  ADD_CLIENT_SUCCESS,
  ADD_CLIENT_ERROR,
  ADD_CLIENT_LOADING,
} from '../actions/actionTypes';

const initialState = {
  clients: [],
  loadingClients: false,
  errorClients: null,
  client: null,
  loadingClient: false,
  errorClient: null,
};

export default function clientReducer(state = initialState, action) {
  switch (action.type) {
    case GET_CLIENTS_LOADING:
      return {
        ...state,
        loadingClients: true,
      };
    case GET_CLIENTS_SUCCESS:
      const {
        payload: { clients },
      } = action;

      return {
        ...state,
        clients,
        errorClients: null,
        loadingClients: false,
      };
    case GET_CLIENTS_ERROR:
      const {
        payload: { error },
      } = action;

      return {
        ...state,
        clients: [],
        errorClients: error,
        loadingClients: false,
      };
    case GET_CLIENT_LOADING:
      return {
        ...state,
        loadingClient: true,
      };
    case GET_CLIENT_SUCCESS:
      const {
        payload: { client },
      } = action;

      return {
        ...state,
        client,
        errorClient: null,
        loadingClient: false,
      };
    case GET_CLIENT_ERROR:
      return {
        ...state,
        client: null,
        errorClient: action.payload.error,
        loadingClient: false,
      };
    case ADD_CLIENT_LOADING:
      return {
        ...state,
        client: null,
        loadingClient: true,
      };
    case ADD_CLIENT_SUCCESS:
      return {
        ...state,
        client: action.payload.client,
        errorClient: null,
        loadingClient: false,
      };
    case ADD_CLIENT_ERROR:
      return {
        ...state,
        client: null,
        errorClient: action.payload.error,
        loadingClient: false,
      };
    default:
      return state;
  }
}
