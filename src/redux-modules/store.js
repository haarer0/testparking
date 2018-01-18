import { createStore, applyMiddleware, combineReducers } from 'redux';

import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';

import {getDataFromDB, saveDataToDB} from '../services/serverInterface';
import parkingReducer from './parking';

const allReducers = combineReducers({
  parkings: parkingReducer
});

const initialData = getDataFromDB()

const logger = createLogger({
	diff: true
})

const store = createStore(allReducers, initialData, applyMiddleware(thunk, logger))

store.subscribe(() => {
	saveDataToDB(store.getState())
})

export default store