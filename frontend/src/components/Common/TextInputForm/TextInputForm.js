import { Form } from "react-bootstrap";

// TextInputForm component receives various props to handle form input fields
// It provides a reusable input form element with label, value, and validation options.
const TextInputForm = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  required,
}) => (
  <Form.Group controlId={name}>
    <Form.Label>{label}</Form.Label>
    <Form.Control
      type={type} // Sets the input type (e.g., text, password, email)
      name={name}
      value={value}
      onChange={onChange}
      required={required}
    />
  </Form.Group>
);

export default TextInputForm;
