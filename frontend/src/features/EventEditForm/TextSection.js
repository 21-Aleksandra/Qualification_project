import React from "react";
import TextInputForm from "../../components/Common/TextInputForm/TextInputForm";

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
