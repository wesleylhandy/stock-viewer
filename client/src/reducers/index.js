import { combineReducers } from 'redux';

import date from './date';
import stocks from './stocks';


const rootReducer = combineReducers({ date, stocks });

export default rootReducer;