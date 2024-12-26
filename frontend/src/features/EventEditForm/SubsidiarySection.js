import React from "react";
import { observer } from "mobx-react-lite";
import { Form } from "react-bootstrap";
import DropdownSelectOneSearch from "../../components/Common/DropdownSelectOneSearch/DropdownSelectOneSearch";

// Defining the SubsidiaryNameSection component, wrapped in MobX's observer for reactivity.
// e.g. if subsidiary will be added it should re-render
const SubsidiaryNameSection = observer(
  ({ formData, setFormData, subsidiary }) => {
    const handleOrganizationChange = (selectedOption) => {
      // Updates the subsidiaryId in formData when a new subsidiary is selected or resets to empty if no selection.
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
