import { combineReducers } from 'redux';
import oweReducer from './oweReducer';
import errorReducer from './errorReducer';
import authReducer from './authReducer';
import userReducer from './userReducer';
import requestReducer from './requestReducer';
//all state index
export default combineReducers({
    owe: oweReducer,
    error: errorReducer,
    auth: authReducer,
    user: userReducer,
    request: requestReducer
})