import { observer } from "mobx-react-lite";
import { Context } from "../../../../index";
import React, { useContext } from "react";
import { Row, Col } from "react-bootstrap";
import NewsListItem from "../NewsListItem/NewsListItem";

const NewsList = observer(({ selectedNews, onCheckboxChange }) => {
  const { news } = useContext(Context);
  const currentNews = news.currentNews;

  return (
    <div>
      <Row className="d-flex g-3">
        {currentNews.map((newsItem) => (
          <Col key={newsItem.id} xs={12}>
            <NewsListItem
              news={newsItem}
              onCheckboxChange={onCheckboxChange}
              isSelected={selectedNews?.includes(newsItem.id)}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
});

export default NewsList;
