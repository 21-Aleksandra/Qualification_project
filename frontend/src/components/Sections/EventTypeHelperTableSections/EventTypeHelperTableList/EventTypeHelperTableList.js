import React from "react";
import { Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { HELPER_TABLE_EVENTTYPE_EDIT_ROUTE } from "../../../../utils/routerConsts";

const EventTypeHelperTableList = ({ eventTypes }) => {
  const navigate = useNavigate();

  const handleEditClick = (eventTypeId) => {
    navigate(HELPER_TABLE_EVENTTYPE_EDIT_ROUTE.replace(":id", eventTypeId));
  };

  return (
    <div>
      <h2>Event Types List</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>ID</th>
            <th>Event Name</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {eventTypes.map((eventType, index) => (
            <tr key={eventType.id}>
              <td>{index + 1}</td>
              <td>{eventType.id}</td>
              <td>{eventType.name}</td>
              <td>
                {eventType.createdAt
                  ? new Date(eventType.createdAt).toLocaleString()
                  : "N/A"}
              </td>
              <td>
                {eventType.updatedAt
                  ? new Date(eventType.updatedAt).toLocaleString()
                  : "N/A"}
              </td>
              <td>
                <button
                  className="custom-button"
                  onClick={() => handleEditClick(eventType.id)}
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

export default EventTypeHelperTableList;
