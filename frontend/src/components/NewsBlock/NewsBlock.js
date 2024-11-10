import React from "react";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./NewsBlock.css";

const NewsBlock = ({ newsItems }) => {
  const navigate = useNavigate();

  const handleClick = (id) => {
    navigate(`/news/${id}`);
  };

  return (
    <Card className="news-block">
      <Card.Body>
        <Card.Title>News</Card.Title>
        <div className="news-item-container">
          {newsItems.map((news, index) => (
            <div
              key={index}
              onClick={() => handleClick(news.id)}
              className="news-item"
            >
              <strong>{news.title}</strong>
              <p>{news.text.substring(0, 50)}...</p>
            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};

export default NewsBlock;
