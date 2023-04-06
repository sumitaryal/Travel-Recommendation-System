import React, {useEffect, Fragment} from "react";
import Navbar from "../components/Navbar";
import {connect } from "react-redux";
import { checkAuthenticated } from "../actions/auth";
import { loadUserProfile } from "../actions/profile";

const Layout = ({checkAuthenticated, children, loadUserProfile}) => {
    useEffect(() => {
        checkAuthenticated();
        loadUserProfile();
    }, [checkAuthenticated]);

    return (
        <Fragment>
            <Navbar />
            {children}
        </Fragment>
    );
};

export default connect(null, {checkAuthenticated, loadUserProfile})(Layout);