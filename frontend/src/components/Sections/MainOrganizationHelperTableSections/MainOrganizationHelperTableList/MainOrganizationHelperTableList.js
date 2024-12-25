import React from "react";
import { Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { HELPER_TABLE_ORGANIZATION_EDIT_ROUTE } from "../../../../utils/routerConsts";

const MainOrganizationHelperTableList = ({ organizations }) => {
  const navigate = useNavigate();

  const handleEditClick = (organizationId) => {
    navigate(
      HELPER_TABLE_ORGANIZATION_EDIT_ROUTE.replace(":id", organizationId)
    );
  };

  return (
    <div>
      <h2>Main Organizations List</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>ID</th>
            <th>Name</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {organizations.map((organization, index) => (
            <tr key={organization.id}>
              <td>{index + 1}</td>
              <td>{organization.id}</td>
              <td>{organization.name}</td>
              <td>
                {organization.createdAt
                  ? new Date(organization.createdAt).toLocaleString()
                  : "N/A"}
              </td>
              <td>
                {organization.updatedAt
                  ? new Date(organization.updatedAt).toLocaleString()
                  : "N/A"}
              </td>
              <td>
                <button
                  className="btn btn-primary custom-button"
                  onClick={() => handleEditClick(organization.id)}
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

export default MainOrganizationHelperTableList;
