import React from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const MAP_LIBRARIES = ["places"]; // Load the Places Library for location-based displaying

// This component is made to display google map with an object location marker by lat and lng
const GoogleMapComponent = ({ lat, lng }) => {
  // Load the Google Maps JavaScript API using useJsApiLoader
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: MAP_LIBRARIES,
  });

  const center = {
    lat: parseFloat(lat),
    lng: parseFloat(lng),
  };

  if (!isLoaded) {
    return <div>Loading map...</div>;
  }

  // Render the Google Map with the specified center, zoom level, and a marker at the center
  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={15}>
      <Marker position={center} />
    </GoogleMap>
  );
};

export default GoogleMapComponent;
