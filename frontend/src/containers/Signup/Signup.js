import React, { useState } from "react";
import { register } from "../../actions/auth";
import { connect } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { Card, Form, Button } from "react-bootstrap";
import './Signup.css'
import CSRFToken from '../../components/CSRFToken';

function Signup({ register, isAuthenticated }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    re_password: "",
  });

  const [accountCreated, setAccountCreated] = useState(false);

  const { username, password, re_password } = formData;
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    if (password !== re_password) {
      console.log("Passwords do not match");
    } else {
      register({ username, password, re_password });
      setAccountCreated(true);
    }
  };

  if(isAuthenticated) {
    return <Navigate to="/" />
  }
  
  if (accountCreated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="d-flex justify-content-center align-items-center mt-5">
      <Card style={{ width: "400px" }}>
        <Card.Body>
          <h1 className="text-center mb-4">Signup</h1>
          <Form onSubmit={onSubmit}>
          <CSRFToken />
            <Form.Group controlId="formBasicUsername">
              <Form.Label>Username*</Form.Label>
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
              <Form.Label>Password*</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                value={password}
                onChange={onChange}
                required
                minLength= '6'
                maxLength= '40'
                style={{ marginBottom: "10px" }}
              />
            </Form.Group>

            <Form.Group controlId="formBasicConfirmPassword">
              <Form.Label>Confirm Password*</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                name="re_password"
                value={re_password}
                onChange={onChange}
                minLength= '6'
                maxLength= '40'
                required
                style={{ marginBottom: "10px" }}
              />
            </Form.Group>

            <Button variant="primary" type="submit" block style={{marginBottom: "10px"}}>
              Sign up
            </Button>
          </Form>
          <div className="mt-2 ">
            Already have an account? <Link to="/login" className="no_underline">Login here</Link>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});


export default connect(mapStateToProps, { register })(Signup);



