import { all, put, takeEvery } from 'redux-saga/effects';
import firebase from '../services/firebase';
import {
  SIGNIN,
  SIGNIN_ERROR,
  SIGNIN_SUCCESS,
  GET_MEMBER_DETAILS,
  GET_MEMBER_DETAILS_SUCCESS,
  GET_MEMBER_DETAILS_ERROR,
} from '../actions/actionTypes';

export function* signin({ payload: { email, password } }) {
  try {
    console.log(email, password);
    yield firebase.auth().signInWithEmailAndPassword(email, password);
    yield put({ type: SIGNIN_SUCCESS });
  } catch (error) {
    yield put({ type: SIGNIN_ERROR, error });
  }
}

export function* watchSignin() {
  yield takeEvery(SIGNIN, signin);
}

export function* getMemberDetails() {
  try {
    const user = { name: 'Ricardo 2' };
    const error = null;
    throw new Error('Testando');
    yield put({ type: GET_MEMBER_DETAILS_SUCCESS, payload: { user, error } });
  } catch (error) {
    const user = null;
    yield put({ type: GET_MEMBER_DETAILS_ERROR, payload: { user, error } });
  }
}

export function* watchGetMemberDetails() {
  yield takeEvery(GET_MEMBER_DETAILS, getMemberDetails);
}

export default function* rootSaga() {
  yield all([watchSignin(), watchGetMemberDetails()]);
}
