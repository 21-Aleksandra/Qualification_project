import React, { useEffect, useState, useContext } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../../index";
import { Spinner, Alert } from "react-bootstrap";
import { getAllComments, deleteComments } from "../../api/CommentAPI";
import CommentAdminList from "../../components/Sections/CommentAdminListSection/CommentAdminList/CommentAdminList";
import EditComponent from "../../components/Sections/EditComponent/EditComponent";
import CommentAdminFilter from "../../components/Sections/CommentAdminListSection/CommentAdminFilter/CommentAdminFilter";
import "./CommentAdminPage.css";

// A page with list of all comments, checkboxes and delete selected functionality
// Ensures inappropritae comment management for admin. Allows filtering comments by author and text
const CommentAdminPage = observer(() => {
  const { comment } = useContext(Context);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  // Fetch all comments when the component mounts or comment state changes
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getAllComments();
        comment.setComments(response || []);
      } catch (err) {
        console.error("Failed to fetch comments:", err);
        setError("Failed to load comments. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [comment]); // The effect runs when the 'comment' context changes

  const handleCheckboxChange = (id) => {
    setSelectedIds(
      (prev) =>
        prev.includes(id)
          ? prev.filter((selectedId) => selectedId !== id) // Unselect the comment if it is already selected
          : [...prev, id] // Select the comment if it is not already selected
    );
  };

  const handleUnselectAll = () => {
    setSelectedIds([]);
  };

  const handleDelete = async (ids) => {
    try {
      await deleteComments(ids);
      const response = await getAllComments();
      comment.setComments(response || []);
      setSelectedIds([]);
    } catch (err) {
      console.error(err?.message || "Failed to delete comments:");
      alert("Error deleting comments.");
    }
  };

  if (loading) {
    return (
      <div id="comment-loading" className="text-center my-5">
        <Spinner animation="border" />
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert id="comment-error" variant="danger" className="my-5 text-center">
        {error}
      </Alert>
    );
  }

  const selectedItems = comment.comments.filter((commentItem) =>
    selectedIds.includes(commentItem.id)
  );

  return (
    <div className="container mt-3">
      <h2 className="mb-3">Comments</h2>
      <div className="comment-page-wrapper">
        <div className="comment-list-container">
          {comment.comments.length === 0 ? (
            <div className="no-comments-message">No comments found</div>
          ) : (
            <CommentAdminList
              comments={comment.comments}
              selectedComments={selectedIds}
              onCheckboxChange={handleCheckboxChange}
            />
          )}
        </div>
        <div class="comment-additional-components">
          <div className="edit-filter-box">
            <div className="edit-panel-container">
              <EditComponent
                deleteApiRequest={handleDelete}
                selectedIds={selectedIds}
                selectedItems={selectedItems}
                onUnselectAll={handleUnselectAll}
                hideAddEdit={true}
              />
            </div>
          </div>
          <div class="filter-panel-container">
            <CommentAdminFilter />
          </div>
        </div>
      </div>
    </div>
  );
});

export default CommentAdminPage;
