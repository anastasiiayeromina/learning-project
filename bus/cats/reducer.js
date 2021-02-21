import { types } from "./types";

const initialState = {
  entries: null,
};

export const catsReducer = (
  state = initialState,
  { type, payload }
) => {
  switch (type) {
    case types.FILL_CATS:
      return {...state, entries: payload};

    default:
      return state;
  };
};