import { put, takeEvery, select } from 'redux-saga/effects';
import { find, reject, map, pick } from 'lodash';
import {
  ADD_OPTION,
  ADD_OPTION_SUCCESS,
  REMOVE_OPTION,
  REMOVE_OPTION_SUCCESS,
  PLACE_BET,
  PLACE_BET_LOADING,
  PLACE_BET_SUCCESS,
  PLACE_BET_ERROR,
} from '../actions/actionTypes';
import {
  openSuccessToast,
  openErrorToast,
  openDefaultErrorToast,
} from '../actions/toast';
import firebase from '../services/firebase';

export const getValue = (state) => state.bet.value;
export const getOptions = (state) => state.bet.options;

export function* addOption({ payload: { championship, game, quote, option } }) {
  const optionData = {
    championship: championship.title,
    championshipId: championship.id,
    game: game.title,
    gameDate: game.date,
    gameId: game.id,
    group: championship.group,
    id: option.id,
    quote: option.quote,
    quoteType: quote.type,
    title: option.title,
  };

  let options = yield select(getOptions);

  if (find(options, { gameId: optionData.gameId })) {
    yield put(
      openErrorToast('Aposta inválida', 'Múltiplas apostas na mesma partida')
    );
    return;
  }

  options = [...options, optionData];

  yield put({
    type: ADD_OPTION_SUCCESS,
    payload: { options },
  });
}

export function* watchAddOption() {
  yield takeEvery(ADD_OPTION, addOption);
}

export function* removeOption({ payload: { option } }) {
  let options = yield select(getOptions);

  options = reject(options, { id: option.id });

  yield put({
    type: REMOVE_OPTION_SUCCESS,
    payload: { options },
  });
}

export function* watchRemoveOption() {
  yield takeEvery(REMOVE_OPTION, removeOption);
}

export function* placeBet() {
  yield put({ type: PLACE_BET_LOADING });

  let betValue = yield select(getValue);
  let options = yield select(getOptions);

  betValue = betValue * 100;
  options = map(options, (option) => pick(option, ['id', 'gameId']));

  try {
    const response = yield firebase.functions().httpsCallable('placeBet')({
      betValue,
      options,
    });
    const { data } = response;

    if (data.error) {
      const error = new Error(data.error);
      yield put({
        type: PLACE_BET_ERROR,
        payload: { error },
      });
      yield put(openErrorToast('Erro', data.error));
      return;
    }

    yield put({
      type: PLACE_BET_SUCCESS,
      payload: { code: data.code },
    });
  } catch (error) {
    yield put({
      type: PLACE_BET_ERROR,
      payload: { error },
    });
    yield put(openDefaultErrorToast());
  }
}

export function* watchPlaceBet() {
  yield takeEvery(PLACE_BET, placeBet);
}
