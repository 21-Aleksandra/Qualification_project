import React from "react";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./NewsBlock.css";

// Simple component with scrollable news block. Typicaly recieves top-5 newest news to display
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
          {newsItems.map(
            (
              news,
              index // creating div for each news
            ) => (
              <div
                key={index}
                onClick={() => handleClick(news.id)}
                className="news-item"
              >
                <strong>{news.title}</strong>
                <p>{news.text.substring(0, 50)}...</p>
                <small>Author: {news.author}</small>
              </div>
            )
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default NewsBlock;
