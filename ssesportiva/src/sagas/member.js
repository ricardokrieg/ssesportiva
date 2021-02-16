import { put, takeEvery } from 'redux-saga/effects';
import firebase from '../services/firebase';
import {
  GET_MEMBERS,
  GET_MEMBERS_SUCCESS,
  GET_MEMBERS_ERROR,
  GET_MEMBERS_LOADING,
} from '../actions/actionTypes';

export function* getMembers() {
  yield put({ type: GET_MEMBERS_LOADING });

  try {
    const response = yield firebase.functions().httpsCallable('getMembers')();
    const { data } = response;

    if (data.error) {
      const error = new Error(data.error);
      yield put({ type: GET_MEMBERS_ERROR, payload: { error } });
      return;
    }

    yield put({
      type: GET_MEMBERS_SUCCESS,
      payload: { members: data },
    });
  } catch (error) {
    yield put({ type: GET_MEMBERS_ERROR, payload: { error } });
  }
}

export function* watchGetMembers() {
  yield takeEvery(GET_MEMBERS, getMembers);
}
