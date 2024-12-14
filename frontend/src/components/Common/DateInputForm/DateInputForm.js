import React from "react";
import { Form } from "react-bootstrap";

const DateInputForm = ({ label, name, value, onChange, required }) => (
  <Form.Group controlId={name}>
    <Form.Label>{label}</Form.Label>
    <Form.Control
      type="datetime-local"
      name={name}
      value={value}
      onChange={onChange}
      required={required}
    />
  </Form.Group>
);

export default DateInputForm;
