import React, { useState, useEffect } from "react";
import { Card, Form, Button, Table, Modal } from "react-bootstrap";
import { connect, useSelector } from "react-redux";
import { getItinerary } from "../../actions/profile";
import CSRFToken from "../../components/CSRFToken";
import StarRating from "./StarRating";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as fasStar } from "@fortawesome/free-solid-svg-icons";
import Rating from "react-rating-stars-component";
import "./TravelForm.css";

const TravelForm = ({ getItinerary }) => {
  const [formData, setFormData] = useState({
    destination: "",
    timeOfTravel: "",
    budget: "",
    preferences: [],
  });

  // const history = useHistory();

  const recommendation = useSelector((state) => state.profile.recommendation);
  const total_budget = useSelector((state) => state.profile.total_budget);
  const [showDetails, setShowDetails] = useState(null);

  const [submitted, setSubmitted] = useState(false);
  const [edited, setEdited] = useState(false);
  const [ratingInput, setRatingInput] = useState(0);

  const { destination, timeOfTravel, budget, preferences } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleStarClick = (index) => {
    setRatingInput(index + 1);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    await getItinerary(destination, timeOfTravel, budget, preferences);
    setSubmitted(true);
  };

  const onChangePreferences = (e) => {
    if (e.target.checked) {
      setFormData({
        ...formData,
        preferences: [...preferences, e.target.value],
      });
    } else {
      setFormData({
        ...formData,
        preferences: preferences.filter(
          (preference) => preference !== e.target.value
        ),
      });
    }
  };

  // const onEdit = () => {
  //   setEdited(true);
  // };

  const handleSubmit_rating = (e) => {
    e.preventDefault();
    console.log(ratingInput);
  };

  const handleCardClick = (index) => {
    setShowDetails(index);
  };

  const handleCloseDetails = () => {
    setShowDetails(null);
  };

  function handleClick() {
    window.location.reload();
  }

  return (
    <div className="mt-5">
      {!submitted && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Card style={{ height: "auto" }}>
            <Card.Header style={{ fontSize: "30px", fontFamily: "Inter" }}>
              Plan Your trip here
            </Card.Header>
            <Card.Body>
              <Form onSubmit={onSubmit}>
                <CSRFToken />
                <Form.Group controlId="destination">
                  <Form.Label>Destination*</Form.Label>
                  <Form.Control
                    type="text"
                    name="destination"
                    placeholder="Enter your destination"
                    value={destination}
                    onChange={onChange}
                    onKeyDown={(e) => {
                      if (e.key === "Tab") {
                        e.target.setAttribute("list", "");
                      } else {
                        e.target.setAttribute("list", "destination-list");
                      }
                    }}
                    onBlur={(e) => {
                      const validOption = document
                        .getElementById("destination-list")
                        .querySelector(`option[value="${e.target.value}"]`);
                      if (!validOption) {
                        e.target.value = "";
                        alert("No such location");
                      }
                    }}
                    style={{ marginBottom: "10px" }}
                    required={true}
                  />
                  <datalist id="destination-list">
                    <option value="Kathmandu" />
                    <option value="Pokhara" />
                    <option value="Chitwan" />
                  </datalist>
                </Form.Group>
                <Form.Group controlId="timeOfTravel">
                  <Form.Label>Estimated Time of Travel (in days)*</Form.Label>
                  <Form.Control
                    type="number"
                    name="timeOfTravel"
                    value={timeOfTravel}
                    onChange={onChange}
                    placeholder="Enter your time of travel"
                    style={{ marginBottom: "10px" }}
                    required={true}
                  />
                </Form.Group>

                <Form.Group controlId="budget">
                  <Form.Label>Estimated Budget (in Nrs.)*</Form.Label>
                  <Form.Control
                    type="number"
                    name="budget"
                    placeholder="Enter your budget"
                    value={budget}
                    onChange={onChange}
                    style={{ marginBottom: "10px" }}
                    required={true}
                    step={1000}
                  />
                  <div>
                    <p>Note:</p>
                    <ul style={{ color: "#777" }}>
                      <li>Enter your budget in Nepali Rupees.</li>
                      <li>This is budget per person.</li>
                      <li>Estimation should be around Rs. 7000 per day.</li>
                    </ul>
                  </div>
                </Form.Group>

                <Form.Group controlId="preferences">
                  <Form.Label>Preferences (Select one or more)*</Form.Label>
                  <Form.Check
                    type="checkbox"
                    name="preferences"
                    label="Cultural"
                    value="Cultural"
                    style={{ marginBottom: "10px" }}
                    onChange={(e) => onChangePreferences(e)}
                  />
                  <Form.Check
                    type="checkbox"
                    name="preferences"
                    label="Natural"
                    value="Natural"
                    onChange={(e) => onChangePreferences(e)}
                  />
                  <Form.Check
                    type="checkbox"
                    name="preferences"
                    label="Adventure"
                    value="Adventure"
                    onChange={(e) => onChangePreferences(e)}
                  />
                  <Form.Check
                    type="checkbox"
                    name="preferences"
                    label="Historical"
                    value="Historical"
                    onChange={(e) => onChangePreferences(e)}
                  />
                  <Form.Check
                    type="checkbox"
                    name="preferences"
                    label="Trekking"
                    value="Trekking"
                    onChange={(e) => onChangePreferences(e)}
                  />
                </Form.Group>
                <Button
                  variant="primary"
                  type="submit"
                  style={{ marginTop: "10px", marginBottom: "10px" }}
                >
                  Generate Plan
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </div>
      )}

      {submitted && recommendation && budget && recommendation.length > 0 && (
        <div>
          <div className="d=flex justify-content-center align-items-center mt-5">
            <Card style={{ height: "auto" }}>
              <div style={{ textAlign: "center" }}>
                <Card.Header style={{ fontSize: "30px", fontFamily: "Inter" }}>
                  Your Possible Plan
                </Card.Header>
              </div>
              <Card.Body style={{ height: "auto" }}>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Day</th>
                      <th>Title</th>
                      <th>Budget</th>
                      <th>Attributes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recommendation.map((recommendationItem, index) => (
                      <tr key={index}>
                        <td>{recommendationItem.time_taken}</td>
                        <td>{recommendationItem.title}</td>
                        <td>{recommendationItem.costs}</td>
                        <td>{recommendationItem.activity}</td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan="4" className="text-center">
                        <strong>Total Budget: {total_budget}</strong>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </div>
          <div className="card-row" style={{ marginTop: "5px" }}>
            <div
              className="card-container"
              style={{ marginLeft: "200px", marginRight: "200px" }}
            >
              {recommendation.map((plan, index) => (
                <Card key={index} onClick={() => handleCardClick(index)}>
                  <Card.Img
                    variant="top"
                    src={require(`../../assets/pictures/${plan.title
                      .split("")
                      .join("")}.jpg`)}
                    alt={plan.title}
                    style={{
                      height: "250px",
                      width: "495px",
                      aspectRatio: "3/4",
                    }}
                  />
                  <Card.Body>
                    <Card.Title>{plan.title}</Card.Title>
                  </Card.Body>
                </Card>
              ))}
            </div>
            <Modal show={showDetails !== null} onHide={handleCloseDetails}>
              {showDetails !== null && (
                <>
                  <Modal.Header closeButton>
                    <Modal.Title>
                      {recommendation[showDetails].title}
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <p>{recommendation[showDetails].description}</p>
                    <p>{recommendation[showDetails].location}</p>
                    <StarRating rating={recommendation[showDetails].rating} />
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDetails}>
                      Close
                    </Button>
                  </Modal.Footer>
                </>
              )}
            </Modal>
          </div>
          {/* button to edit itinerary */}
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
  );
};

export default connect(null, { getItinerary })(TravelForm);
