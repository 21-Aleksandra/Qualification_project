import React from "react";
import { Form } from "react-bootstrap";

// DateInputForm is a functional component to handle datetime input fields
const DateInputForm = ({ label, name, value, onChange, required }) => (
  <Form.Group controlId={name}>
    <Form.Label>{label}</Form.Label>
    <Form.Control
      type="datetime-local"
      name={name}
      value={value}
      onChange={onChange}
      required={required} // If true, the field is marked as required for submission
    />
  </Form.Group>
);

export default DateInputForm;
