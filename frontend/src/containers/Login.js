import React, { useState } from "react";
import { connect } from "react-redux";
// import { login } from actions/auth";
import {login} from "../actions/auth";
import { Link, Navigate } from "react-router-dom";
import { Card, Form, Button } from "react-bootstrap";
// import './Login.css';
// import CSRFToken from '../../components/CSRFToken';
import CSRFToken from '../components/CSRFToken';

function Login({ login, isAuthenticated }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

//   const [loginFailed, setLoginFailed] = useState(false);
  const { username, password } = formData;


  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    };

const onSubmit = (e) => {
    e.preventDefault();
    const data = {
      username,
      password,
    };
    login(data);
    // setLoginFailed(true);
  };
  

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="d-flex justify-content-center align-items-center mt-5">
      <Card style={{ width: "400px" }}>
        <Card.Body>
          <h1 className="text-center mb-4">Login</h1>
          <Form onSubmit={onSubmit}>
          <CSRFToken />
            <Form.Group controlId="formBasicUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                name="username"
                value={username}
                onChange={onChange}
                required
                style={{ marginBottom: "10px" }}
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                value={password}
                onChange={onChange}
                required
                style={{ marginBottom: "10px" }}
              />
            </Form.Group>

            <Button variant="primary" type="submit" block style={{marginBottom: "10px"}}>
              Login
            </Button>
          </Form>
          <div className="mt-2">
            Don't have an account? <Link to="/signup" className="no_underline">Signup here</Link>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});



export default connect(mapStateToProps, { login })(Login);
