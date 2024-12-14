import React from "react";
import { observer } from "mobx-react-lite";
import { Form } from "react-bootstrap";
import DropdownSelectOneSearch from "../../components/Common/DropdownSelectOneSearch/DropdownSelectOneSearch";
import AddOneFieldDropdownElement from "../../components/SmallForms/AddOneFieldDropdownElement/AddOneFieldDropdownElement";
import { getEventTypeList, addEventType } from "../../api/EventTypeAPI";

const EventTypeSection = observer(({ formData, setFormData, eventType }) => {
  const handleEventTypeChange = (selectedOption) => {
    setFormData((prevState) => ({
      ...prevState,
      typeId: selectedOption ? selectedOption.value : "",
    }));
  };

  return (
    <>
      <Form.Group controlId="typeId">
        <Form.Label>EventType</Form.Label>
        <DropdownSelectOneSearch
          options={eventType.event_types}
          value={formData.typeId}
          onChange={handleEventTypeChange}
          placeholder="Select event type"
          labelKey="name"
          valueKey="id"
        />
      </Form.Group>
      <AddOneFieldDropdownElement
        label="Add new event type"
        fieldType="text"
        updateStore={(types) => eventType.setEventTypes(types)}
        apiAddRequest={addEventType}
        apiReloadRequest={getEventTypeList}
      />
    </>
  );
});

export default EventTypeSection;
