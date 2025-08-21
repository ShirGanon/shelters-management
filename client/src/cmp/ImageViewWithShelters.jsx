import React, { useState, useEffect } from 'react';

const ImageViewWithShelters = ({ markers, imageUrl, onImageClick, addShelterMode, onAddShelterClick, areaId }) => {
  const [shelterList, setShelterList] = useState([]);

  useEffect(() => {
    const areaShelters = Array.isArray(markers)
      ? markers.filter(marker => marker.areaId === areaId && marker.shelterId)
      : [];
    setShelterList(areaShelters);
  }, [markers, areaId]);

  const handleClick = (e) => {
    if (addShelterMode) {
      onImageClick(e);
    }
  };

  return (
    <>
      {/* Shelters List מחוץ למפה, צמוד לפינה שמאלית עליונה */}
      <div
        style={{
          position: 'fixed',
          top: '0px',
          left: '0px',
          backgroundColor: 'white',
          padding: '15px',
          borderRadius: '0 0 8px 8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          maxHeight: '400px',
          overflowY: 'auto',
          zIndex: 1003,
          width: '250px',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <h3 style={{ marginBottom: '15px', color: '#222', fontSize: '1.2rem' }}>Shelters in Area</h3>
        {shelterList.length === 0 ? (
          <p style={{ color: '#555', fontSize: '0.9rem' }}>No shelters added yet.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {shelterList.map((shelter, index) => (
              <li
                key={shelter.shelterId || `shelter-${index}`}
                style={{
                  padding: '10px',
                  borderBottom: '1px solid #eee',
                  color: '#333',
                  fontSize: '0.95rem',
                }}
              >
                <strong>{shelter.name || `Shelter ${shelter.shelterId || index + 1}`}</strong>
                <p style={{ margin: '5px 0 0', fontSize: '0.85rem', color: '#666' }}>
                  {shelter.description || 'No description'}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Map */}
      <div
        style={{
          position: 'relative',
          top:'-160px',
          height: '600px',
          width: '100%',
          borderRadius: '8px',
          boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
          overflow: 'hidden'
        }}
      >
        <img
          src={imageUrl}
          alt="Area Detail"
          onClick={handleClick}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            borderRadius: '8px',
            cursor: addShelterMode ? 'crosshair' : 'default',
          }}
        />

        {Array.isArray(markers) && markers
          .filter(marker => marker.areaId === areaId && marker.shelterId)
          .map((marker, index) => (
            marker.latlng && (
              <div
                key={marker.shelterId || `marker-${index}`}
                style={{
                  position: 'absolute',
                  top: `${(marker.latlng.lat / 1000) * 100}%`,
                  left: `${(marker.latlng.lng / 1000) * 100}%`,
                  width: '10px',
                  height: '10px',
                  backgroundColor: 'red',
                  borderRadius: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 1002,
                }}
              />
            )
          ))
        }

        <button
          onClick={onAddShelterClick}
          style={{
            position: 'absolute',
            top: '50px',
            left: '10px',
            backgroundColor: addShelterMode ? '#d9534f' : '#4a90e2',
            color: 'white',
            padding: '8px 18px',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            zIndex: '9999',
            boxShadow: `0 2px 6px rgba(${addShelterMode ? '217,83,79' : '74,144,226'},0.5)`,
            transition: 'background-color 0.3s ease',
          }}
        >
          {addShelterMode ? 'Cancel Add Shelter' : 'Add Shelter'}
        </button>
      </div>
    </>
  );
};

export default ImageViewWithShelters;