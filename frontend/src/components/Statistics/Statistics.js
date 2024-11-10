import React from "react";
import "./Statistics.css";
import { Container, Row, Col } from "react-bootstrap";
import CountUp from "react-countup";

const Statistics = ({ caption, text1, text2, text3, num1, num2, num3 }) => {
  return (
    <Container fluid className="statistics-block">
      <div className="stats-caption">{caption}</div>
      <Row className="stats-row">
        <Col className="stats-col">
          <div className="text-label">{text1}</div>
          <div className="number">
            <CountUp end={num1} duration={2.5} />
          </div>
        </Col>
        <Col className="stats-col">
          <div className="text-label">{text2}</div>
          <div className="number">
            <CountUp end={num2} duration={2.5} />
          </div>
        </Col>
        <Col className="stats-col">
          <div className="text-label">{text3}</div>
          <div className="number">
            <CountUp end={num3} duration={2.5} />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Statistics;
