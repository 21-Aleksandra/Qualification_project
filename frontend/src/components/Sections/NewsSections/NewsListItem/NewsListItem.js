import React, { useContext } from "react";
import { Card, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Context } from "../../../../index";
import "./NewsListItem.css";
import {
  SUBSIDIARY_NEWS_ITEM_ROUTE,
  EVENT_NEWS_ITEM_ROUTE,
} from "../../../../utils/routerConsts";
import UserRoles from "../../../../utils/roleConsts";

// A single element of news list contraining name of the news , content, dates, the object news is about
// For managers there is a checbox for selecting item for deletion/editing
// Can be both about event and subsidiary
const NewsListItem = ({ news, onCheckboxChange, isSelected }) => {
  const navigate = useNavigate();
  const { user } = useContext(Context);
  const isManager = user.roles.includes(UserRoles.MANAGER);
  const generatePath = (route, params) => {
    let path = route;
    Object.keys(params).forEach((key) => {
      path = path.replace(`:${key}`, params[key]);
    });
    return path;
  };

  // Decomponizing response for easyer management

  // Shorten the news content since t can be way larger
  const trimmedContent =
    news.content.length > 50 ? `${news.content.slice(0, 50)}...` : news.content;
  const event = news.News_Set?.Event;
  const subsidiary_item = news.News_Set?.Subsidiary;
  const author = news.User?.username;
  const publishedAt = new Date(news.createdAt).toLocaleDateString(); // formattion date to human-readable format
  const about = event
    ? event.name
    : subsidiary_item?.name || "No related information";

  // Function to handle card clicks and navigate to the appropriate news item details page
  const handleCardClick = () => {
    event
      ? navigate(generatePath(EVENT_NEWS_ITEM_ROUTE, { id: news.id }))
      : navigate(generatePath(SUBSIDIARY_NEWS_ITEM_ROUTE, { id: news.id }));
  };

  return (
    <Card className="news-card shadow-sm">
      <Card.Body className="news-card-body">
        <div className="news-card-section">
          <Card.Title
            className="news-card-title text-truncate"
            onClick={handleCardClick}
          >
            {news.title || "No title available"}
          </Card.Title>
        </div>

        <div className="news-card-section" onClick={handleCardClick}>
          <Card.Text className="news-card-content text-muted">
            {trimmedContent}
          </Card.Text>
        </div>

        <div className="news-card-section" onClick={handleCardClick}>
          <Card.Text className="text-muted">
            Author: <strong>{author || "Unknown"}</strong>
          </Card.Text>
        </div>

        <div className="news-card-section" onClick={handleCardClick}>
          <Card.Text className="text-muted">
            Published at: <strong>{publishedAt}</strong>
          </Card.Text>
        </div>

        <div className="news-card-section" onClick={handleCardClick}>
          <Card.Text className="text-muted">
            About: <strong>{about}</strong>
          </Card.Text>
        </div>

        {isManager && (
          <div className="news-card-checkbox">
            <Form.Check
              type="checkbox"
              className="mt-3"
              checked={isSelected}
              onChange={(e) => onCheckboxChange(news.id, e.target.checked)}
            />
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default NewsListItem;
