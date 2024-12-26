import React from "react";
import DateInputForm from "../../components/Common/DateInputForm/DateInputForm";

const formatDateForInput = (isoDate) => {
  if (!isoDate) return "";
  const localDate = new Date(isoDate);

  // Get the timezone offset of the user's local machine in minutes (e.g., for UTC+1, it would return -60).
  const offset = localDate.getTimezoneOffset();

  // Adjust the local date by subtracting the timezone offset (to convert from UTC to local time).
  // This is important as input[type="datetime-local"] doesn't work well with time zone offsets.
  const adjustedDate = new Date(localDate.getTime() - offset * 60000);

  return adjustedDate.toISOString().slice(0, 16);
};

// Functional component that renders the section containing multiple date input fields.
const DatesSection = ({ formData, handleDateChange }) => (
  <>
    <DateInputForm
      label="Start Date"
      name="dateFrom"
      value={formatDateForInput(formData.dateFrom)}
      onChange={handleDateChange}
    />
    <DateInputForm
      label="End Date"
      name="dateTo"
      value={formatDateForInput(formData.dateTo)}
      onChange={handleDateChange}
    />
    <DateInputForm
      label="Publish On"
      name="publishOn"
      value={formatDateForInput(formData.publishOn)}
      onChange={handleDateChange}
    />
    <DateInputForm
      label="Application Deadline"
      name="applicationDeadline"
      value={formatDateForInput(formData.applicationDeadline)}
      onChange={handleDateChange}
    />
  </>
);

export default DatesSection;
