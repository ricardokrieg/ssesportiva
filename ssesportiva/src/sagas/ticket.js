import { put, takeEvery } from 'redux-saga/effects';
import firebase from '../services/firebase';
import {
  GET_TICKET,
  GET_TICKET_SUCCESS,
  GET_TICKET_ERROR,
  GET_TICKET_LOADING,
} from '../actions/actionTypes';
import { openToast } from '../actions/toast';

export function* getTicket({ payload: { id } }) {
  yield put({ type: GET_TICKET_LOADING });

  try {
    const response = yield firebase.functions().httpsCallable('getTicket')({
      id,
    });
    const { data } = response;

    if (data.error) {
      const error = new Error(data.error);
      yield put({
        type: GET_TICKET_ERROR,
        payload: { error },
      });
      yield put(openToast(`Bilhete não encontrado`));
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
    yield put(openToast(`Ocorreu um erro!`));
  }
}

export function* watchGetTicket() {
  yield takeEvery(GET_TICKET, getTicket);
}
