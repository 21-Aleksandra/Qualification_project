import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spinner, Alert, Card, Container } from "react-bootstrap";
import { getOneEventNews, getOneSubsidiaryNews } from "../../api/NewsAPI";
import { formatDateTime } from "../../utils/dateUtils";
import "./NewsItemPage.css";

const NewsItemPage = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const isEventNews = window.location.pathname.includes("event-news");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const fetchFunc = isEventNews ? getOneEventNews : getOneSubsidiaryNews;
        const data = await fetchFunc(id);
        setNews(data);
      } catch (err) {
        setError(err?.message || "Failed to fetch news data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [id, isEventNews]);

  if (isLoading) {
    return (
      <div id="news-loading" className="text-center my-5">
        <Spinner animation="border" />
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert id="news-error" variant="danger" className="text-center">
        {error}
      </Alert>
    );
  }

  if (!news) {
    return (
      <Alert id="news-not-found" variant="warning" className="text-center">
        News not found.
      </Alert>
    );
  }

  const { title, content, createdAt, updatedAt, News_Set, User } = news;
  const about = isEventNews
    ? News_Set?.Event?.name || "Unknown Event"
    : News_Set?.Subsidiary?.name || "Unknown Subsidiary";

  return (
    <Container id="news-container" className="mt-4">
      <h2 id="news-title" className="mb-4 text-center">
        {title}
      </h2>

      <Card id="news-details" className="mb-4">
        <Card.Body>
          <h5>Details</h5>
          <p>
            <strong>Author:</strong> {User?.username || "Unknown"}
          </p>
          <p>
            <strong>About:</strong> {about}
          </p>
          <p>
            <strong>Published Date:</strong> {formatDateTime(createdAt)}
          </p>
          <p>
            <strong>Last Updated:</strong> {formatDateTime(updatedAt)}
          </p>
        </Card.Body>
      </Card>

      <Card id="news-content">
        <Card.Body>
          <h5>Content</h5>
          <p>{content}</p>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default NewsItemPage;
