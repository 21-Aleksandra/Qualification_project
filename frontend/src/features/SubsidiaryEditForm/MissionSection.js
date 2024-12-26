import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import MultiSelectInput from "../../components/Common/MultiSelectInput/MultiSelectInput";
import AddOneFieldDropdownElement from "../../components/SmallForms/AddOneFieldDropdownElement/AddOneFieldDropdownElement";
import { getMissionList, addMission } from "../../api/MissionAPI";

// MissionSection Wrapped with MobX observer to react to state changes in missionStore
// e.g. when we add one element the dropdown should re-render
const MissionSection = observer(({ formData, setFormData, missionStore }) => {
  const [searchValue, setSearchValue] = useState("");

  // Handler function that updates the `missions` field in formData when missions are selected
  const handleMissionChange = (selectedMissions) => {
    setFormData((prevState) => ({
      ...prevState,
      missions: selectedMissions,
    }));
  };

  return (
    <>
      {/* MultiSelectInput component allows the user to select multiple missions */}
      <MultiSelectInput
        label="Missions"
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        options={missionStore.missions}
        selectedValues={formData.missions}
        setSelectedValues={handleMissionChange}
      />
      {/* AddOneFieldDropdownElement allows users to add a new mission */}
      <AddOneFieldDropdownElement
        label="Add new mission"
        fieldType="text"
        updateStore={(missions) => missionStore.setMissions(missions)}
        apiAddRequest={addMission}
        apiReloadRequest={getMissionList}
      />
    </>
  );
});

export default MissionSection;
