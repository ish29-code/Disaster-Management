import { useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = { width: "100%", height: "80vh" };

const Map = () => {
  const [location, setLocation] = useState("");
  const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 });

  const handleSearch = async () => {
    if (!location.trim()) return;

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          location
        )}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();

      if (data.status === "OK" && data.results.length > 0) {
        setMapCenter(data.results[0].geometry.location);
      } else {
        alert("Location not found. Try another search.");
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      alert("An error occurred while fetching location.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-center mb-4">Search a Location</h2>
      <div className="flex justify-center mb-4">
        <input
          type="text"
          placeholder="Enter city or state"
          className="p-2 border rounded mr-2"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button onClick={handleSearch} className="p-2 bg-blue-500 text-white rounded">
          Search
        </button>
      </div>

      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <GoogleMap mapContainerStyle={containerStyle} center={mapCenter} zoom={10}>
          <Marker position={mapCenter} />
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default Map;
