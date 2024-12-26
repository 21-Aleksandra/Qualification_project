import { observer } from "mobx-react-lite";
import { Context } from "../../../../index";
import React, { useContext } from "react";
import { Row, Col } from "react-bootstrap";
import NewsListItem from "../NewsListItem/NewsListItem";

// This component creates a list of NewsListItem. The amount of objects per page is defined in store
// Is observable for dynamic store changes (in case of new elemets addition somewhere else and to communicate effectivly with the store)
const NewsList = observer(({ selectedNews, onCheckboxChange }) => {
  const { news } = useContext(Context);
  const currentNews = news.currentNews;

  return (
    <div>
      <Row className="d-flex g-3">
        {currentNews.map(
          (
            newsItem // Loop through each news item in the current list
          ) => (
            <Col key={newsItem.id} xs={12}>
              <NewsListItem
                news={newsItem}
                onCheckboxChange={onCheckboxChange}
                isSelected={selectedNews?.includes(newsItem.id)}
              />
            </Col>
          )
        )}
      </Row>
    </div>
  );
});

export default NewsList;
