// Core
import { put, call, delay } from 'redux-saga/effects';

// Instruments
import { catsActions } from '../../actions';
import { environmentVerify } from "../../../../helpers/verifyEnvironment";
import { developmentLogger, productionLogger } from "../../../../helpers/logger";

export function* loadCats () {
  const {
    isDevelopment,
    isProduction
  } = environmentVerify();

  const url = '/api/cats';
  let status = null;

  try {
    if (isDevelopment) {
      developmentLogger.info(`API GET request to ${url} was started...`);
    }

    const response = yield call(fetch, url);
    status = response.status;

    const results = yield call([response, response.json]);

    if (status !== 200) {
      if (isDevelopment) {
        developmentLogger.warn({
          message: `Current status code is: ${status}`
        });
      }

      if (isProduction) {
        productionLogger.warn({
          url,
          method: 'GET',
          status,
          message: `API Error`
        });
      }
    }

    // yield delay(2000);
    yield put(catsActions.fillCats(results));
  } catch (error) {
    if (isDevelopment) {
      developmentLogger.warn({
        message: `Current status code is: ${status}`
      });
    }

    if (isProduction) {
      productionLogger.warn({
        url,
        method: 'GET',
        status,
        message: `API Error`
      });
    }
  } finally {
    if (isDevelopment) {
      developmentLogger.info(`API GET request to ${url} was finished with status ${status}`);
    }
  }
}