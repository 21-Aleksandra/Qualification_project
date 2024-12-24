import { observer } from "mobx-react-lite";
import { Table } from "react-bootstrap";

const UserList = observer(({ users, selectedUsers, onCheckboxChange }) => {
  const handleCheckboxChange = (userId) => {
    onCheckboxChange(userId);
  };

  return (
    <div>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>User ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Verified</th>
            <th>Created At</th>
            <th>Roles</th>
            <th>Select</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id}>
              <td>{index + 1}</td>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.isVerified ? "Yes" : "No"}</td>
              <td>{new Date(user.createdAt).toLocaleString()}</td>
              <td>
                {user.Roles.map((role) => (
                  <span key={role.id}>
                    {role.rolename}({role.id})
                  </span>
                )).reduce((prev, curr) => [prev, ", ", curr])}
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user.id)}
                  onChange={() => handleCheckboxChange(user.id)}
                  style={{ transform: "scale(1.5)" }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
});

export default UserList;
