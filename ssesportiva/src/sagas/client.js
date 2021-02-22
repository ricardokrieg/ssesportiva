import { put, takeEvery } from 'redux-saga/effects';
import firebase from '../services/firebase';
import {
  GET_CLIENTS,
  GET_CLIENTS_SUCCESS,
  GET_CLIENTS_ERROR,
  GET_CLIENTS_LOADING,
  GET_CLIENT,
  GET_CLIENT_SUCCESS,
  GET_CLIENT_ERROR,
  GET_CLIENT_LOADING,
  ADD_CLIENT,
  ADD_CLIENT_SUCCESS,
  ADD_CLIENT_ERROR,
  ADD_CLIENT_LOADING,
} from '../actions/actionTypes';
import { openDefaultErrorToast, openErrorToast } from '../actions/toast';

export function* getClients() {
  yield put({ type: GET_CLIENTS_LOADING });

  try {
    const response = yield firebase.functions().httpsCallable('getClients')();
    const { data } = response;

    if (data.error) {
      const error = new Error(data.error);
      yield put({ type: GET_CLIENTS_ERROR, payload: { error } });
      yield put(openErrorToast('Erro', data.error));
      return;
    }

    yield put({
      type: GET_CLIENTS_SUCCESS,
      payload: { clients: data },
    });
  } catch (error) {
    yield put({ type: GET_CLIENTS_ERROR, payload: { error } });
    yield put(openDefaultErrorToast());
  }
}

export function* watchGetClients() {
  yield takeEvery(GET_CLIENTS, getClients);
}

export function* getClient({ payload: { id } }) {
  yield put({ type: GET_CLIENT_LOADING });

  try {
    const response = yield firebase.functions().httpsCallable('getClient')({
      id,
    });
    const { data } = response;

    if (data.error) {
      const error = new Error(data.error);
      yield put({ type: GET_CLIENT_ERROR, payload: { error } });
      return;
    }

    yield put({
      type: GET_CLIENT_SUCCESS,
      payload: { client: data },
    });
  } catch (error) {
    yield put({ type: GET_CLIENT_ERROR, payload: { error } });
  }
}

export function* watchGetClient() {
  yield takeEvery(GET_CLIENT, getClient);
}

export function* addClient({ payload: { name } }) {
  yield put({ type: ADD_CLIENT_LOADING });

  try {
    const response = yield firebase.functions().httpsCallable('addClient')({
      name,
    });
    const { data } = response;

    if (data.error) {
      const error = new Error(data.error);
      yield put({ type: ADD_CLIENT_ERROR, payload: { error } });
      yield put(openErrorToast('Erro', data.error));
      return;
    }

    yield put({
      type: ADD_CLIENT_SUCCESS,
      payload: { client: data },
    });
  } catch (error) {
    yield put({ type: ADD_CLIENT_ERROR, payload: { error } });
    yield put(openDefaultErrorToast());
  }
}

export function* watchAddClient() {
  yield takeEvery(ADD_CLIENT, addClient);
}
