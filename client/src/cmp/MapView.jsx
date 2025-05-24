import { React, useEffect, useState } from "react";
import {
  MapContainer,
  ImageOverlay,
  Marker,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";

const imageBounds = [
  [0, 0],
  [1000, 1000],
]; // adjust to your image size (height, width)

const AddMarkerOnClick = ({ onAddMarker }) => {
  useMapEvents({
    click(e) {
      onAddMarker(e.latlng);
    },
  });
  return null;
};

const saveMarkerToDB = async (latlng, area) => {
  await axios
    .post("http://localhost:8080/shelters/add", {
      name: "New Shelter",
      capacity: 100,
      status: "open",
      accessibility: "yes",
      lat: latlng.lat,
      lng: latlng.lng,
      area_id: area,
    })
    .then((response) => {
      console.log("Marker saved successfully:", response.data);
    })
    .catch((error) => {
      console.error("Error saving marker:", error);
    });
};

const MapView = ({ imageUrl, area }) => {
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/shelters/area/${area}`)
      .then((res) => {
        console.log(res.data);
        setMarkers(res.data ? res.data : []);
      })
      .catch((err) => {
        setMarkers([]);
        console.log(err);
      });
  }, [area]);

  const addMarker = (latlng) => {
    console.log("Marker added at:", latlng);
    setMarkers([...markers, latlng]);
    saveMarkerToDB(latlng, area);
  };

  return (
    <MapContainer
      crs={L.CRS.Simple}
      bounds={imageBounds}
      style={{ height: "600px", width: "50vw" }}
      minZoom={-2}
    >
      <ImageOverlay url={imageUrl} bounds={imageBounds} />
      <AddMarkerOnClick onAddMarker={addMarker} />
      {markers.map((pos, i) => (
        <Marker key={i} position={pos} />
      ))}
    </MapContainer>
  );
};

export default MapView;
