import React from "react";
import { Form } from "react-bootstrap";

const PhotosSection = ({
  formData,
  handleFileChange,
  handleRemovePhoto,
  setFormData,
}) => (
  <>
    <Form.Group controlId="bannerPhoto">
      <Form.Label>Banner Photo (Max size: 5MB, JPG/PNG only)</Form.Label>
      <Form.Control
        type="file"
        name="bannerPhoto"
        onChange={(e) => handleFileChange(e, "bannerPhoto")}
        accept=".jpg,.png,.jpeg"
      />
      {formData.bannerPhoto && (
        <div className="mt-2">
          <img
            src={URL.createObjectURL(formData.bannerPhoto)}
            alt="Banner"
            width="100"
          />
          <button
            type="button"
            className="btn btn-danger btn-sm ms-2"
            onClick={() =>
              setFormData((prevState) => ({ ...prevState, bannerPhoto: null }))
            }
          >
            Remove
          </button>
        </div>
      )}
    </Form.Group>
    <Form.Group controlId="otherPhotos">
      <Form.Label>
        Other Photos (Max size: 5MB, JPG/PNG only, Max 3 files)
      </Form.Label>
      <Form.Control
        type="file"
        name="otherPhotos"
        onChange={(e) => handleFileChange(e, "otherPhotos")}
        accept=".jpg,.png,.jpeg"
        multiple
      />
      {formData.otherPhotosPreviews.length > 0 && (
        <div className="mt-2">
          {formData.otherPhotosPreviews.map((preview, index) => (
            <div key={index} className="d-flex align-items-center">
              <img src={preview} alt={`Other ${index}`} width="100" />
              <button
                type="button"
                className="btn btn-danger btn-sm ms-2"
                onClick={() => handleRemovePhoto(index)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </Form.Group>
  </>
);

export default PhotosSection;
