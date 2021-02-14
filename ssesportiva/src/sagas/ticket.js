import { put, takeEvery } from 'redux-saga/effects';
import firebase from '../services/firebase';
import {
  GET_TICKET,
  GET_TICKET_SUCCESS,
  GET_TICKET_ERROR,
  GET_TICKET_LOADING,
  SET_TICKET_RESULT,
  SET_TICKET_RESULT_LOADING,
  SET_TICKET_RESULT_ERROR,
} from '../actions/actionTypes';
import { openDefaultErrorToast, openErrorToast } from '../actions/toast';

export function* getTicket({ payload: { id } }) {
  yield put({ type: GET_TICKET_LOADING });

  try {
    const response = yield firebase.functions().httpsCallable('getTicket')({
      id: id.toUpperCase(),
    });
    const { data } = response;

    if (data.error) {
      const error = new Error(data.error);
      yield put({
        type: GET_TICKET_ERROR,
        payload: { error },
      });
      yield put(openErrorToast('Erro', error.message));
      return;
    }

    yield put({
      type: GET_TICKET_SUCCESS,
      payload: { ticket: data },
    });
  } catch (error) {
    yield put({
      type: GET_TICKET_ERROR,
      payload: { error },
    });
    yield put(openDefaultErrorToast());
  }
}

export function* watchGetTicket() {
  yield takeEvery(GET_TICKET, getTicket);
}

export function* setTicketResult({ payload: { code, result } }) {
  yield put({ type: SET_TICKET_RESULT_LOADING });

  try {
    const response = yield firebase
      .functions()
      .httpsCallable('setTicketResult')({
      code,
      result,
    });
    const { data } = response;

    if (data.error) {
      const error = new Error(data.error);
      yield put({
        type: SET_TICKET_RESULT_ERROR,
        payload: { error },
      });
      yield put(openErrorToast(error.message));
      return;
    }

    yield put({
      type: GET_TICKET_SUCCESS,
      payload: { ticket: data },
    });
  } catch (error) {
    yield put({
      type: SET_TICKET_RESULT_ERROR,
      payload: { error },
    });
    yield put(openDefaultErrorToast());
  }
}

export function* watchSetTicketResult() {
  yield takeEvery(SET_TICKET_RESULT, setTicketResult);
}
