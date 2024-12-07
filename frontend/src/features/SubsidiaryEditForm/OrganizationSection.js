import React from "react";
import { observer } from "mobx-react-lite";
import { Form } from "react-bootstrap";
import DropdownSelectOneSearch from "../../components/Common/DropdownSelectOneSearch/DropdownSelectOneSearch";
import AddOneFieldDropdownElement from "../../components/SmallForms/AddOneFieldDropdownElement/AddOneFieldDropdownElement";
import {
  getMainOrganizationList,
  addMainOrganization,
} from "../../api/MainOrganizationAPI";

const OrganizationSection = observer(
  ({ formData, setFormData, mainOrganization }) => {
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
