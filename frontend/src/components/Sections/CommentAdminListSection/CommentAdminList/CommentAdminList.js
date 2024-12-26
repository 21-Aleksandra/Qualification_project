import { observer } from "mobx-react-lite";
import { Table } from "react-bootstrap";

// The CommentAdminList component displays a table with comment data
// Each row contains checkbox for selectiong ids for further requests
const CommentAdminList = observer(
  ({ comments, selectedComments, onCheckboxChange }) => {
    const handleCheckboxChange = (commentId) => {
      onCheckboxChange(commentId);
    };

    return (
      <div>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Comment ID</th>
              <th>User ID</th>
              <th>User Name</th>
              <th>Comment Text</th>
              <th>Published</th>
              <th>Select</th>
            </tr>
          </thead>
          <tbody>
            {comments.map((commentItem, index) => (
              <tr key={commentItem.id}>
                <td>{index + 1}</td>
                <td>{commentItem.id}</td>
                <td>{commentItem.User?.id}</td>
                <td>{commentItem.User?.username}</td>
                <td>{commentItem.text}</td>
                <td>{commentItem.createdAt}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedComments.includes(commentItem.id)}
                    onChange={() => handleCheckboxChange(commentItem.id)}
                    style={{ transform: "scale(1.5)" }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  }
);

export default CommentAdminList;
