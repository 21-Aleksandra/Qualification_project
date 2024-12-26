import React from "react";
import { observer } from "mobx-react-lite";
import { Form } from "react-bootstrap";
import DropdownSelectOneSearch from "../components/Common/DropdownSelectOneSearch/DropdownSelectOneSearch";
import AddNewAddressDropdownElement from "../components/SmallForms/AddNewAddressDropdownElement/AddNewAddressDropdownElement";
import { getAllAddressList, addAddress } from "../api/AddressAPI";

// Defining the AddressSection component, wrapped in MobX's observer for reactivity.
// e.g. when we add one element the dropdown should re-render
// used both in subsidiary and event forms
const AddressSection = observer(({ formData, setFormData, address }) => {
  // Handler to update the selected address in formData when a user selects an address from the dropdown
  const handleAddressChange = (selectedOption) => {
    setFormData((prevState) => ({
      ...prevState,
      addressId: selectedOption ? selectedOption.value : "",
    }));
  };

  return (
    <>
      <Form.Group controlId="addressId">
        <Form.Label>Address</Form.Label>
        <DropdownSelectOneSearch
          options={address.addresses}
          value={formData.addressId}
          onChange={handleAddressChange}
          placeholder="Select Address"
          labelKey="addressLabel"
          valueKey="id"
        />
      </Form.Group>
      <AddNewAddressDropdownElement
        title="Add New Address"
        addRequest={addAddress}
        LoadRequest={getAllAddressList}
        StoresetMethod={(addresses) => address.setAddresses(addresses)}
      />
    </>
  );
});

export default AddressSection;
