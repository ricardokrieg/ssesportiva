import { put, takeEvery } from 'redux-saga/effects';
import firebase from '../services/firebase';
import {
  GET_GAME,
  GET_GAME_SUCCESS,
  GET_GAME_ERROR,
  GET_GAME_LOADING,
} from '../actions/actionTypes';

export function* getGame({ payload: { id } }) {
  yield put({ type: GET_GAME_LOADING });

  try {
    const response = yield firebase.functions().httpsCallable('getGame')({
      id,
    });
    const { data } = response;

    if (data.error) {
      const error = new Error(data.error);
      yield put({
        type: GET_GAME_ERROR,
        payload: { game: null, error },
      });
      return;
    }

    yield put({
      type: GET_GAME_SUCCESS,
      payload: { game: data, error: null },
    });
  } catch (error) {
    yield put({
      type: GET_GAME_ERROR,
      payload: { game: null, error },
    });
  }
}

export function* watchGetGame() {
  yield takeEvery(GET_GAME, getGame);
}
