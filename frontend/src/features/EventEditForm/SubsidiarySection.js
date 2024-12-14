import React from "react";
import { observer } from "mobx-react-lite";
import { Form } from "react-bootstrap";
import DropdownSelectOneSearch from "../../components/Common/DropdownSelectOneSearch/DropdownSelectOneSearch";

const SubsidiaryNameSection = observer(
  ({ formData, setFormData, subsidiary }) => {
    const handleOrganizationChange = (selectedOption) => {
      setFormData((prevState) => ({
        ...prevState,
        subsidiaryId: selectedOption ? selectedOption.value : "",
      }));
    };

    return (
      <>
        <Form.Group controlId="subsidiaryId">
          <Form.Label>Subsidiaries</Form.Label>
          <DropdownSelectOneSearch
            options={subsidiary.names}
            value={formData.subsidiaryId}
            onChange={handleOrganizationChange}
            placeholder="Select subsidiary"
            labelKey="name"
            valueKey="id"
          />
        </Form.Group>
      </>
    );
  }
);

export default SubsidiaryNameSection;
