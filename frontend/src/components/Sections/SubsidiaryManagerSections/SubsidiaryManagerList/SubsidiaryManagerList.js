import React from "react";
import { Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { MANAGERS_EDIT_ROUTE } from "../../../../utils/routerConsts";

// The SubsidiaryManagerList component displays a table with subsidiaries and managers
// Each row contains edit button to lead to manager edit page
// For data getting and filtering, analready existent subsiary section solution used
const SubsidiaryManagerList = ({ subsidiaries }) => {
  const navigate = useNavigate();

  const formatAddress = (address) => {
    const { street, city, country } = address || {};
    return `${street || "Unknown"}, ${city || "Unknown"}, ${
      country || "Unknown"
    }`;
  };

  const handleEditClick = (subsidiaryId) => {
    navigate(MANAGERS_EDIT_ROUTE.replace(":id", subsidiaryId));
  };

  return (
    <div>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Subsidiary ID</th>
            <th>Subsidiary Name</th>
            <th>Full Address</th>
            <th>Manager(s)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subsidiaries.map((subsidiary, index) => (
            <tr key={subsidiary.id}>
              <td>{index + 1}</td>
              <td>{subsidiary.id}</td>
              <td>{subsidiary.name}</td>
              <td>{formatAddress(subsidiary.Address)}</td>
              <td>
                {subsidiary.Users && subsidiary.Users.length > 0
                  ? subsidiary.Users.map((user) => user.username).join(", ") // for displaying multiple managers
                  : "No Managers"}
              </td>
              <td>
                <button
                  className="btn btn-primary custom-button"
                  onClick={() => handleEditClick(subsidiary.id)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default SubsidiaryManagerList;
