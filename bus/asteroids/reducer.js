import { types } from "./types";

const initialState = {
  entries: null,
};

export const asteroidsReducer = (
  state = initialState,
  { type, payload }
) => {
  switch (type) {
    case types.FILL_ASTEROIDS:
      return {...state, entries: payload};
    default:
      return state;
  };
};