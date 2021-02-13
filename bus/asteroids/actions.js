import { types } from './types';

export const asteroidsActions = {
  fillAsteroids: (asteroids) => {
    return {
      type: types.FILL_ASTEROIDS,
      payload: asteroids,
    }
  },
  loadAsteroidsAsync: () => {
    return {
      type: types.LOAD_ASTEROIDS_ASYNC,
    }
  }
};