import React from "react";
import { Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { HELPER_TABLE_MISSION_EDIT_ROUTE } from "../../../../utils/routerConsts";

// The MissionHelperTableList component displays a table with mission data
// Each row contains edit button to lead to mission edit page
const MissionHelperTableList = ({ missions }) => {
  const navigate = useNavigate();
  const handleEditClick = (missionId) => {
    navigate(HELPER_TABLE_MISSION_EDIT_ROUTE.replace(":id", missionId));
  };

  return (
    <div>
      <h2>Missions List</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>ID</th>
            <th>Mission Name</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {missions.map((mission, index) => (
            <tr key={mission.id}>
              <td>{index + 1}</td>
              <td>{mission.id}</td>
              <td>{mission.name}</td>
              <td>
                {mission.createdAt
                  ? new Date(mission.createdAt).toLocaleString()
                  : "N/A"}
              </td>
              <td>
                {mission.updatedAt
                  ? new Date(mission.updatedAt).toLocaleString()
                  : "N/A"}
              </td>
              <td>
                <button
                  className="btn btn-primary custom-button"
                  onClick={() => handleEditClick(mission.id)}
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

export default MissionHelperTableList;
