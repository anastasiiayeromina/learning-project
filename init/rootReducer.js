// Core
import { combineReducers } from 'redux';
// Reducers
import { userReducer as user } from '../bus/user/reducer';

export const rootReducer = combineReducers({
  user,
});