import { put, takeEvery } from 'redux-saga/effects';
import {
  GET_CONFIRMED_BETS,
  GET_CONFIRMED_BETS_SUCCESS,
  GET_CONFIRMED_BETS_ERROR,
  GET_CONFIRMED_BETS_LOADING,
} from '../actions/actionTypes';
import { openErrorToast, openDefaultErrorToast } from '../actions/toast';
import firebase from '../services/firebase';

export function* getConfirmedBets() {
  yield put({ type: GET_CONFIRMED_BETS_LOADING });

  try {
    const response = yield firebase
      .functions()
      .httpsCallable('getConfirmedBets')();
    const { data } = response;

    if (data.error) {
      const error = new Error(data.error);
      yield put({
        type: GET_CONFIRMED_BETS_ERROR,
        payload: { error },
      });
      yield put(openErrorToast('Erro', data.error));
      return;
    }

    yield put({
      type: GET_CONFIRMED_BETS_SUCCESS,
      payload: { confirmedBets: data },
    });
  } catch (error) {
    yield put({
      type: GET_CONFIRMED_BETS_ERROR,
      payload: { error },
    });
    yield put(openDefaultErrorToast());
  }
}

export function* watchGetConfirmedBets() {
  yield takeEvery(GET_CONFIRMED_BETS, getConfirmedBets);
}
