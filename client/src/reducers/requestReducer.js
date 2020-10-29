import {
    GET_REQUESTS, ADD_REQUEST, DELETE_REQUEST, REQUESTS_LOADING, CHECK_FAIL,
    ADD_REQUEST_FAIL, ACCEPT_REQUEST, UPDATE_REQUEST, CHECK_REQUEST, CLEAR_CHECK_REQUEST
} from '../actions/types';
const initialState = {
    requests: [],
    loading: false,
    checkRequest: []
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
            //delete from state
            return {
                ...state,
                requests: state.requests.filter(request => request._id !== action.payload)
            };
        case ADD_REQUEST_FAIL:
            //add to state
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
            //delete this request from request state
            return {
                ...state,
                requests: state.requests.filter(request => request._id !== action.payload)
            }
        case UPDATE_REQUEST:
            return {
                ...state,
                requests: [...state.requests],
            }
        case CHECK_REQUEST:
            return {
                ...state,
                checkRequest: action.payload,
            }
        case CLEAR_CHECK_REQUEST:
            return {
                ...state,
                checkRequest: null,
            }
        case CHECK_FAIL:
            return {
                ...state
            }
        default:
            return state;
    }
}