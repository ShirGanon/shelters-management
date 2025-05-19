import {React, useEffect, useState} from 'react';
import { MapContainer, ImageOverlay, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
 
const imageBounds = [[0, 0], [1000, 1000]]; // adjust to your image size (height, width)
 
const AddMarkerOnClick = ({ onAddMarker }) => {
  useMapEvents({
    click(e) {
      onAddMarker(e.latlng);
    },
  });
  return null;
};
 
const MapView = ({ imageUrl }) => {
  const [markers, setMarkers] = useState([]);
 
  const addMarker = (latlng) => {
    setMarkers([...markers, latlng]);
  };
 
  return (
    <MapContainer
      crs={L.CRS.Simple}
      bounds={imageBounds}
      style={{ height: '600px', width: '90vw' }}
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
 