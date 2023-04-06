import React, { useEffect, useState } from "react";
import { connect, useSelector, useDispatch } from "react-redux";
import { loadUserProfile } from "../../actions/profile";
import { Image, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
// import { connect, useSelector } from "react-redux";
import { Card, Table } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
// import Updateprofile from "./Updateprofile";

const Profile = ({ loadUserProfile }) => {
  const first_name = useSelector((state) => state.profile.first_name);
  const last_name = useSelector((state) => state.profile.last_name);
  const email = useSelector((state) => state.profile.email);
  const profile_picture = useSelector((state) => state.profile.profilePicture);
  const recommendation_table = useSelector(
    (state) => state.profile.recommendation_table
  );
  const bookmark_list = useSelector((state) => state.profile.bookmark_list);
  return (
    <Container>
      <Row className="justify-content-md-center mt-3">
        <Card>
          <Row>
            <Col xs={4} className="text-center">
              {console.log(profile_picture)}
              <img
                src={require("./default.jpeg")}
                alt="Default Profile Picture"
                roundedCircle
                fluid
              />
            </Col>
            <Col xs={8}>
              <Card.Body>
                <Card.Title>{`${first_name} ${last_name}`}</Card.Title>
                <Card.Text>{email}</Card.Text>
              </Card.Body>
            </Col>
          </Row>
        </Card>
      </Row>
      <div style={{ textAlign: "center" }}>
        <Link exact to="/update_profile">
          <button className="btn btn-primary">Update Profile</button>
        </Link>
      </div>
      <div>
        <h1>Your Bookmarked Locations</h1>
        <div className="d-flex justify-content-center align-items-center mt-5 flex-wrap">
          {bookmark_list.map((bookmark, index) => {
            const destination = bookmark || "";
            const imagePath = require(`../../assets/pictures/${destination}.jpg`);

            return (
              <div
                className="d-inline-block"
                key={index}
                style={{ width: "calc(100% / 3)", padding: "10px" }}
              >
                <Card>
                  <Card.Img
                    variant="top"
                    src={imagePath}
                    alt={destination}
                    style={{
                      height: "250px",
                      width: "100%",
                      aspectRatio: "3/4",
                    }}
                  />
                  <Card.Body>
                    <Card.Title>{destination}</Card.Title>
                  </Card.Body>
                </Card>
              </div>
            );
          })}
        </div>
        <h1>Your Generated Plans</h1>
        {recommendation_table.map((recommendation, index1) => (
          <div className="d=flex justify-content-center align-items-center mt-5">
            <Card>
              {/* <Card.Header style={{ fontSize: '30px', fontFamily: 'Inter' }}>Your Possible Plan</Card.Header> */}
              <Card.Body>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Time Taken</th>
                      <th>Title</th>
                      <th>Budget</th>

                      <th>Activities</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recommendation.destination.map(
                      (recommendationItem, index) => (
                        <tr key={index}>
                          <td>{recommendationItem.time_taken}</td>
                          <td>{recommendationItem.title}</td>
                          <td>{recommendationItem.costs}</td>
                          <td>{recommendationItem.activity}</td>
                        </tr>
                      )
                    )}
                    <tr>
                      <td colSpan="4" className="text-center">
                        <strong>
                          Total Budget: {recommendation.total_budget}
                        </strong>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </Container>
  );
};

const mapStateToProps = (state) => ({
  first_name: state.profile.first_name,
  last_name: state.profile.last_name,
  email: state.profile.email,
  profile_picture: state.profile.profilePicture,
  recommendation_table: state.profile.recommendation_table,
  bookmark_list: state.profile.bookmark_list,
});

export default connect(mapStateToProps)(Profile);
