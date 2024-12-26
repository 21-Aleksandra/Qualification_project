import React from "react";
import { useNavigate } from "react-router-dom";
import {
  HELPER_TABLE_ADDRESS_ROUTE,
  HELPER_TABLE_EVENTTYPE_ROUTE,
  HELPER_TABLE_MISSION_ROUTE,
  HELPER_TABLE_ORGANIZATION_ROUTE,
} from "../../utils/routerConsts";
import "./HelperTableSelectPage.css";

//A page for navigationg to lists with object edits - address, mission, main organization and event type
// Needed for that naviagation to data editing if manager suddenly makes mistake
const HelperTableSelectPage = () => {
  const navigate = useNavigate();

  const handleNavigate = (route) => {
    navigate(route);
  };

  return (
    <div className="helper-table-select-page">
      <h2>Select Table to Edit</h2>
      <div className="helper-table-options-vertical">
        <div
          className="helper-table-card"
          onClick={() => handleNavigate(HELPER_TABLE_ADDRESS_ROUTE)}
        >
          Address
        </div>
        <div
          className="helper-table-card"
          onClick={() => handleNavigate(HELPER_TABLE_MISSION_ROUTE)}
        >
          Mission
        </div>
        <div
          className="helper-table-card"
          onClick={() => handleNavigate(HELPER_TABLE_ORGANIZATION_ROUTE)}
        >
          Main Organization
        </div>
        <div
          className="helper-table-card"
          onClick={() => handleNavigate(HELPER_TABLE_EVENTTYPE_ROUTE)}
        >
          Event Type
        </div>
      </div>
    </div>
  );
};

export default HelperTableSelectPage;
