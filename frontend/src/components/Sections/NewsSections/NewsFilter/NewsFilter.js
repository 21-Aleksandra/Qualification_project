import React, { useState, useEffect, useContext } from "react";
import { observer } from "mobx-react-lite";
import CustomButton from "../../../Common/CustomButton/CustomButton";
import MultiSelectInput from "../../../Common/MultiSelectInput/MultiSelectInput";
import { Context } from "../../../../index";
import { getSubsidiaryNames } from "../../../../api/SubsidiaryAPI";
import { getEventNames } from "../../../../api/EventAPI";
import { getEventNews } from "../../../../api/NewsAPI";
import { getSubsidiaryNews } from "../../../../api/NewsAPI";
//import "./NewsFilter.css";

const NewsFilter = observer(({ setFilter, filter }) => {
  const { news, event, subsidiary, user } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchList = async () => {
      setLoading(true);
      try {
        const filterParams = {
          userId: user._id,
          userRoles: user._roles.join(","),
        };
        if (filter === "event") {
          const eventResponse = await getEventNames(filterParams);
          event.setNames(eventResponse || []);
        } else if (filter === "subsidiary") {
          const subsidiaryResponse = await getSubsidiaryNames(filterParams);
          subsidiary.setNames(subsidiaryResponse || []);
        }
        console.log(event);
        console.log(subsidiary);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchList();
  }, [filter, event, subsidiary, user._roles, user._id]);

  const handleTitleChange = (e) => {
    news.setFilters({
      ...news.filters,
      title: e.target.value,
    });
  };

  const handleContentChange = (e) => {
    news.setFilters({
      ...news.filters,
      text: e.target.value,
    });
  };

  const handleDateFromChange = (e) => {
    news.setFilters({
      ...news.filters,
      dateFrom: e.target.value,
    });
  };

  const handleDateToChange = (e) => {
    news.setFilters({
      ...news.filters,
      dateTo: e.target.value,
    });
  };

  const applyFilters = async () => {
    const filterParams = {
      title: news.filters.title,
      text: news.filters.text,
      dateFrom: news.filters.dateFrom,
      dateTo: news.filters.dateTo,
      ...(filter === "event"
        ? { eventIds: news.filters.selectedIds.join(",") }
        : { subsidiaryIds: news.filters.selectedIds.join(",") }),
      userId: user.id,
      userRoles: user.roles.join(","),
    };

    try {
      setError("");

      let response;
      if (filter === "event") {
        response = await getEventNews(filterParams);
        news.setNews(response || []);
      } else if (filter === "subsidiary") {
        response = await getSubsidiaryNews(filterParams);
        news.setNews(response || []);
      }

      news.setParams(filterParams);
    } catch (err) {
      setError(err?.message || "No news found with the selected filters.");
    }
  };

  const resetFilters = async () => {
    news.resetFilters();
    const filterParams = {
      userId: user.id,
      userRoles: user.roles.join(","),
    };

    try {
      setError("");

      let response;
      if (filter === "event") {
        response = await getEventNews(filterParams);
        news.setNews(response || []);
      } else if (filter === "subsidiary") {
        response = await getSubsidiaryNews(filterParams);
        news.setNews(response || []);
      }
      news.setParams(null);
    } catch (err) {
      setError(err?.message || "Failed to reset filters. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const eventButtonClass = filter === "event" ? "primary" : "outline-primary";
  const subsidiaryButtonClass =
    filter === "subsidiary" ? "primary" : "outline-primary";

  return (
    <div className="filter-panel">
      <h3>Filter News</h3>
      {error && <div className="error-panel">{error}</div>}
      <div
        className="filter-buttons"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "10px",
          gap: "10px",
        }}
      >
        <CustomButton
          onClick={() => setFilter("event")}
          size="md"
          className={`custom-button-${eventButtonClass}`}
        >
          Event News
        </CustomButton>
        <CustomButton
          onClick={() => setFilter("subsidiary")}
          size="md"
          className={`custom-button-${subsidiaryButtonClass}`}
        >
          Subsidiary News
        </CustomButton>
      </div>

      <div>
        <label>Title</label>
        <input
          type="text"
          value={news.filters.title}
          onChange={handleTitleChange}
          placeholder="Enter title"
        />
      </div>

      <div>
        <label>Content</label>
        <input
          type="text"
          value={news.filters.text}
          onChange={handleContentChange}
          placeholder="Enter content"
        />
      </div>

      <div>
        <label>Date From</label>
        <input
          type="date"
          value={news.filters.dateFrom || ""}
          onChange={handleDateFromChange}
        />
      </div>

      <div>
        <label>Date To</label>
        <input
          type="date"
          value={news.filters.dateTo || ""}
          onChange={handleDateToChange}
        />
      </div>

      {filter === "event" && (
        <MultiSelectInput
          label="Event Names"
          options={event.names.map((event) => ({
            name: event.name,
            id: event.id,
          }))}
          setSearchValue={(value) =>
            news.setFilters({ ...news.filters, searchIds: value })
          }
          searchValue={news.filters.searchIds}
          selectedValues={news.filters.selectedIds}
          setSelectedValues={(value) =>
            news.setFilters({ ...news.filters, selectedIds: value })
          }
        />
      )}

      {filter === "subsidiary" && (
        <MultiSelectInput
          label="Subsidiary Names"
          options={subsidiary.names.map((subsidiary) => ({
            name: subsidiary.name,
            id: subsidiary.id,
          }))}
          setSearchValue={(value) =>
            news.setFilters({ ...news.filters, searchIds: value })
          }
          searchValue={news.filters.searchIds}
          selectedValues={news.filters.selectedIds}
          setSelectedValues={(value) =>
            news.setFilters({ ...news.filters, selectedIds: value })
          }
        />
      )}

      <div className="button-group">
        <CustomButton size="md" onClick={applyFilters}>
          Apply Filters
        </CustomButton>
        <CustomButton size="md" onClick={resetFilters} className="clear-button">
          Clear Filters
        </CustomButton>
      </div>
    </div>
  );
});

export default NewsFilter;
