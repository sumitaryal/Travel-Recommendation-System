import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './hocs/Layout'
import Home from './containers/Home/Home';
import Login from './containers/Login';
import Signup from './containers/Signup/Signup';
import Updateprofile from './containers/Updateprofile';
//import Provider from './hocs/Provider';
import { Provider } from 'react-redux';
import store from './store';
import PrivateRoute from './hocs/privateRoute';
import TravelForm from './containers/TravelForm/TravelForm';
import Explore from './containers/Explore/Explore';
import Profile from './containers/Profile/Profile'
import ItineraryPlanner from './containers/ItineraryPlanner/ItineraryPlanner';


function App() {
  return (
    <Provider store={store}>
      <Router>
        <Layout>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/explore" element={<Explore />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/signup" element={<Signup />} />
            {/* <PrivateRoute exact path="/profile" element ={<Profile />} /> */}
            <Route exact path="/update_profile" element={<Updateprofile />} />
            <Route exact path="/travelform" element={<TravelForm />} />
            <Route exact path="/profile" element={<Profile />} />
            <Route exact path="/ItineraryPlanner" element={<ItineraryPlanner />} />
          </Routes>
        </Layout>
      </Router>
    </Provider>

  );
}

export default App;
