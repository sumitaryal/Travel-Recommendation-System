import {
    LOAD_USER_PROFILE_SUCCESS,
    LOAD_USER_PROFILE_FAIL,
    UPDATE_USER_PROFILE_SUCCESS,
    UPDATE_USER_PROFILE_FAIL,
    ITINERARY_GET_SUCCESS,
    ITINERARY_GET_FAIL,
    SEARCH_FAIL,
    SEARCH_SUCCESS,
    RATE_DESTINATION_SUCCESS,
    RATE_DESTINATION_FAIL,
    BOOKMARK_SUCCESS,
    BOOKMARK_FAIL,
    RESET_ITINERARY
} from '../actions/types';

const initialState = {
    username: "",
    first_name : "",
    last_name : "",
    email : "",
    profilePicture: null,
    recommendation: [],
    total_budget: 0,
    destinations: [],
    recommendation_table: [],
    bookmark_list: [],
};

export default function(state = initialState, action) {
    const { type, payload } = action;

    switch(type) {
        case LOAD_USER_PROFILE_SUCCESS:
        case UPDATE_USER_PROFILE_SUCCESS:
            // const { username, first_name, last_name, email } = payload;
            return {
                ...state,
                username: payload.username,
                first_name : payload.profile.first_name,
                last_name : payload.profile.last_name,
                email : payload.profile.email,
                profilePicture: payload.profile.profile_picture,
                recommendation_table: payload.recommendation_table,
                bookmark_list: payload.bookmark_list,
        };

        case LOAD_USER_PROFILE_FAIL:
            return{
                ...state,
                username: "",
                first_name : "",
                last_name : "",
                email : "",
                recommendations: [],
                profilePicture: null,
            }
        case UPDATE_USER_PROFILE_FAIL:
            return{
                ...state,
            }
        case ITINERARY_GET_SUCCESS:
            return{
                ...state,
                recommendation: payload.recommendation,
                total_budget: payload.budget,
            }
        case ITINERARY_GET_FAIL:
        case RESET_ITINERARY:
            console.log("resetting itinerary")
            return{
                ...state,
                recommendation: [],
                total_budget: 0,
            }

        case SEARCH_SUCCESS:
            console.log(payload.destinations)
            return{
                ...state,
                destinations: payload.destinations,
            }
        case SEARCH_FAIL:
            return{
                ...state,
                destinations: [],
            }
        case RATE_DESTINATION_SUCCESS:
            return{
                ...state,
            }
        case RATE_DESTINATION_FAIL:
            return{
                ...state,
            }
        case BOOKMARK_SUCCESS:
            return{
                ...state,
            }
        case BOOKMARK_FAIL:
            return{
                ...state,
            }
        default:
            return state;
    }
}

