import { put, takeEvery } from 'redux-saga/effects';
import firebase from '../services/firebase';
import {
  GET_CHAMPIONSHIP,
  GET_CHAMPIONSHIP_SUCCESS,
  GET_CHAMPIONSHIP_ERROR,
  GET_CHAMPIONSHIP_LOADING,
} from '../actions/actionTypes';
import { filter } from 'lodash';
import moment from 'moment';

export function* getChampionship({ payload: { id } }) {
  yield put({ type: GET_CHAMPIONSHIP_LOADING });

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

    let { games } = data;
    games = filter(games, (game) => {
      const gameDate = moment(game.date, 'DD/MM/YYYY hh:mm');

      return gameDate > moment();
    });

    yield put({
      type: GET_CHAMPIONSHIP_SUCCESS,
      payload: { championship: { ...data, games }, error: null },
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
