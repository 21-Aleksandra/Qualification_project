import React from "react";
import { observer } from "mobx-react-lite";
import { Form } from "react-bootstrap";
import DropdownSelectOneSearch from "../../components/Common/DropdownSelectOneSearch/DropdownSelectOneSearch";
import AddOneFieldDropdownElement from "../../components/SmallForms/AddOneFieldDropdownElement/AddOneFieldDropdownElement";
import {
  getMainOrganizationList,
  addMainOrganization,
} from "../../api/MainOrganizationAPI";

// OrganizationSection component, wrapped in MobX's observer to ensure it reacts to store updates
// e.g. when we add one element the dropdown should re-render
const OrganizationSection = observer(
  ({ formData, setFormData, mainOrganization }) => {
    // Handler for updating the mainOrganizationId field in the formData when a new organization is selected
    const handleOrganizationChange = (selectedOption) => {
      setFormData((prevState) => ({
        ...prevState,
        mainOrganizationId: selectedOption ? selectedOption.value : "",
      }));
    };

    return (
      <>
        <Form.Group controlId="mainOrganizationId">
          <Form.Label>Main Organization</Form.Label>
          <DropdownSelectOneSearch
            options={mainOrganization.organizations}
            value={formData.mainOrganizationId}
            onChange={handleOrganizationChange}
            placeholder="Select Organization"
            labelKey="name"
            valueKey="id"
          />
        </Form.Group>
        {/* Component for adding a new organization to the list */}
        <AddOneFieldDropdownElement
          label="Add new main organization"
          fieldType="text"
          updateStore={(organizations) =>
            mainOrganization.setOrganizations(organizations)
          }
          apiAddRequest={addMainOrganization}
          apiReloadRequest={getMainOrganizationList}
        />
      </>
    );
  }
);

export default OrganizationSection;
