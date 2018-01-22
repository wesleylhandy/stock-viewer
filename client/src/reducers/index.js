import { combineReducers } from 'redux';

import date from './date';
import stocks from './stocks';
import ticker from './ticker';


const rootReducer = combineReducers({ date, stocks, ticker });

export default rootReducer;