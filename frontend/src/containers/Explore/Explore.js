import React, { useState, useEffect } from "react";
import { connect, useSelector } from "react-redux";
import {
  Card,
  Col,
  Container,
  Form,
  Row,
  Button,
  Modal,
} from "react-bootstrap";
import { search, rateDestination, bookmark} from "../../actions/profile";
import "./Explore.css";
import Rating from "react-rating-stars-component";
import StarRating from "../TravelForm/StarRating";
import { BookmarkFill, Bookmark } from "react-bootstrap-icons";
import { BsSearch } from "react-icons/bs";
import BookmarkForm from "./Bookmark";
import { Navigate } from "react-router-dom";

// const pictures = require('../public/pictures');

function Explore({ search, rateDestination, bookmark, isAuthenticated }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [ratings, setRatings] = useState([]);
  const [searched, setSearched] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  // const [bookmarked, setBookmarked] = useState(
  //   Array.from(Array(100), () => false)
  // );

  const [bookmarked, setBookmarked] = useState([]);

  const destinations = useSelector((state) => state.profile.destinations);

  const handleSearch = async (e) => {
    e.preventDefault();
    console.log(searchTerm);
    await search(searchTerm);
    setSearched(true);
  };

  // const [bookmarked, setBookmarked] = useState(
  //   destinations.map(destination => destination.isbookmarked)
  // );

  const [showDetails, setShowDetails] = useState(null);

  const handleRatingChange = (index, value) => {
    setRatings((prevRatings) => {
      const newRatings = [...prevRatings];
      newRatings[index] = value;
      return newRatings;
    });
  };

  const handleRatingSubmit = async (e, title, rating) => {
    e.preventDefault();
    // const ratingData = [{ title, rating: ratings[index] }];
    try {
      await rateDestination(title, rating);
      console.log("I am at handleRatingSubmit")
      console.log({ title, rating });
      // setSearched(true)
    } catch (error) {
      console.log(error);
    }
  };

  const handleHover = (index, value) => {
    setRatings((prevRatings) => {
      const newRatings = [...prevRatings];
      newRatings[index] = value;
      return newRatings;
    });
  };

  const handleLeave = (index) => {
    setRatings((prevRatings) => {
      const newRatings = [...prevRatings];
      newRatings[index] = 0;
      return newRatings;
    });
  };

  const handleClickBookmark = (e, title, index) => {
    e.preventDefault();
    const newBookmarked = [...bookmarked];
    newBookmarked[index] = !bookmarked[index];
    // console.log("Hello")
    setBookmarked(newBookmarked);
    console.log(newBookmarked[index]);
    if (newBookmarked[index]) {
      bookmark(title, true);
    } else {
      bookmark(title, false);
    }
  };

  const handleCardClick = (index) => {
    setShowDetails(index);
  };

  const handleCloseDetails = () => {
    setShowDetails(null);
  };

  useEffect(() => {
    const newBookmarked = destinations.map(card => card.isBookmarked);
    setBookmarked(newBookmarked);
  }, [destinations, searched]);

  if(isAuthenticated){
    return (
      <Container>
        {!searched ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
              marginTop: "-150px",
            }}
          >
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: "100vh" }}
            >
              <div>
                <Row>
                  <Col className="d-flex justify-content-center">
                    <Form
                      onSubmit={handleSearch}
                      className="d-flex justify-content-center"
                    >
                      <div className="d-flex align-items-center">
                        <Form.Control
                          type="text"
                          placeholder="Search for Destinations"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          style={{
                            height: "60px",
                            width: "1000px",
                            marginRight: "10px",
                          }}
                        />
                        <Button
                          variant="light"
                          type="submit"
                          style={{ height: "60px", minWidth: "40px" }}
                        >
                          <BsSearch />
                        </Button>
                      </div>
                    </Form>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        ) : (
          <Row style={{ marginTop: "25px" }}>
            <Col className="d-flex justify-content-center">
              <Form
                onSubmit={handleSearch}
                className="d-flex justify-content-center"
              >
                <div className="d-flex align-items-center">
                  <Form.Control
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      height: "60px",
                      width: "1000px",
                      marginRight: "10px",
                    }}
                  />
                  <Button
                    variant="light"
                    type="submit"
                    style={{ height: "60px", minWidth: "40px" }}
                  >
                    <BsSearch />
                  </Button>
                </div>
              </Form>
            </Col>
          </Row>
        )}
        <div className="card-row" style={{ marginTop: "25px" }}>
          {searched && destinations && destinations.length > 0 && (
            <div>
              <div className="card-container">
                {destinations.map((card, index) => (
                  <Card key={index}>
                    <Button
                      className="bookmark-btn"
                      onClick={(e) => handleClickBookmark(e, card.title, index)}
                      variant="outline-primary"
                      style={{ position: "absolute", top: 10, right: 10 }}
                    >
                    {/* {console.log(bookmarked[index])} */}
                      {bookmarked[index]? (
                        <BookmarkFill size={20} />
                      ) : (
                        <Bookmark size={20} />
                      )}
                    </Button>
  
                    <Card.Img
                      variant="top"
                      src={require(`./pictures/${card.title
                        .split("")
                        .join("")}.jpg`)}
                      alt={card.title}
                      style={{ height: "275px", width: "385px", marginTop: "43px" }}
                      onClick={() => handleCardClick(index)}
                    />
  
                    <Card.Body>
                      <Card.Title onClick={() => handleCardClick(index)}>
                        {card.title}
                      </Card.Title>
                      {/* <Card.Text>{card.description}</Card.Text> */}
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <StarRating rating={card.rating} />
                        <p style={{ marginLeft: "10px", marginTop: "15px" }}>
                          {card.rating}
                        </p>
                      </div>
                      <Form
                        onSubmit={(e) =>
                          handleRatingSubmit(e, card.title, selectedRating)
                        }
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <Rating
                          count={5}
                          size={24}
                          activeColor="#ffd700"
                          value = {selectedRating}
                          onmouseover={(value) => handleHover(index, value)}
                          onmouseleave={() => handleLeave(index)}
                          onChange={(value) => setSelectedRating(value)}
                          style={{ marginRight: "10px" }}
                        />
                        <Button
                          variant="primary"
                          type="submit"
                          style={{
                            marginTop: "3px",
                            marginLeft: "4px",
                            backgroundColor: "#007bff",
                            color: "#fff",
                            padding: "5px 10px",
                            borderRadius: "20px",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "14px",
                            lineHeight: "1",
                            outline: "none",
                          }}
                        >
                          Rate
                        </Button>
                      </Form>
                      {card.user_rating !== -1 && (
                        <p style={{ marginTop: "10px" }}>
                        You have rated it {card.user_rating} stars
                        </p>
                      )}
                    </Card.Body>
                  </Card>
                ))}
              </div>
              <Modal show={showDetails !== null} onHide={handleCloseDetails}>
                {showDetails !== null && (
                  <>
                    <Modal.Header closeButton>
                      <Modal.Title>{destinations[showDetails].title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <p>{destinations[showDetails].description}</p>
                      <p>{destinations[showDetails].location}</p>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <StarRating rating={destinations[showDetails].rating} />
                        <p style={{ marginLeft: "10px", marginTop: "15px" }}>
                          {destinations[showDetails].rating}
                        </p>
                      </div>
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
          )}
        </div>
      </Container>
    );
  }

  else{
    return <Navigate to = "/login" />
  }
  
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  destinations: state.profile.destinations,
});

export default connect(mapStateToProps, { search, rateDestination, bookmark })(
  Explore
);
