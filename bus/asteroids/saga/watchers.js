// Core
import { takeEvery, all, call } from 'redux-saga/effects';
// Types
import { types } from '../types';
// Workers
import { loadAsteroids } from './workers/loadAsteroids';

function* watchLoadAsteroids() {
  yield takeEvery(types.LOAD_ASTEROIDS_ASYNC, loadAsteroids);
}

export function* watchAsteroids() {
  yield all([call(watchLoadAsteroids)]);
}