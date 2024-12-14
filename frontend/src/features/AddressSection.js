import React from "react";
import { observer } from "mobx-react-lite";
import { Form } from "react-bootstrap";
import DropdownSelectOneSearch from "../components/Common/DropdownSelectOneSearch/DropdownSelectOneSearch";
import AddNewAddressDropdownElement from "../components/SmallForms/AddNewAddressDropdownElement/AddNewAddressDropdownElement";
import { getAllAddressList, addAddress } from "../api/AddressAPI";

const AddressSection = observer(({ formData, setFormData, address }) => {
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
