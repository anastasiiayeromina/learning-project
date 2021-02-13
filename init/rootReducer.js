// Core
import { combineReducers } from 'redux';
// Reducers
import { userReducer as user } from '../bus/user/reducer';
import { newsReducer as news } from '../bus/news/reducer';
import { discountsReducer as discounts } from '../bus/discounts/reducer';
import { carsReducer as cars } from '../bus/cars/reducer';
import { asteroidsReducer as asteroids } from '../bus/asteroids/reducer';

export const rootReducer = combineReducers({
  user,
  news,
  discounts,
  cars,
  asteroids,
});