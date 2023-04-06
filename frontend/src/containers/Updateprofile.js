import React, { useState, useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { Card, Form, Button } from "react-bootstrap";
import CSRFToken from "../components/CSRFToken";
import { updateUserProfile } from "../actions/profile";
import { deleteUser } from "../actions/auth";

const Updateprofile = ({
  deleteUser,
  updateUserProfile,
  first_name_global,
  last_name_global,
  email_global,
}) => {
  const [profileUpdated, setProfileUpdated] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });
  const [profile_picture, setProfilePicture] = useState(null);

  const { first_name, last_name, email } = formData;

  useEffect(() => {
    setFormData({
      first_name: first_name_global,
      last_name: last_name_global,
      email: email_global,
    });
  }, [first_name_global]);

  const dispatch = useDispatch();

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onProfilePictureChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const profileData = new FormData();
    profileData.append("first_name", first_name);
    profileData.append("last_name", last_name);
    profileData.append("email", email);
    profileData.append("profile_picture", profile_picture);
    updateUserProfile(profileData)
    console.log(profileData)
    // console.log("Hello: ", first_name)
    
    setProfileUpdated(true);
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-5">
      <Card style={{ width: "400px" }}>
        <Card.Body>
          <h1 className="text-center mb-4">Update Profile</h1>
          <Form onSubmit={onSubmit}>
            <CSRFToken />
            <Form.Group controlId="formBasicFirstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder={`${first_name_global}`}
                name="first_name"
                value={first_name}
                onChange={onChange}
                style={{ marginBottom: "10px" }}
              />
            </Form.Group>

            <Form.Group controlId="formBasicLastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder={`${last_name_global}`}
                name="last_name"
                value={last_name}
                onChange={onChange}
                style={{ marginBottom: "10px" }}
              />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder={`${email_global}`}
                name="email"
                value={email}
                onChange={onChange}
                style={{ marginBottom: "10px" }}
              />
            </Form.Group>

            <Form.Group controlId="formBasicProfilePicture">
              <Form.Label>Profile Picture</Form.Label>
              <Form.Control
                type="file"
                name="profile_picture"
                accept="image/png, image/jpeg image/jpg"
                onChange={onProfilePictureChange}
                style={{ marginBottom: "10px" }}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Save
            </Button>
            {profileUpdated && (
              <p className="text-success mt-2">Profile Updated Successfully</p>
            )}
          </Form>
          <hr />
          <Button variant="danger" onClick={() => deleteUser()}>
            Delete Account
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
};

const mapStateToProps = (state) => ({
  first_name_global: state.profile.first_name,
  last_name_global: state.profile.last_name,
  email_global: state.profile.email
});

export default connect(mapStateToProps, { deleteUser, updateUserProfile })(
  Updateprofile
);
