// import React from "react";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import TravelForm from "../TravelForm";
// import { connect } from "react-redux";
// import { Navigate } from "react-router-dom";

// const Home = ({isAuthenticated}) => {
//     if (isAuthenticated) {
//         return <TravelForm />
//     } else {
//         return <Navigate to="/login" />
//     }
// }

// const mapStateToProps = state => ({ 
//     isAuthenticated: state.auth.isAuthenticated
// })

// export default connect(mapStateToProps)(Home);


import React from "react";
import TravelForm from "../TravelForm/TravelForm";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";

const Home = ({isAuthenticated}) => {
    if (isAuthenticated) {
        return <TravelForm />
    }
    else{
        return <Navigate to="/login" />
    }
}
const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps)(Home);
