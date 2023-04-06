import axios from "axios";
import Cookies from "js-cookie";
import {
    LOAD_USER_PROFILE_SUCCESS,
    LOAD_USER_PROFILE_FAIL,
    UPDATE_USER_PROFILE_SUCCESS,
    UPDATE_USER_PROFILE_FAIL,
    ITINERARY_GET_SUCCESS,
    ITINERARY_GET_FAIL,
    SEARCH_FAIL,
    SEARCH_SUCCESS,
    RATE_DESTINATION_FAIL,
    RATE_DESTINATION_SUCCESS,
    BOOKMARK_SUCCESS,
    BOOKMARK_FAIL,
    RESET_ITINERARY
} from "./types";



// Load user profile
export const loadUserProfile = () => async (dispatch) => {
    console.log("loadUserProfile reached")
    const config = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "multipart/form-data",
            // "X-CSRFToken": Cookies.get("csrftoken"),
        },  
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/profile/user/`, config);
        if (res.data.error) {
            // console.log("Error here at loadUserProfile")
            console.log(res.data.error)
            dispatch({
                type: LOAD_USER_PROFILE_FAIL,
            });
        }
        else{
            console.log(typeof res.data.profile.profile_picture)
            console.log(res.data.profile.first_name)
            console.log(res.data.profile.last_name)
            console.log(res.data.profile.email)
            dispatch({
                type: LOAD_USER_PROFILE_SUCCESS,
                payload: res.data,
            });
        }
    } catch (err) {
        dispatch({
            type: LOAD_USER_PROFILE_FAIL,
        });
    }
};



//updating user profile
export const updateUserProfile = (formData) => async (dispatch) => {
    console.log(formData)
    const config = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "multiport/form-data",
            "X-CSRFToken": Cookies.get("csrftoken"),
        },  
    };

    // console.log(formData)


    try {
        const res = await axios.put(`${process.env.REACT_APP_API_URL}/profile/update/`, formData, config);
        if (res.data.profile && res.data.username) {
            dispatch({
                type: UPDATE_USER_PROFILE_SUCCESS,
                payload: res.data,
            });
        }
        else{
            dispatch({
                type: UPDATE_USER_PROFILE_FAIL,
                // payload: res.data.error
            });
        }
    } catch (err) {
        dispatch({
            type: UPDATE_USER_PROFILE_FAIL,
        });
    }
}




//getting the itinerary
export const getItinerary = (destination, numDays, budget, preference) => async (dispatch) => {
    const config = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-CSRFToken": Cookies.get("csrftoken"),
        },  
    };

    const body = JSON.stringify({
        withCredentials: true,
        destination: destination,
        time: numDays,
        budget: budget,
        preference: preference
    });
    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/recommendation/generate/`,body, config);
        if (res.data.recommendation && res.data.budget) {
            const {recommendation, budget} = res.data
            console.log(recommendation)
            console.log(budget)
            dispatch({
                type: ITINERARY_GET_SUCCESS,
                payload: {recommendation, budget}
            });
        }
        else{
            console.log(res.data.error)
            dispatch({
                type: ITINERARY_GET_FAIL,
                payload: res.data.error
            });
        }
    } catch (err) {
        dispatch({
            type: ITINERARY_GET_FAIL,
        });
    }
}



//searching for a destination
export const search = (searchTerm) => async (dispatch) => {
    const config = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-CSRFToken": Cookies.get("csrftoken"),
        },  
    };

    const body = JSON.stringify({
        // withCredentials: true,
        search: searchTerm,
    });
    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/recommendation/search/`,body, config);
        if (res.data.destinations) {
            const {destinations} = res.data
            console.log(destinations)
            dispatch({
                type: SEARCH_SUCCESS,
                payload: {destinations}
            });
        }
        else{
            console.log(res.data.error)
            dispatch({
                type: SEARCH_FAIL,
                payload: res.data.error
            });
        }
    } catch (err) {
        dispatch({
            type: SEARCH_FAIL,
        });
    }
}




//rate a destination
export const rateDestination = (destination, rating) => async (dispatch) => {
    const config = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-CSRFToken": Cookies.get("csrftoken"),
        },  
    };

    const body = JSON.stringify({
        // withCredentials: true,
        destination: destination,
        rating: rating
    });
    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/recommendation/rateDestination/`,body, config);
        if (res.data.response == "Success") {
            // const {destinations} = res.data
            // console.log(destinations)
            dispatch({
                type: RATE_DESTINATION_SUCCESS,
                // payload: {destinations}
            });
        }
        else{
            // console.log(res.data.error)
            dispatch({
                type: RATE_DESTINATION_FAIL,
                payload: res.data.error
            });
        }
    } catch (err) {
        dispatch({
            type: RATE_DESTINATION_FAIL
        });
    }
}



//store the bookmark to the user database
export const bookmark = (destination, bookmarked) => async (dispatch) => {
    console.log("The actions has indeed been called")
    const config = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-CSRFToken": Cookies.get("csrftoken"),
        },  
    };

    const body = JSON.stringify({
        // withCredentials: true,
        destination: destination,
        bookmarked: bookmarked
    });
    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/recommendation/saveBookmark/`,body, config);
        if (res.data.response == "Success") {
            console.log("Successfully bookmarked")
            dispatch({
                type: BOOKMARK_SUCCESS,
                // payload: {destinations}
            });
        }
        else{
            console.log(res.data.error)
            dispatch({
                type: BOOKMARK_FAIL,
                payload: res.data.error
            });
        }
    } catch (err) {
        dispatch({
            type: BOOKMARK_FAIL
        });
    }
}

// export const getallLocations = async (dispatch) => {
//     const config = {
//         headers: {
//             "Accept": "application/json",
//             "Content-Type": "application/json",
//             "X-CSRFToken": Cookies.get("csrftoken"),
//         },  
//     };

//     try {
//         const res = await axios.get(`${process.env.REACT_APP_API_URL}/recommendation/getAllLocations/`, config);
//         if (res.data.locations) {
//             const {locations} = res.data
//             console.log(locations)
//             dispatch({
//                 type: GET_ALL_LOCATIONS_SUCCESS,
//                 payload: {locations}
//             });
//         }
//         else{
//             console.log(res.data.error)
//             dispatch({
//                 type: GET_ALL_LOCATIONS_FAIL,
//                 payload: res.data.error
//             });
//         }
//     } catch (err) {
//         dispatch({
//             type: GET_ALL_LOCATIONS_FAIL,
//         });
//     }
// }


export const getItineraryByChoosing = (destinations) => async (dispatch) => {
    const config = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-CSRFToken": Cookies.get("csrftoken"),
        },  
    };

    const body = JSON.stringify({
        destinations: destinations
    });
    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/recommendation/generateByChoosing/`,body, config);
        if (res.data.recommendation && res.data.budget) {
            const {recommendation, budget} = res.data
            console.log(recommendation)
            console.log(budget)
            dispatch({
                type: ITINERARY_GET_SUCCESS,
                payload: {recommendation, budget}
            });
        }
        else{
            console.log(res.data.error)
            dispatch({
                type: ITINERARY_GET_FAIL,
                payload: res.data.error
            });
        }
    } catch (err) {
        dispatch({
            type: ITINERARY_GET_FAIL,
        });
    }
}




