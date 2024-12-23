import React, { useContext, useState, useEffect, useCallback } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../../../index";
import { useLocation } from "react-router-dom";
import UserRoles from "../../../utils/roleConsts";
import "./CommentSection.css";

const CommentSection = observer(({ id, getRequest, addRequest }) => {
  const { comment, user } = useContext(Context);
  const location = useLocation();

  const [text, setText] = useState("");
  const [rating, setRating] = useState(1);
  const [loading, setLoading] = useState(false);

  const determineIdType = () => {
    const path = location.pathname.toLowerCase();
    if (path.includes("events")) return "eventId";
    if (path.includes("news")) return "newsId";
    if (path.includes("subsidiaries")) return "subsidiaryId";
    return null;
  };

  const idType = determineIdType();
  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedComments = await getRequest(id);
      comment.setComments(fetchedComments);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setLoading(false);
    }
  }, [getRequest, id, comment]);

  useEffect(() => {
    fetchComments();
  }, [id, fetchComments]);

  const handleAddComment = async () => {
    if (!text.trim()) {
      alert("Please enter a comment.");
      return;
    }
    if (!idType) {
      alert("Invalid context for adding comments.");
      return;
    }
    try {
      setLoading(true);
      await addRequest({
        [idType]: id,
        text,
        rating,
        userId: user._id,
      });
      setText("");
      setRating(1);
      await fetchComments();
    } catch (error) {
      console.error("Failed to add comment:", error);
      alert("Could not add the comment.");
    } finally {
      setLoading(false);
    }
  };

  const profilePicUrl = (commentUser) =>
    commentUser.User?.Photo?.url
      ? `${process.env.REACT_APP_SERVER_URL}${commentUser.User?.Photo?.url}`
      : require("../../../assets/default_user_small.png");

  return (
    <div className="comment-section">
      {user.roles.includes(UserRoles.REGULAR) && (
        <div className="comment-form">
          <textarea
            className="comment-textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write your comment..."
            rows="4"
          />
          <div className="comment-rating">
            <label>Rating:</label>
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((value) => (
                <span
                  key={value}
                  className={`star ${rating >= value ? "selected" : ""}`}
                  onClick={() => setRating(value)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={handleAddComment}
            disabled={loading}
            className="custom-button"
          >
            Add Comment
          </button>
        </div>
      )}

      {comment.comments.length === 0 && (
        <p className="no-comments">No comments yet. Be the first to comment!</p>
      )}

      <ul className="comment-list">
        {comment.comments.map((commentItem) => (
          <li key={commentItem.id} className="comment-item">
            <div className="comment-header">
              <img
                src={profilePicUrl(commentItem)}
                alt="Profile"
                className="comment-profile-pic"
              />
              <div className="comment-meta">
                <strong className="comment-user">
                  {commentItem.User?.username}
                </strong>
                <div className="comment-rating">
                  Rating:{" "}
                  <span className="rating-stars">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <span
                        key={value}
                        className={`star ${
                          commentItem.rating >= value ? "selected" : ""
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </span>
                </div>
              </div>
            </div>
            <p className="comment-text">{commentItem.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
});

export default CommentSection;
