import { put, takeEvery } from 'redux-saga/effects';
import firebase from '../services/firebase';
import {
  GET_GAME,
  GET_GAME_SUCCESS,
  GET_GAME_ERROR,
  GET_GAME_LOADING,
  GET_GAMES_BY_DATE,
  GET_GAMES_BY_DATE_SUCCESS,
  GET_GAMES_BY_DATE_ERROR,
  GET_GAMES_BY_DATE_LOADING,
} from '../actions/actionTypes';
import moment from 'moment';
import { find } from 'lodash';

const formatGamesByDate = (games) => {
  const groups = [];

  for (let game of games) {
    const gameDate = moment(game.date, 'DD/MM/YYYY hh:mm');
    if (gameDate <= moment()) continue;

    const { group, championshipTitle, championshipId } = game;

    let groupData = find(groups, { name: group });
    if (!groupData) {
      groupData = { name: group, championships: [] };
      groups.push(groupData);
    }

    let championshipData = find(groupData.championships, {
      title: championshipTitle,
    });

    if (!championshipData) {
      championshipData = {
        title: championshipTitle,
        id: championshipId,
        group: group,
        games: [],
      };
      groupData.championships.push(championshipData);
    }

    championshipData.games.push(game);
  }

  console.log(groups);

  return groups;
};

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

export function* getGamesByDate({ payload: { date } }) {
  yield put({ type: GET_GAMES_BY_DATE_LOADING });

  try {
    const formattedDate = moment(date).format('DD/MM/YYYY');

    const response = yield firebase.functions().httpsCallable('getGamesByDate')(
      {
        date: formattedDate,
      }
    );
    const { data } = response;

    if (data.error) {
      const error = new Error(data.error);
      yield put({
        type: GET_GAMES_BY_DATE_ERROR,
        payload: { error },
      });
      return;
    }

    yield put({
      type: GET_GAMES_BY_DATE_SUCCESS,
      payload: { groups: formatGamesByDate(data) },
    });
  } catch (error) {
    yield put({
      type: GET_GAMES_BY_DATE_ERROR,
      payload: { error },
    });
  }
}

export function* watchGetGamesByDate() {
  yield takeEvery(GET_GAMES_BY_DATE, getGamesByDate);
}
