import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  Button,
  Form,
  ListGroup,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useJsApiLoader } from "@react-google-maps/api";
import CustomButton from "../../Common/CustomButton/CustomButton";
const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const MAP_LIBRARIES = ["places"]; // 'places' library is required to get place suggestions and details

// This is an address adding form with specific functionality connected to goople places api
// It is used for more consistent address formats in system as well as lng and lat parametr automatic getting
const AddNewAddressDropdownElement = ({
  title,
  addRequest,
  LoadRequest,
  StoresetMethod,
}) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: MAP_LIBRARIES,
  });

  // Fields required from Google Places API to fetch detailed information about the selected address
  const requestSelectArray = [
    "address_components",
    "geometry",
    "formatted_address",
  ];
  const [showModal, setShowModal] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const autocompleteService = useRef(null);
  const placesService = useRef(null);

  // Effect hook to initialize Google Maps services when the API is loaded
  useEffect(() => {
    if (isLoaded) {
      // Initialize Google Maps Autocomplete and Places Service
      autocompleteService.current =
        new window.google.maps.places.AutocompleteService();
      placesService.current = new window.google.maps.places.PlacesService(
        document.createElement("div")
      );
    }
  }, [isLoaded]);

  const fetchSuggestions = async (query) => {
    // Only fetch suggestions if the query has more than 2 characters
    if (autocompleteService.current && query.length > 2) {
      setLoading(true);
      try {
        autocompleteService.current.getPlacePredictions(
          { input: query, types: ["geocode"] },
          (predictions, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
              setSuggestions(predictions);
            } else {
              setError(
                "Failed to fetch new suggestions. Please check the spelling "
              );
            }
            setLoading(false);
          }
        );
      } catch (err) {
        setError(
          "Failed to fetch suggestions. Please check the spelling or inform administartor about error:",
          err
        );
        setLoading(false);
      }
    }
  };

  // Handle changes in the input field and fetch suggestions when the value changes
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setError(null);

    if (value.length > 2) {
      fetchSuggestions(value);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = async (suggestion) => {
    setInputValue(suggestion.description);
    setSuggestions([]);

    try {
      const request = {
        placeId: suggestion.place_id,
        fields: requestSelectArray,
      };

      placesService.current.getDetails(request, (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          const addressComponents = place.address_components;
          let street = "";
          let streetNumber = "";
          let city = "";
          let country = "";
          let lat = place.geometry.location.lat();
          let lng = place.geometry.location.lng();

          // Loop through address components to find the relevant address parts
          addressComponents.forEach((component) => {
            const types = component.types;
            if (types.includes("street_number")) {
              streetNumber = component.long_name;
            }
            if (types.includes("route")) {
              street = component.long_name;
            }
            if (types.includes("locality")) {
              city = component.long_name;
            }
            if (types.includes("country")) {
              country = component.long_name;
            }
          });

          const fullStreet = streetNumber
            ? `${street} ${streetNumber}`
            : street;

          setSelectedAddress({
            country,
            city,
            street: fullStreet,
            lat,
            lng,
          });
        } else {
          setError("Failed to fetch address details.");
        }
      });
    } catch (err) {
      setError("Failed to handle the selected address.");
    }
  };

  // Handle the process of adding the selected address to the system
  const handleAddAddress = async () => {
    if (selectedAddress && addRequest && LoadRequest && StoresetMethod) {
      try {
        await addRequest(
          selectedAddress.country,
          selectedAddress.city,
          selectedAddress.street,
          selectedAddress.lat,
          selectedAddress.lng
        );
        const reloadResponse = await LoadRequest();
        const data = reloadResponse;
        if (Array.isArray(data)) {
          if (StoresetMethod) {
            StoresetMethod(data); // Update the store with the new address data
          } else {
            throw new Error("StoresetMethod function is not defined.");
          }
        } else {
          throw new Error("Response data is not an array.");
        }
        setShowModal(false);
        setInputValue("");
      } catch (err) {
        setError(
          "Failed to add or reload the address. Check if it has country,city and street in it"
        );
      }
    } else {
      setError("Required functions are missing.");
    }
  };

  if (!isLoaded) {
    return <Spinner animation="border" />;
  }

  return (
    <>
      <Button
        variant="primary"
        onClick={() => setShowModal(true)}
        className="custom-button"
      >
        {title}
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form>
            <Form.Group controlId="inputValue">
              <Form.Label>Enter Address</Form.Label>
              <Form.Control
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Type an address..."
              />
            </Form.Group>
          </Form>

          {loading && <Spinner animation="border" />}
          {suggestions.length > 0 && (
            <ListGroup>
              {suggestions.map((suggestion) => (
                <ListGroup.Item
                  key={suggestion.place_id}
                  action
                  onClick={() => handleSelectSuggestion(suggestion)}
                >
                  {suggestion.description}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Modal.Body>
        <Modal.Footer>
          <CustomButton onClick={() => setShowModal(false)} size="md">
            Close
          </CustomButton>

          <CustomButton
            onClick={handleAddAddress}
            size="md"
            disabled={loading || !inputValue} // Disable the button if loading or no input
          >
            Done
          </CustomButton>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddNewAddressDropdownElement;
