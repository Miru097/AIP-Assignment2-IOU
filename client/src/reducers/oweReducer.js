import { GET_OWES, ADD_OWE, DELETE_OWE, OWES_LOADING, DELETE_FAIL, ADD_FAIL } from '../actions/types';
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
                loading: false,
            };
        case DELETE_OWE:
            //delete from state
            return {
                ...state,
                owes: state.owes.filter(owe => owe._id !== action.payload)
            };
        case ADD_FAIL:
            //do not change state
            return {
                ...state,
                owes: [...state.owes],
            };
        case ADD_OWE:
            //add to state
            return {
                ...state,
                owes: [action.payload, ...state.owes],
            };
        case OWES_LOADING:
            return {
                ...state,
                loading: true
            };
        case DELETE_FAIL:
            return {
                ...state,
            }
        default:
            return state;
    }
}