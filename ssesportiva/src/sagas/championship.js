import { put, takeEvery } from 'redux-saga/effects';
import firebase from '../services/firebase';
import {
  GET_CHAMPIONSHIP,
  GET_CHAMPIONSHIP_SUCCESS,
  GET_CHAMPIONSHIP_ERROR,
  GET_CHAMPIONSHIP_LOADING,
} from '../actions/actionTypes';

export function* getChampionship({ payload: { id } }) {
  yield put({ type: GET_CHAMPIONSHIP_LOADING });

  console.log('XXXXX');
  console.log(id);

  try {
    const response = yield firebase
      .functions()
      .httpsCallable('getChampionship')({ id });
    const { data } = response;

    if (data.error) {
      const error = new Error(data.error);
      yield put({
        type: GET_CHAMPIONSHIP_ERROR,
        payload: { championship: null, error },
      });
      return;
    }

    yield put({
      type: GET_CHAMPIONSHIP_SUCCESS,
      payload: { championship: data, error: null },
    });
  } catch (error) {
    yield put({
      type: GET_CHAMPIONSHIP_ERROR,
      payload: { championship: null, error },
    });
  }
}

export function* watchGetChampionship() {
  yield takeEvery(GET_CHAMPIONSHIP, getChampionship);
}
