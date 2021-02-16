import { put, takeEvery } from 'redux-saga/effects';
import {
  GET_PENDING_TICKETS,
  GET_PENDING_TICKETS_SUCCESS,
  GET_PENDING_TICKETS_ERROR,
  GET_PENDING_TICKETS_LOADING,
} from '../actions/actionTypes';
import { openErrorToast, openDefaultErrorToast } from '../actions/toast';
import firebase from '../services/firebase';

export function* getPendingTickets() {
  yield put({ type: GET_PENDING_TICKETS_LOADING });

  try {
    const response = yield firebase
      .functions()
      .httpsCallable('getPendingTickets')();
    const { data } = response;

    if (data.error) {
      const error = new Error(data.error);
      yield put({
        type: GET_PENDING_TICKETS_ERROR,
        payload: { error },
      });
      return;
    }

    yield put({
      type: GET_PENDING_TICKETS_SUCCESS,
      payload: { pendingTickets: data },
    });
  } catch (error) {
    yield put({
      type: GET_PENDING_TICKETS_ERROR,
      payload: { error },
    });
  }
}

export function* watchGetPendingTickets() {
  yield takeEvery(GET_PENDING_TICKETS, getPendingTickets);
}
