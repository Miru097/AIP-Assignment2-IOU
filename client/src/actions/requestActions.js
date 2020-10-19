import axios from 'axios';
import {
    GET_REQUESTS, ADD_REQUEST, DELETE_REQUEST, REQUESTS_LOADING, CHECK_FAIL,
    ADD_REQUEST_FAIL, ACCEPT_REQUEST, UPDATE_REQUEST, CHECK_REQUEST, CLEAR_CHECK_REQUEST
} from './types';
import { tokenConfig } from './authActions';
import { returnErrors } from './errorActions';

export const getRequests = () => dispatch => {
    dispatch(setRequestsLoading());
    axios.get('/api/requests')
        .then(res => dispatch({
            type: GET_REQUESTS,
            payload: res.data
        }))
        .catch(
            err => dispatch(returnErrors(err.response.data, err.response.status))
        );
};
export const checkRequest = id => (dispatch, getState) => {
    axios.get(`/api/requests/${id}`, tokenConfig(getState))
        .then(res => dispatch({
            type: CHECK_REQUEST,
            payload: res.data
        }))
        .catch(
            err => {
                dispatch(
                    returnErrors(err.response.data, err.response.status, 'CHECK_FAIL')
                );
                dispatch({
                    type: CHECK_FAIL,
                });
            });
};

export const clearCheckRequest = () => {
    return {
        type: CLEAR_CHECK_REQUEST,
    };
};

export const addRequest = request => (dispatch, getState) => {
    axios
        .post('/api/requests', request, tokenConfig(getState))
        .then(
            res => {
                dispatch({
                    type: ADD_REQUEST,
                    payload: res.data,
                });
            })
        .catch(
            err => {
                dispatch(
                    returnErrors(err.response.data, err.response.status, 'ADD_REQUEST_FAIL')
                );
                dispatch({
                    type: ADD_REQUEST_FAIL
                });
            });
};


export const deleteRequest = id => (dispatch, getState) => {
    axios
        .delete(`/api/requests/${id}`, tokenConfig(getState))
        .then(res => dispatch({
            type: DELETE_REQUEST,
            payload: id
        }))
        .catch(
            err => dispatch(returnErrors(err.response.data, err.response.status))
        );
};

export const acceptRequest = (id, request) => (dispatch, getState) => {
    axios
        .put(`/api/requests/${id}`, request, tokenConfig(getState))
        .then(res => dispatch({
            type: ACCEPT_REQUEST,
            payload: id
        }))
        .catch(
            err => dispatch(returnErrors(err.response.data, err.response.status))
        );
};

export const updateRequest = (id, request) => (dispatch, getState) => {
    axios
        .put(`/api/requests/${id}`, request, tokenConfig(getState))
        .then(res => dispatch({
            type: UPDATE_REQUEST,
            payload: id
        }))
        .catch(
            err => dispatch(returnErrors(err.response.data, err.response.status))
        );
};


export const setRequestsLoading = () => {
    return {
        type: REQUESTS_LOADING
    };
};