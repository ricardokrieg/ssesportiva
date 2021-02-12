import { put, takeEvery } from 'redux-saga/effects';
import {
  GET_PENDING_BET,
  GET_PENDING_BET_LOADING,
  GET_PENDING_BET_SUCCESS,
  GET_PENDING_BET_ERROR,
} from '../actions/actionTypes';
import { openErrorToast, openDefaultErrorToast } from '../actions/toast';
import firebase from '../services/firebase';

export function* getPendingBet({ payload: { code } }) {
  yield put({ type: GET_PENDING_BET_LOADING });

  try {
    const response = yield firebase.functions().httpsCallable('searchBet')({
      code,
    });
    const { data } = response;

    if (data.error) {
      const error = new Error(data.error);
      yield put({
        type: GET_PENDING_BET_ERROR,
        payload: { error },
      });
      yield put(openErrorToast('Erro', data.error));
      return;
    }

    yield put({
      type: GET_PENDING_BET_SUCCESS,
      payload: { pendingBet: data },
    });
  } catch (error) {
    yield put({
      type: GET_PENDING_BET_ERROR,
      payload: { error },
    });
    yield put(openDefaultErrorToast());
  }
}

export function* watchGetPendingBet() {
  yield takeEvery(GET_PENDING_BET, getPendingBet);
}
