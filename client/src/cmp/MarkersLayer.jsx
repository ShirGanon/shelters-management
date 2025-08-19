// MarkersLayer.jsx
import React from 'react';
import { MapContainer, ImageOverlay, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import AddMarkerOnClick from './AddMarkerOnClick.jsx';

const MarkersLayer = ({
  imageUrl,
  markers,
  defaultIcon,
  handleMarkerClick,
  handleMarkerDragEnd,
  handleAddClick,
  addMode,
  imageBounds,
  mapRef,
}) => {
  return (
    <MapContainer
      ref={mapRef}
      center={[500, 500]}
      zoom={0}
      minZoom={-2}
      maxZoom={2}
      maxBounds={imageBounds}
      maxBoundsViscosity={1.0}
      scrollWheelZoom={true}
      style={{
        height: '600px',
        width: '100%',
        borderRadius: 8,
        boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
      }}
      crs={L.CRS.Simple}
    >
      <ImageOverlay url={imageUrl} bounds={imageBounds} />

      <AddMarkerOnClick onAddClick={handleAddClick} active={addMode} />

      {Array.isArray(markers) &&
        markers
          .filter((marker) => !marker.shelterId)
          .map((marker, index) =>
            marker.latlng ? (
              <Marker
                key={marker.areaId || `marker-${index}`}
                position={marker.latlng}
                icon={defaultIcon}
                draggable={true}
                eventHandlers={{
                  dragend: (e) => handleMarkerDragEnd(e, index),
                  click: () => handleMarkerClick(marker, index),
                }}
              >
                <Popup>
                  <div style={{ maxWidth: 200 }}>
                    <h4 style={{ marginBottom: 6 }}>
                      {marker.name || `Area ${marker.areaId || index + 1}`}
                    </h4>
                    <p style={{ marginBottom: 6, fontSize: '0.9rem' }}>
                      {marker.description || 'No description'}
                    </p>
                    {marker.imageUrl && (
                      <img
                        src={marker.imageUrl}
                        alt={`Area ${marker.areaId || index + 1}`}
                        style={{ width: '100%', borderRadius: '6px', marginTop: 6 }}
                      />
                    )}
                  </div>
                </Popup>
              </Marker>
            ) : null
          )}
    </MapContainer>
  );
};

export default MarkersLayer;
