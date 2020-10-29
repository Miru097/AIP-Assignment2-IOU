import axios from 'axios';
import { returnErrors } from './errorActions';

import {
    USER_LOADED,
    USER_LOADING,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    REGISTER_SUCCESS,
    REGISTER_FAIL
} from './types';

// Check token & load user
export const loadUser = () => (dispatch, getState) => {
    // User loading
    dispatch({ type: USER_LOADING });
    axios
        .get('/api/auth/user', tokenConfig(getState))
        .then(res =>
            dispatch({
                type: USER_LOADED,
                payload: res.data
            })
        )
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({
                type: AUTH_ERROR
            });
        });
};

//register
export const register = ({ name, email, password }) => dispatch => {
    // set headers
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    const body = JSON.stringify({ name, email, password });
    //async for res/err
    return new Promise((resolve, reject) => {
        axios
            .post('/api/users', body, config)
            .then(res => {
                dispatch({
                    type: REGISTER_SUCCESS,
                    payload: res.data
                });
                resolve(res)
            }
            )
            .catch(err => {
                //set error type
                dispatch(
                    returnErrors(err.response.data, err.response.status, 'REGISTER_FAIL')
                );
                dispatch({
                    type: REGISTER_FAIL
                });
                reject(err)
            });
    })
};
//login
export const login = ({ email, password }) => dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    const body = JSON.stringify({ email, password });
    return new Promise((resolve, reject) => {
        axios
            .post('/api/auth', body, config)
            //get payload
            .then(res => {
                dispatch({
                    type: LOGIN_SUCCESS,
                    payload: res.data
                })
                resolve(res)
            })
            .catch(err => {
                //set error typd
                dispatch(
                    returnErrors(err.response.data, err.response.status, 'LOGIN_FAIL')
                );
                dispatch({
                    type: LOGIN_FAIL
                });
                reject(err)
            });
    })
};
//log out
export const logout = () => {
    return {
        type: LOGOUT_SUCCESS
    };
};
// Setup config/headers and token
export const tokenConfig = getState => {
    // Get token from localstorage
    const token = getState().auth.token;
    const config = {
        headers: {
            'Content-type': 'application/json'
        }
    };
    // If token, add to headers
    if (token) {
        config.headers['x-auth-token'] = token;
    }
    return config;
};