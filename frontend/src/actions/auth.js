import axios from "axios";
import Cookies from "js-cookie";
import { loadUserProfile } from "./profile";
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
} from "./types";



export const checkAuthenticated = () => async (dispatch) => {
    const config = {
        headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        },
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/accounts/authenticated/`, config);
        if( res.data.error || res.data.isAuthenticated === "error"){
            dispatch({
                type: AUTHENTICATION_FAIL,
                payload: false
            });
        }
        else if (res.data.isAuthenticated === "success"){
            dispatch({
                type: AUTHENTICATION_SUCCESS,
                payload: true
            });
        }
        else{
            dispatch({
                type: AUTHENTICATION_FAIL,
                payload: false
            });
        }
    } catch (err) {
        dispatch({
            type: AUTHENTICATION_FAIL,
            payload: false
        });
    }
}




export const login = ({ username, password }) => async (dispatch) => {
    const config = {
        headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken")
        },
    };

    const body  = JSON.stringify({ username, password });
    try{
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/accounts/login/`, body, config);
        if (res.data.success){
            dispatch({
                type: LOGIN_SUCCESS,
            });
            dispatch(loadUserProfile()); // This is the line that is causing the error in the console log below 
        }
        else{   
            dispatch({
                type: LOGIN_FAIL,
            });
        }
    }
    catch(err){
        dispatch({
            type: LOGIN_FAIL,
        }); 

    }
}

export const register = ({ username, password, re_password }) => async (dispatch) => {
    const config = {
        headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken")
        },
    };
    
    const body = JSON.stringify({ username, password, re_password });
    
    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/accounts/signup/`, body, config);
        if (res.data.err){
            console.log("error")
            dispatch({
                type: REGISTER_FAIL,
                payload: res.data.err,
            });
        }
        console.log("success")
        dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
        });
    } catch (err) {
        dispatch({
        type: REGISTER_FAIL,
        });
    }
}


export const logout = () => async (dispatch) => {
    const config = {
        headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken")
        },
    };

    const body = JSON.stringify({
        "withCredentials": true,

    });

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/accounts/logout/` ,body, config);

        if (res.data.success){
            dispatch({
                type: LOGOUT_SUCCESS,
            });
        }
        else{
            dispatch({
                type: LOGOUT_FAIL,
            });
        }

    } catch (err) {
        dispatch({
        type: LOGOUT_FAIL,
        });
    }
}


export const deleteUser = () => async (dispatch) => {
    const config = {
        headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken")
        },
    };

    const body = JSON.stringify({
        "withCredentials": true,

    });

    try {
        const res = await axios.delete(`${process.env.REACT_APP_API_URL}/accounts/delete/` ,config, body);

        if (res.data.success){
            dispatch({
                type: DELETE_USER_SUCCESS,
            });
        }
        else{
            dispatch({
                type: DELETE_USER_FAIL,
            });
        }

    } catch (err) {
        dispatch({
        type: DELETE_USER_FAIL,
        });
    }
}