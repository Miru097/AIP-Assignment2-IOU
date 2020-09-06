import { combineReducers } from 'redux';
import oweReducer from './oweReducer';
import errorReducer from './errorReducer';
import authReducer from './authReducer';

export default combineReducers({
    owe: oweReducer,
    error: errorReducer,
    auth: authReducer
})