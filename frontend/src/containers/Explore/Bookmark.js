import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { Bookmark, BookmarkFill } from "react-bootstrap-icons";
// import { bookmark } from "../../actions/profile";
import {bookmark} from '../../actions/profile';
import {connect } from 'react-redux';


function BookmarkForm({ card, index, bookmark }) {

  const [isBookmarked, setIsBookmarked] = useState(card.isBookmarked);

  const handleBookmarkClick =  () => {
    setIsBookmarked(!isBookmarked);
    const updatedCard = { ...card, isBookmarked: isBookmarked };
    console.log("handleBookmarkClick reached.")
     bookmark(updatedCard.title, updatedCard.isBookmarked, () => {
        // Callback function to check if the server has been successfully updated
        console.log("Bookmark action completed.");
      });
  };

  const handleSubmit = (e) => {
    console.log("handleSubmit reached")
    e.preventDefault();
    handleBookmarkClick();
  };

  return (
    <Form onSubmit={handleSubmit} style={{ marginBottom: "43px" }}>
      <Button
        className="bookmark-btn"
        type="submit"
        variant="outline-primary"
        style={{ position: "absolute", top: 10, right: 10 }}
      >
        {isBookmarked ? <BookmarkFill size={20} /> : <Bookmark size={20} />}
      </Button>
    </Form>
  );
}

export default connect (null, {bookmark})(BookmarkForm);
