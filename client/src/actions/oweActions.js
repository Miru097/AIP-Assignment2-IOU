import axios from 'axios';
import { GET_OWES, ADD_OWE, DELETE_OWE, OWES_LOADING } from './types';
import { tokenConfig } from './authActions';
import { returnErrors } from './errorActions';

export const getOwes = () => dispatch => {
  dispatch(setOwesLoading());
  axios.get('/api/owes')
    .then(res => dispatch({
      type: GET_OWES,
      payload: res.data
    }))
    .catch(
      err => dispatch(returnErrors(err.response.data, err.response.status))
    );
};

export const addOwe = owe => (dispatch, getState) => {
  axios
    .post('/api/owes', owe, tokenConfig(getState))
    .then(res => dispatch({
      type: ADD_OWE,
      payload: res.data
    }))
    .catch(
      err => dispatch(returnErrors(err.response.data, err.response.status))
    );
};

export const deleteOwe = id => (dispatch, getState) => {
  axios
    .delete(`/api/owes/${id}`, tokenConfig(getState))
    .then(res => dispatch({
      type: DELETE_OWE,
      payload: id
    }))
    .catch(
      err => dispatch(returnErrors(err.response.data, err.response.status))
    );
};



export const setOwesLoading = () => {
  return {
    type: OWES_LOADING
  };
};