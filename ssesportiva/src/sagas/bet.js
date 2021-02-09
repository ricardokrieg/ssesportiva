import { put, takeEvery, select } from 'redux-saga/effects';
import { find, reject } from 'lodash';
import {
  ADD_OPTION,
  ADD_OPTION_SUCCESS,
  REMOVE_OPTION,
  REMOVE_OPTION_SUCCESS,
} from '../actions/actionTypes';
import { openToast } from '../actions/toast';

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
    // TODO pick correct error message from old project
    yield put(openToast('Múltiplas apostas na mesma partida'));
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
