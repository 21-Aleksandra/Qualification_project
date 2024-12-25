import React from "react";
import { Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { HELPER_TABLE_ADDRESS_EDIT_ROUTE } from "../../../../utils/routerConsts";

const AddressHelperTableList = ({ addresses }) => {
  const navigate = useNavigate();

  const handleEditClick = (addressId) => {
    navigate(HELPER_TABLE_ADDRESS_EDIT_ROUTE.replace(":id", addressId));
  };

  return (
    <div>
      <h2>Address List</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>ID</th>
            <th>Country</th>
            <th>City</th>
            <th>Street</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {addresses.map((address, index) => (
            <tr key={address.id}>
              <td>{index + 1}</td>
              <td>{address.id}</td>
              <td>{address.country || "Unknown"}</td>
              <td>{address.city || "Unknown"}</td>
              <td>{address.street || "Unknown"}</td>
              <td>{address.lat !== null ? address.lat : "N/A"}</td>
              <td>{address.lng !== null ? address.lng : "N/A"}</td>
              <td>
                {address.createdAt
                  ? new Date(address.createdAt).toLocaleString()
                  : "N/A"}
              </td>
              <td>
                {address.updatedAt
                  ? new Date(address.updatedAt).toLocaleString()
                  : "N/A"}
              </td>
              <td>
                <button
                  className="btn btn-primary custom-button"
                  onClick={() => handleEditClick(address.id)}
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

export default AddressHelperTableList;
