// Other
import { developmentLogger } from './logger/developmentLogger';

export const serverReduxLogger = store => next => action => {
  developmentLogger.info(`Redux dispatch: ${action.type}`);

  next(action);
}