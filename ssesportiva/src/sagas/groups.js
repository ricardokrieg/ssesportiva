import { put, takeEvery } from 'redux-saga/effects';
import firebase from '../services/firebase';
import {
  GET_GROUPS,
  GET_GROUPS_SUCCESS,
  GET_GROUPS_ERROR,
  GET_GROUPS_LOADING,
} from '../actions/actionTypes';

export function* getGroups() {
  yield put({ type: GET_GROUPS_LOADING });

  try {
    const response = yield firebase.functions().httpsCallable('getMenu')();
    const { data } = response;

    if (data.error) {
      const error = new Error(data.error);
      yield put({ type: GET_GROUPS_ERROR, payload: { groups: [], error } });
      return;
    }

    yield put({
      type: GET_GROUPS_SUCCESS,
      payload: { groups: data.data, error: null },
    });
  } catch (error) {
    yield put({ type: GET_GROUPS_ERROR, payload: { groups: null, error } });
  }
}

export function* watchGetGroups() {
  yield takeEvery(GET_GROUPS, getGroups);
}
