import React from "react";
import TextInputForm from "../../components/Common/TextInputForm/TextInputForm";

const GeneralInfoSection = ({ formData, handleChange }) => (
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
    <TextInputForm
      label="Email"
      name="email"
      value={formData.email}
      onChange={handleChange}
      type="email"
    />
    <TextInputForm
      label="Website"
      name="website"
      value={formData.website}
      onChange={handleChange}
      type="url"
    />
  </>
);

export default GeneralInfoSection;
