import React, { useState } from "react";
import { sendEmailRequest } from "../../../../api/ProfileAPI";
import CustomButton from "../../../Common/CustomButton/CustomButton";
import { Context } from "../../../../index";
import "./ProfileRequestForm.css";

const ProfileRequestForm = () => {
  const { user } = React.useContext(Context);
  const [request, setRequest] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!request) {
      setErrorMessage("Request cannot be empty.");
      return;
    }

    setIsSubmitting(true);
    try {
      await sendEmailRequest(user.id, request);
      alert("Your request has been sent to the admin.");
      setRequest("");
    } catch (error) {
      alert("Error submitting request: " + error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="profile-request-form">
      <div className="form-frame">
        <h2>Important Request</h2>
        <div className="warning-text">
          <p>
            <strong>Important:</strong> This form is for submitting critical
            requests to the admin, such as bug reports or account issues. Please
            use it responsibly.
          </p>
          <p>
            <strong>Warning:</strong> Spamming or misuse of this form may result
            in a ban.
          </p>
        </div>
        <textarea
          value={request}
          onChange={(e) => setRequest(e.target.value)}
          placeholder="Describe your request here (e.g., bug report, important issue, etc.)"
          rows="6"
          className="request-textarea"
        />
      </div>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <div className="form-controls">
        <div className="button-group">
          <CustomButton
            onClick={handleSubmit}
            disabled={isSubmitting || !request}
            size="md"
            className="submit-button"
          >
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default ProfileRequestForm;
