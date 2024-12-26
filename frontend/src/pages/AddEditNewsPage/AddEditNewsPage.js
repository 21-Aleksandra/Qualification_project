import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Context } from "../../index";
import {
  addEventNews,
  editEventNews,
  getOneEventNews,
} from "../../api/NewsAPI";
import {
  addSubsidiaryNews,
  editSubsidiaryNews,
  getOneSubsidiaryNews,
} from "../../api/NewsAPI";
import { getEventNames } from "../../api/EventAPI";
import { getSubsidiaryNames } from "../../api/SubsidiaryAPI";
import { Form, Alert } from "react-bootstrap";
import CustomButton from "../../components/Common/CustomButton/CustomButton";
import DropdownSelectOneSearch from "../../components/Common/DropdownSelectOneSearch/DropdownSelectOneSearch";
import { Spinner } from "react-bootstrap";
import { NEWS_ROUTE } from "../../utils/routerConsts";
import "./AddEditNewsPage.css";

// A page with dynamic form that allows to add both event and subsidiary news
// Deciced weather the assigment be to event or subsidiary by the link text
// For managers only
const AddEditNewsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(Context);

  // Form state to manage user inputs, with defaults set for both 'add' and 'edit' modes
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    eventId: "",
    subsidiaryId: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [eventNames, setEventNames] = useState([]);
  const [subsidiaryNames, setSubsidiaryNames] = useState([]);

  let path = window.location.pathname; // for deciding which form to show - subsidiary or event

  useEffect(() => {
    const loadEventNames = async () => {
      try {
        const eventData = await getEventNames();
        setEventNames(eventData);
      } catch (err) {
        setError("Error fetching event names", err);
      }
    };

    const loadSubsidiaryNames = async () => {
      try {
        const subsidiaryData = await getSubsidiaryNames();
        setSubsidiaryNames(subsidiaryData);
      } catch (err) {
        setError("Error fetching subsidiary names", err);
      }
    };

    // Depending on the path, fetch event or subsidiary names to avoid unneccessary data
    if (path.includes("event")) {
      loadEventNames();
    } else if (path.includes("subsidiary")) {
      loadSubsidiaryNames();
    }

    // if id present, loading form data based on path
    if (id) {
      setLoading(true);
      if (path.includes("event")) {
        getOneEventNews(id)
          .then((data) => {
            setFormData({
              title: data.title,
              content: data.content,
              eventId: data.News_Set.Event.id,
            });
            setIsEditing(true);
            setLoading(false);
          })
          .catch((err) => {
            setError(err?.message || "Failed to fetch event news details.");
            setLoading(false);
          });
      } else if (path.includes("subsidiary")) {
        getOneSubsidiaryNews(id)
          .then((data) => {
            setFormData({
              title: data.title,
              content: data.content,
              subsidiaryId: data.News_Set.Subsidiary.id,
            });
            setIsEditing(true);
            setLoading(false);
          })
          .catch((err) => {
            setError(
              err?.message || "Failed to fetch subsidiary news details."
            );
            setLoading(false);
          });
      }
    }
  }, [id, path]); // Dependency array ensures this effect runs when 'id' or 'path' changes

  // submitting based on what current path we have - event or subsidiary
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (path.includes("event")) {
        if (isEditing) {
          await editEventNews(id, formData);
        } else {
          await addEventNews({ ...formData, authorId: user.id });
        }
      } else if (path.includes("subsidiary")) {
        if (isEditing) {
          await editSubsidiaryNews(id, formData);
        } else {
          await addSubsidiaryNews({ ...formData, authorId: user.id });
        }
      }

      navigate(NEWS_ROUTE);
    } catch (err) {
      setError(err?.message || "Failed to submit the form. Please try again.");
      setLoading(false);
    }
  };

  // Generic handler for form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="container mt-3 news-form-container">
      <h2>{isEditing ? `Edit News` : `Add News`}</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" />
          <p>Loading...</p>
        </div>
      ) : (
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="title">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="content">
            <Form.Label>Content</Form.Label>
            <Form.Control
              as="textarea"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={5}
              required
            />
          </Form.Group>

          {path.includes("event") && (
            <Form.Group controlId="eventId">
              <Form.Label>Event</Form.Label>
              <DropdownSelectOneSearch
                options={eventNames}
                value={formData.eventId}
                onChange={(selectedOption) =>
                  setFormData((prevState) => ({
                    ...prevState,
                    eventId: selectedOption ? selectedOption.value : "",
                  }))
                }
                placeholder="Select Event"
                labelKey="name"
                valueKey="id"
              />
            </Form.Group>
          )}

          {path.includes("subsidiary") && (
            <Form.Group controlId="subsidiaryId">
              <Form.Label>Subsidiary</Form.Label>
              <DropdownSelectOneSearch
                options={subsidiaryNames}
                value={formData.subsidiaryId}
                onChange={(selectedOption) =>
                  setFormData((prevState) => ({
                    ...prevState,
                    subsidiaryId: selectedOption ? selectedOption.value : "",
                  }))
                }
                placeholder="Select Subsidiary"
                labelKey="name"
                valueKey="id"
              />
            </Form.Group>
          )}

          <CustomButton
            type="submit"
            disabled={loading}
            className="custom-button-primary"
          >
            {isEditing ? "Update News" : "Add News"}
          </CustomButton>
        </Form>
      )}
    </div>
  );
};

export default AddEditNewsPage;
