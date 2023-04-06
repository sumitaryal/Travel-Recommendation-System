import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    LOGOUT_FAIL,
    AUTHENTICATION_SUCCESS,
    AUTHENTICATION_FAIL,
    DELETE_USER_SUCCESS,
    DELETE_USER_FAIL,
} from '../actions/types';

const initialState = {
    isAuthenticated: null,
};

export default function(state = initialState, action) {
    const { type, payload } = action;

    switch(type) {
        case AUTHENTICATION_SUCCESS:
            return {
                ...state,
                isAuthenticated: payload
            }
        case AUTHENTICATION_FAIL:
            return {    
                ...state,
                isAuthenticated: payload
            }
        case REGISTER_SUCCESS:
            return {
                ...state,
                isAuthenticated: false
            }
        case REGISTER_FAIL:
            return state
        case LOGIN_SUCCESS:
            return {
                ...state,
                isAuthenticated: true
            }
        case LOGIN_FAIL:
            return state
        case LOGOUT_SUCCESS:
            return {
                ...state,
                isAuthenticated: false
            }
        case LOGOUT_FAIL:
            return state
        case DELETE_USER_SUCCESS:
            return {
                ...state,
                isAuthenticated: false
            }
        case DELETE_USER_FAIL:
            return state
        default:
            return state;
    }
}

