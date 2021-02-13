// Core
import { put, call, delay } from 'redux-saga/effects';
// Instruments
import { asteroidsActions } from '../../actions';

export function* loadAsteroids() {
  try {
    const response = yield call(fetch, 'http://www.asterank.com/api/asterank?query=%7B%22e%22:%7B%22$lt%22:0.1%7D,%22i%22:%7B%22$lt%22:4%7D,%22a%22:%7B%22$lt%22:1.5%7D%7D&limit=10');
    const result = yield call([response, response.json]);

    if (response.status !== 200) {
      throw new Error(`We can't receive starships 😢`);
    }

    // yield delay(2000); //only for see loading process
    yield put(asteroidsActions.fillAsteroids(result));

  } catch (error) {
    console.log('loadAsteroidsAsync: ', error);
  }
}