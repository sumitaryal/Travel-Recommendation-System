import React, {useState, useEffect} from "react";
import axios from "axios";

const CSRFToken = () => {

    const [csrfToken, setCsrfToken] = useState('');

    

    const getCookie = (name) => {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            let cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                let cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    useEffect(() => {
        const fetchData = async () => {
            try{
                await axios.get(`${process.env.REACT_APP_API_URL}/accounts/csrf-cookie/`)
            }
            catch(err){

            }
        }
        fetchData();
        setCsrfToken(getCookie('csrftoken'));
    }, []);

    return(
        <input type="hidden" name="csrfmiddlewaretoken" value={csrfToken} />
    )
    
}

export default CSRFToken;
