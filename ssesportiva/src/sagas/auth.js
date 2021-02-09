import { put, takeEvery } from 'redux-saga/effects';
import firebase from '../services/firebase';
import {
  SIGNIN,
  SIGNIN_ERROR,
  SIGNIN_SUCCESS,
  SIGNOUT,
  SIGNOUT_SUCCESS,
  SIGNOUT_ERROR,
  GET_MEMBER_DETAILS,
  GET_MEMBER_DETAILS_SUCCESS,
  GET_MEMBER_DETAILS_ERROR,
} from '../actions/actionTypes';

export function* signin({ payload: { email, password } }) {
  try {
    yield firebase.auth().signInWithEmailAndPassword(email, password);
    yield put({ type: SIGNIN_SUCCESS });
  } catch (error) {
    yield put({ type: SIGNIN_ERROR, error });
  }
}

export function* watchSignin() {
  yield takeEvery(SIGNIN, signin);
}

export function* signout() {
  try {
    yield firebase.auth().signOut();
    yield put({ type: SIGNOUT_SUCCESS });
  } catch (error) {
    yield put({ type: SIGNOUT_ERROR, error });
  }
}

export function* watchSignout() {
  yield takeEvery(SIGNOUT, signout);
}

export function* getMemberDetails() {
  try {
    const response = yield firebase
      .functions()
      .httpsCallable('getMemberDetails')();
    const { data } = response;

    if (data.error) {
      const error = new Error(data.error);
      yield put({
        type: GET_MEMBER_DETAILS_ERROR,
        payload: { user: null, error },
      });
      return;
    }

    yield put({
      type: GET_MEMBER_DETAILS_SUCCESS,
      payload: { user: data, error: null },
    });
  } catch (error) {
    yield put({
      type: GET_MEMBER_DETAILS_ERROR,
      payload: { user: null, error },
    });
  }
}

export function* watchGetMemberDetails() {
  yield takeEvery(GET_MEMBER_DETAILS, getMemberDetails);
}
