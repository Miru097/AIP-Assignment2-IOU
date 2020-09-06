//import { v4 as uuidv4 } from 'uuid';
import { GET_OWES, ADD_OWE, DELETE_OWE, OWES_LOADING } from '../actions/types';

const initialState = {
    owes: [],
    loading: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_OWES:
            return {
                ...state,
                owes: action.payload,
                loading: false
            };
        case DELETE_OWE:
            return {
                ...state,
                owes: state.owes.filter(owe => owe._id !== action.payload)
            };
        case ADD_OWE:
            return {
                ...state,
                owes: [action.payload, ...state.owes]
            };
        case OWES_LOADING:
            return {
                ...state,
                loading: true
            };
        default:
            return state;
    }
}