import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import MultiSelectInput from "../../components/Common/MultiSelectInput/MultiSelectInput";
import AddOneFieldDropdownElement from "../../components/SmallForms/AddOneFieldDropdownElement/AddOneFieldDropdownElement";
import { getMissionList, addMission } from "../../api/MissionAPI";

const MissionSection = observer(({ formData, setFormData, missionStore }) => {
  const [searchValue, setSearchValue] = useState("");

  const handleMissionChange = (selectedMissions) => {
    setFormData((prevState) => ({
      ...prevState,
      missions: selectedMissions,
    }));
  };

  return (
    <>
      <MultiSelectInput
        label="Missions"
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        options={missionStore.missions}
        selectedValues={formData.missions}
        setSelectedValues={handleMissionChange}
      />
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
