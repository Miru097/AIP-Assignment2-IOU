import { GET_REQUESTS, ADD_REQUEST, DELETE_REQUEST, REQUESTS_LOADING, ADD_REQUEST_FAIL, ACCEPT_REQUEST, UPDATE_REQUEST } from '../actions/types';
const initialState = {
    requests: [],
    loading: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_REQUESTS:
            return {
                ...state,
                requests: action.payload,
                loading: false,
            };
        case DELETE_REQUEST:
            return {
                ...state,
                requests: state.requests.filter(request => request._id !== action.payload)
            };
        case ADD_REQUEST_FAIL:
            return {
                ...state,
                requests: [...state.requests],
            };
        case ADD_REQUEST:
            return {
                ...state,
                requests: [action.payload, ...state.requests],
            };
        case REQUESTS_LOADING:
            return {
                ...state,
                loading: true
            };
        case ACCEPT_REQUEST:
            return {
                ...state,
                requests: state.requests.filter(request => request._id !== action.payload)
            }
        case UPDATE_REQUEST:
            return {
                ...state,
                requests: [...state.requests],
            }
        default:
            return state;
    }
}