import React from "react";
import TextInputForm from "../../components/Common/TextInputForm/TextInputForm";

// Define the TextSection component. This component renders a section with input fields for 'Name' and 'Description'.
const TextSection = ({ formData, handleChange }) => (
  <>
    <TextInputForm
      label="Name"
      name="name"
      value={formData.name}
      onChange={handleChange}
      required
    />
    <TextInputForm
      label="Description"
      name="description"
      value={formData.description}
      onChange={handleChange}
    />
  </>
);

export default TextSection;
