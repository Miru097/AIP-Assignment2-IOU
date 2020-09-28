import { combineReducers } from 'redux';
import oweReducer from './oweReducer';
import errorReducer from './errorReducer';
import authReducer from './authReducer';
import userReducer from './userReducer';
import requestReducer from './requestReducer';

export default combineReducers({
    owe: oweReducer,
    error: errorReducer,
    auth: authReducer,
    user: userReducer,
    request: requestReducer
})