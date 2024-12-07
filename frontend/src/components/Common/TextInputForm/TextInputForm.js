import { Form } from "react-bootstrap";

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
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
    />
  </Form.Group>
);

export default TextInputForm;
