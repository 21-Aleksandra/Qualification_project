import React, { useEffect, useContext, useState } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../../index";
import SubsidiaryList from "../../components/SubsidiaryList/SubsidiaryList";
import { getSubsidiaryFilteredList } from "../../api/SubsidiaryAPI";
import Pagination from "../../components/Pagination/Pagination";
import FilterPanel from "../../components/SubsidiaryFilter/SubsidiaryFilter";
import UserRoles from "../../utils/roleConsts";
import { Spinner, Alert } from "react-bootstrap";
import "./SubsidiaryPage.css";

const SubsidiaryPage = observer(() => {
  const { subsidiary, user } = useContext(Context);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = user._id;

  useEffect(() => {
    let userRoles = user.roles || [];
    if (!Array.isArray(userRoles)) {
      console.error("user.roles is not an array:", userRoles);
      return;
    }
    userRoles = userRoles
      .map((role) => Number(role))
      .filter((role) => !isNaN(role));

    const fetchSubsidiaries = async () => {
      try {
        setLoading(true);
        setError(null);
        let params = {};
        if (userRoles.includes(UserRoles.MANAGER)) {
          params = {
            userId: userId,
            userRoles: userRoles.join(","),
          };
        }
        const response = await getSubsidiaryFilteredList(params);
        subsidiary.setSubsidiaries(response || []);
      } catch (err) {
        console.error("Failed to fetch subsidiaries:", err);
        setError("Failed to load subsidiaries. Please try again later.");
        subsidiary.setSubsidiaries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubsidiaries();
  }, [subsidiary._currentPage, subsidiary, userId, user.roles]);

  if (loading) {
    return (
      <div id="subsidiary-loading" className="text-center my-5">
        <Spinner animation="border" />
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        id="subsidiary-error"
        variant="danger"
        className="my-5 text-center"
      >
        {error}
      </Alert>
    );
  }

  return (
    <div className="container mt-3">
      <h2 className="mb-3">Subsidiaries</h2>
      <div className="subsidiary-page-wrapper">
        <div className="subsidiary-list-container">
          {subsidiary.subsidiaries.length === 0 ? (
            <div className="no-subsidiaries-message">No subsidiaries found</div>
          ) : (
            <SubsidiaryList />
          )}
        </div>
        <div className="filter-panel-container">
          <FilterPanel />
        </div>
      </div>

      <Pagination store={subsidiary} />
    </div>
  );
});

export default SubsidiaryPage;
