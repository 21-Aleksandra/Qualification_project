import React, { useEffect, useContext, useState } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../../index";
import NewsList from "../../components/Sections/NewsSections/NewsList/NewsList";
import Pagination from "../../components/Common/Pagination/Pagination";
import EditComponent from "../../components/Sections/EditComponent/EditComponent";
import { Spinner, Alert } from "react-bootstrap";
import { getEventNews, getSubsidiaryNews, deleteNews } from "../../api/NewsAPI";
import UserRoles from "../../utils/roleConsts";
import {
  EVENT_NEWS_ADD_ROUTE,
  SUBSIDIARY_NEWS_ADD_ROUTE,
  EVENT_NEWS_EDIT_ROUTE,
  SUBSIDIARY_NEWS_EDIT_ROUTE,
} from "../../utils/routerConsts";
import NewsFilter from "../../components/Sections/NewsSections/NewsFilter/NewsFilter";
import "./NewsPage.css";

const NewsPage = observer(() => {
  const { news, user } = useContext(Context);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [filter, setFilter] = useState("event");

  const userId = user._id;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);

        let params = {};
        if (user.roles.includes(UserRoles.MANAGER)) {
          params = {
            userId,
            userRoles: user.roles.join(","),
          };
        }

        let response;
        if (filter === "event") {
          response = await getEventNews(params);
        } else {
          response = await getSubsidiaryNews(params);
        }

        news.setNews(response || []);
      } catch (err) {
        console.error("Failed to fetch news:", err);
        setError("Failed to load news. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [filter, userId, user.roles, news]);

  const handleCheckboxChange = (id, isChecked) => {
    console.log("Before:", selectedIds);
    setSelectedIds((prev) =>
      isChecked ? [...prev, id] : prev.filter((selectedId) => selectedId !== id)
    );
    console.log("After:", selectedIds);
  };

  const handleUnselectAll = () => {
    setSelectedIds([]);
  };

  const handleDelete = async (ids) => {
    try {
      console.log("Deleting IDs:", ids);
      await deleteNews(ids);
      const params = { userId, userRoles: user.roles.join(",") };
      let response;
      if (filter === "event") {
        response = await getEventNews(params);
      } else {
        response = await getSubsidiaryNews(params);
      }
      news.setNews(response || []);
      setSelectedIds([]);
    } catch (err) {
      console.error("Failed to delete news:", err);
      alert("Error deleting news.");
    }
  };

  if (loading) {
    return (
      <div id="news-loading" className="text-center my-5">
        <Spinner animation="border" />
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert id="news-error" variant="danger" className="my-5 text-center">
        {error}
      </Alert>
    );
  }

  const selectedItems = news.news.filter((newsItem) =>
    selectedIds.includes(newsItem.id)
  );

  const addRoute =
    filter === "event" ? EVENT_NEWS_ADD_ROUTE : SUBSIDIARY_NEWS_ADD_ROUTE;
  const editRoute =
    filter === "event" ? EVENT_NEWS_EDIT_ROUTE : SUBSIDIARY_NEWS_EDIT_ROUTE;

  return (
    <div className="container mt-3">
      <h2 className="mb-3">News</h2>
      <div className="news-page-wrapper">
        <div className="news-list-container">
          {news.news.length === 0 ? (
            <div className="no-news-message">No news found</div>
          ) : (
            <NewsList
              selectedNews={selectedIds}
              onCheckboxChange={handleCheckboxChange}
            />
          )}
        </div>

        <div className="edit-filter-box-news">
          {user.roles.includes(UserRoles.MANAGER) && (
            <div className="edit-panel-container">
              <EditComponent
                addPath={addRoute}
                editPath={editRoute}
                deleteApiRequest={handleDelete}
                selectedIds={selectedIds}
                selectedItems={selectedItems}
                onUnselectAll={handleUnselectAll}
              />
            </div>
          )}
          <div className="filter-panel-container">
            <NewsFilter setFilter={setFilter} filter={filter} />
          </div>
        </div>
      </div>

      <Pagination store={news} />
    </div>
  );
});

export default NewsPage;
