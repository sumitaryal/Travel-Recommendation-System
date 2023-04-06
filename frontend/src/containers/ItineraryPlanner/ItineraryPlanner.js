import React, { useState, useEffect } from "react";
import { connect, useSelector } from "react-redux";
import {
  Card,
  Col,
  Container,
  Form,
  Row,
  Button,
  Table,
  Modal,
  ListGroup,
} from "react-bootstrap";
import { getItineraryByChoosing } from "../../actions/profile";
import "./ItineraryPlanner.css";
import { Square, CheckSquareFill } from "react-bootstrap-icons";
import StarRating from "../TravelForm/StarRating";
import axios from "axios";
import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";

// const pictures = require('../public/pictures');

function ItineraryPlanner({ getItineraryByChoosing, isAuthenticated }) {
  const [destinations, setDestinations] = useState([]);
  const [generated, setGenerated] = useState(false);

  useEffect(() => {
    // let source = axios.CancelToken.source();

    const fetchData = async () => {
      const config = {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-CSRFToken": Cookies.get("csrftoken"),
        },
        // cancelToken: source.token,
      };

      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/recommendation/getAllLocations/`,
          config
        );
        if (res.data.destinations) {
          setDestinations(res.data.destinations);
        } else {
          console.log(res.data.error);
        }
      } catch (err) {
        // if (!axios.isCancel(err)) {
        console.log(err);
        // }
      }
    };

    fetchData();
  }, []);

  const [checkboxValues, setCheckboxValues] = useState(
    Array(destinations.length).fill(false)
  );

  const [selectedDestinations, setSelectedDestinations] = useState([]);
  const [latestCheckedLocation, setLatestCheckedLocation] = useState("");
  const [retrievedLocations, setRetrievedLocations] = useState([]);

  async function sendAndRetrieveData(title) {
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
    };
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/recommendation/collaborativeFiltering/`,
        { location: title },
        config
      );
      // print(response.data)
      return response.data;
    } catch (error) {
      console.error(error);
      // Handle error
    }
  }

  const handleCheckboxClick = (index, title) => {
    const newCheckboxValues = [...checkboxValues];
    newCheckboxValues[index] = !newCheckboxValues[index];
    setCheckboxValues(newCheckboxValues);

    if (newCheckboxValues[index]) {
      setSelectedDestinations([...selectedDestinations, title]);
      setLatestCheckedLocation(title);
    } else {
      setSelectedDestinations(
        selectedDestinations.filter((dest) => dest !== title)
      );
    }
  };

  const handleCheckboxSubmit = async (e) => {
    e.preventDefault();
    await getItineraryByChoosing(selectedDestinations);
    setGenerated(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (latestCheckedLocation) {
        console.log(latestCheckedLocation);
        const retrievedData = await sendAndRetrieveData(latestCheckedLocation);
        setRetrievedLocations(retrievedData);
        // console.log(retrievedData);
      }
    };
    fetchData();
    // setRetrievedLocations(retrievedLo)
  }, [latestCheckedLocation]);
  const [showDetails, setShowDetails] = useState(null);

  const handleCardClick = (index) => {
    setShowDetails(index);
  };

  const handleCloseDetails = () => {
    setShowDetails(null);
  };

  useEffect(() => {
    setRetrievedLocations(retrievedLocations);
  }, [retrievedLocations]);

  //for travel plan generation
  const recommendation = useSelector((state) => state.profile.recommendation);
  const budget = useSelector((state) => state.profile.total_budget);

  function handleClick() {
    window.location.reload();
  }

  if (isAuthenticated) {
    return (
      <Container>
        <div className="plan-header">
          <h2>Select your destinations to Generate plan below</h2>
          <p>Note: The generate button is at the bottom of the page</p>
          <p>It might take some time to generate recommendations</p>
        </div>
        <div className="card-row" style={{ marginTop: "25px" }}>
          <div>
            <div>
              {retrievedLocations.recommendation &&
              retrievedLocations.recommendation.length > 0 &&
              destinations &&
              destinations.length > 0 ? (
                <div>
                  <div style={{ flex: 1 }}>
                    {/* <h2>You may Also like</h2> */}
                    {retrievedLocations.recommendation &&
                      retrievedLocations.recommendation.length > 0 &&
                      destinations &&
                      destinations.length > 0 && (
                        <Card>
                          <Card.Header
                            style={{ fontSize: "24px", fontWeight: "bold" }}
                          >
                            You may also like
                          </Card.Header>
                          <ListGroup variant="flush">
                            {retrievedLocations.recommendation.map(
                              (location, index) => (
                                <ListGroup.Item key={index}>
                                  {location.title}
                                </ListGroup.Item>
                              )
                            )}
                          </ListGroup>
                        </Card>
                      )}
                  </div>
                  <div style={{ flex: 2 }}>
                    <Form onSubmit={handleCheckboxSubmit}>
                      <Form.Group controlId="formBasicCheckbox">
                        <div className="card-container">
                          {destinations.map((card, index) => (
                            <Card key={index}>
                              <Button
                                className={`checkbox-btn ${
                                  checkboxValues[index] ? "checked" : ""
                                }`}
                                onClick={(e) =>
                                  handleCheckboxClick(index, card.title)
                                }
                                variant="outline-primary"
                                style={{
                                  position: "absolute",
                                  top: 10,
                                  right: 10,
                                }}
                              >
                                {checkboxValues[index] ? (
                                  <CheckSquareFill size={20} />
                                ) : (
                                  <Square size={20} />
                                )}
                              </Button>

                              <Card.Img
                                variant="top"
                                src={require(`../Explore/pictures/${card.title
                                  .split("")
                                  .join("")}.jpg`)}
                                alt={card.title}
                                style={{
                                  height: "275px",
                                  width: "385px",
                                  marginTop: "43px",
                                }}
                                onClick={() => handleCardClick(index)}
                              />
                              <Card.Body>
                                <Card.Title>{card.title}</Card.Title>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <StarRating rating={card.rating} />
                                  <p
                                    style={{
                                      marginLeft: "10px",
                                      marginTop: "15px",
                                    }}
                                  >
                                    {card.rating}
                                  </p>
                                </div>
                              </Card.Body>
                            </Card>
                          ))}
                        </div>
                        <div className="d-flex justify-content-center">
                          <Button
                            variant="primary"
                            type="submit"
                            style={{ marginTop: "25px" }}
                          >
                            <i className="bi bi-search">
                              Generate Itinerary by selecting locations above
                            </i>
                          </Button>
                        </div>
                      </Form.Group>
                    </Form>
                  </div>
                </div>
              ) : (
                destinations &&
                destinations.length > 0 && (
                  <div>
                    <Form onSubmit={handleCheckboxSubmit}>
                      <Form.Group controlId="formBasicCheckbox">
                        <div className="card-container">
                          {destinations.map((card, index) => (
                            <Card key={index}>
                              <Button
                                className={`checkbox-btn ${
                                  checkboxValues[index] ? "checked" : ""
                                }`}
                                onClick={(e) =>
                                  handleCheckboxClick(index, card.title)
                                }
                                variant="outline-primary"
                                style={{
                                  position: "absolute",
                                  top: 10,
                                  right: 10,
                                }}
                              >
                                {checkboxValues[index] ? (
                                  <CheckSquareFill size={20} />
                                ) : (
                                  <Square size={20} />
                                )}
                              </Button>
                              {/* </Form> */}

                              <Card.Img
                                variant="top"
                                src={require(`../Explore/pictures/${card.title
                                  .split("")
                                  .join("")}.jpg`)}
                                alt={card.title}
                                // style={{ height: "300px", width: "400px" }}
                                style={{
                                  height: "275px",
                                  width: "385px",
                                  marginTop: "43px",
                                }}
                                onClick={() => handleCardClick(index)}
                              />
                              <Card.Body>
                                <Card.Title>{card.title}</Card.Title>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <StarRating rating={card.rating} />
                                  <p
                                    style={{
                                      marginLeft: "10px",
                                      marginTop: "15px",
                                    }}
                                  >
                                    {card.rating}
                                  </p>
                                </div>
                              </Card.Body>
                            </Card>
                          ))}
                        </div>
                        <Modal
                          show={showDetails !== null}
                          onHide={handleCloseDetails}
                        >
                          {showDetails !== null && (
                            <>
                              <Modal.Header closeButton>
                                <Modal.Title>
                                  {destinations[showDetails].title}
                                </Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                <p>{destinations[showDetails].description}</p>
                                <p>{destinations[showDetails].location}</p>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <StarRating
                                    rating={destinations[showDetails].rating}
                                  />
                                  <p
                                    style={{
                                      marginLeft: "10px",
                                      marginTop: "15px",
                                    }}
                                  >
                                    {destinations[showDetails].rating}
                                  </p>
                                </div>
                              </Modal.Body>
                              <Modal.Footer>
                                <Button
                                  variant="secondary"
                                  onClick={handleCloseDetails}
                                >
                                  Close
                                </Button>
                              </Modal.Footer>
                            </>
                          )}
                        </Modal>
                        <div className="d-flex justify-content-center">
                          <Button
                            variant="primary"
                            type="submit"
                            style={{ marginTop: "25px", marginBottom: "25px" }}
                          >
                            <i className="bi bi-search">
                              Generate Itinerary by selecting locations above
                            </i>
                          </Button>
                        </div>
                      </Form.Group>
                    </Form>
                  </div>
                )
              )}
            </div>
          </div>

          {generated &&
            recommendation &&
            budget &&
            recommendation.length > 0 && (
              <div>
                <div className="d=flex justify-content-center align-items-center mt-5">
                  <Card>
                    <Card.Header
                      style={{ fontSize: "30px", fontFamily: "Inter" }}
                    >
                      Your Possible Plan
                    </Card.Header>
                    <Card.Body>
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>Title</th>
                            <th>Budget</th>
                            <th>Time Taken</th>
                            <th>Attributes</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recommendation.map((recommendationItem, index) => (
                            <tr key={index}>
                              <td>{recommendationItem.title}</td>
                              <td>{recommendationItem.costs}</td>
                              <td>{recommendationItem.time_taken}</td>
                              <td>{recommendationItem.activity}</td>
                            </tr>
                          ))}
                          <tr>
                            <td colSpan="4" className="text-center">
                              <strong>Total Budget: {budget}</strong>
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <button
                    className="btn btn-primary"
                    onClick={handleClick}
                    style={{ margin: "0 auto", padding: "10px 20px" }}
                  >
                    Edit Itinerary
                  </button>
                </div>
              </div>
            )}
        </div>
      </Container>
    );
  } else {
    return <Navigate to="/login" />;
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  recommendation: state.profile.recommendation,
  budget: state.profile.total_budget,
});

export default connect(mapStateToProps, { getItineraryByChoosing })(
  ItineraryPlanner
);
