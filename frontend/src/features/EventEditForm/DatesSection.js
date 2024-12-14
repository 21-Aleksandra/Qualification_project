import React from "react";
import DateInputForm from "../../components/Common/DateInputForm/DateInputForm";

const formatDateForInput = (isoDate) => {
  if (!isoDate) return "";
  const localDate = new Date(isoDate);
  const offset = localDate.getTimezoneOffset();
  const adjustedDate = new Date(localDate.getTime() - offset * 60000);
  return adjustedDate.toISOString().slice(0, 16);
};

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
