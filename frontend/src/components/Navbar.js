// import React, {Fragment} from "react";
// //import link from "react-router-dom";
// import { Link, NavLink} from "react-router-dom";
// import {connect} from "react-redux";
// import {logout} from "../actions/auth";

// function Navbar({isAuthenticated, logout}) {

//     const GuestLinks = (
//             <Fragment>
//                 <li className="nav-item">
//                     <NavLink className="nav-link" exact to="/login">Login</NavLink>
//                 </li>
//                 <li className="nav-item">
//                     <NavLink className="nav-link" exact to="/signup">Signup</NavLink>
//                 </li>
//             </Fragment>
//         )

//     const AuthLinks = (
//         <Fragment>
//             <li className="nav-item">
//                 <NavLink className="nav-link" exact to="/update_profile">Profile</NavLink>
//             </li>
//             <li className="nav-item">
//                 <NavLink className="nav-link" exact to="/logout" onClick={logout}>Logout</NavLink>
//             </li>
//         </Fragment>
//     )

//     return (
//         <nav className="navbar navbar-expand-lg bg-body-tertiary">
//         <div className="container-fluid">
//             <Link className="navbar-brand" exact to="/explore">Explore</Link>
//             <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
//             <span className="navbar-toggler-icon"></span>
//             </button>
//             <div className="collapse navbar-collapse" id="navbarNav">
//             <ul className="navbar-nav">
//                 <li className="nav-item">
//                 <NavLink className="nav-link"  exact to="/">Home</NavLink>
//                 </li>
//             </ul>
//             <ul className="navbar-nav ms-auto">
//                  {isAuthenticated? AuthLinks : GuestLinks}
//             </ul>
//             </div>
//         </div>
//         </nav>
//     );
// }

// const mapStateToProps = state => ({
//     isAuthenticated: state.auth.isAuthenticated
// })

// export default connect(mapStateToProps, {logout})(Navbar);



import React, {Fragment} from "react";
//import link from "react-router-dom";
import { Link, NavLink} from "react-router-dom";
import {connect} from "react-redux";
import {logout} from "../actions/auth";

function Navbar({isAuthenticated, logout}) {

    const GuestLinks = (
            <Fragment>
                <li className="nav-item">
                    <NavLink className="nav-link" exact to="/login">Login</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink className="nav-link" exact to="/signup">Signup</NavLink>
                </li>
                
            </Fragment>
        )

    const AuthLinks = (
        <Fragment>
            <li className="nav-item">
                <NavLink className="nav-link" exact to="/profile">Profile</NavLink>
            </li>
            <li className="nav-item">
                <NavLink className="nav-link" exact to="/logout" onClick={logout}>Logout</NavLink>
            </li>
        </Fragment>
    )

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
            <Link className="navbar-brand" exact to="/explore">Explore</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
                <li className="nav-item">
                <NavLink className="nav-link"  exact to="/">Home</NavLink>
                </li>
                <li className="nav-item">
                <Link className="nav-link" exact to="/ItineraryPlanner">Itinerary Planner</Link>
                </li>
            </ul>
            <ul className="navbar-nav ms-auto">
                {isAuthenticated ? AuthLinks : GuestLinks}
            </ul>
            </div>
        </div>
        </nav>
    );
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, {logout})(Navbar);