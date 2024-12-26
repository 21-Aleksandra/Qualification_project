import React from "react";
import TextInputForm from "../../components/Common/TextInputForm/TextInputForm";

// Define the GeneralInfoSection component. This component renders a section with input fields for 'Name' and 'Description'
// as well as 'Email' and 'Website'.
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
