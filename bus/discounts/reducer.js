import { types } from './types';

const initialState = [];

export const discountsReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case types.FILL_DISCOUNTS:
      return [...state, ...payload];
    default:
      return state;
  }
}