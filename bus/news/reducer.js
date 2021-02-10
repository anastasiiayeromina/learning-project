import { types } from './types';

const initialState = [];

export const newsReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case types.FILL_NEWS:
      return [...state, ...payload];
    default:
      return state;
  }
}