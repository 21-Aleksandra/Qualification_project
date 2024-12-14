import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import { runInAction } from "mobx";
import CustomButton from "../../Common/CustomButton/CustomButton";

const AddOneFieldDropdownElement = observer(
  ({ label, fieldType, updateStore, apiAddRequest, apiReloadRequest }) => {
    const [showModal, setShowModal] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    function getResponseDataElement(response) {
      if (response && typeof response === "object") {
        const keys = Object.keys(response);
        if (Array.isArray(response)) {
          return response;
        }
        if (keys.length === 1) {
          return response[keys[0]];
        } else if (keys.length === 2) {
          return response[keys[1]];
        } else {
          throw new Error("Response object has more than two properties.");
        }
      } else {
        throw new Error("Invalid response format.");
      }
    }

    const handleAdd = async () => {
      setLoading(true);
      setError(null);

      try {
        await apiAddRequest(inputValue);

        const reloadResponse = await apiReloadRequest();

        const data = getResponseDataElement(reloadResponse);

        if (Array.isArray(data)) {
          if (updateStore) {
            runInAction(() => {
              updateStore(data);
            });
          } else {
            throw new Error("updateStore function is not defined.");
          }
        } else {
          throw new Error("Second property is not an array.");
        }

        setShowModal(false);
        setInputValue("");
      } catch (err) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    return (
      <>
        <Button
          variant="primary"
          className="custom-button"
          onClick={() => setShowModal(true)}
        >
          {label}
        </Button>

        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{label}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form>
              <Form.Group controlId="inputValue">
                <Form.Label>Input your new value here</Form.Label>
                <Form.Control
                  type={fieldType}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={`Text...`}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <CustomButton
              onClick={() => setShowModal(false)}
              size="md"
              className="custom-button-secondary"
            >
              Close
            </CustomButton>

            <CustomButton
              onClick={handleAdd}
              size="md"
              className="custom-button-primary"
              disabled={loading || !inputValue}
            >
              {loading ? "Adding..." : "Add"}
            </CustomButton>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
);

export default AddOneFieldDropdownElement;
