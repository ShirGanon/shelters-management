import React, { useState, useEffect } from 'react';

const ImageViewWithShelters = ({ markers, imageUrl, onImageClick, addShelterMode, onAddShelterClick, areaId, onEditShelter }) => {
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

  const handleShelterClick = (shelter, e) => {
    e.stopPropagation();
    if (!addShelterMode && onEditShelter) {
      onEditShelter(shelter);
    }
  };

  // Shelter Icon Component
  const ShelterIcon = ({ size = 32, color = '#dc3545' }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))' }}
    >
      <path d="M12 2L2 9h3v11h6v-6h2v6h6V9h3L12 2zm0 2.84L18 9v9h-2v-6h-6v6H8V9l4-4.16z"/>
    </svg>
  );

  // Alternative Shelter Building Icon
  const ShelterBuildingIcon = ({ size = 20, color = '#2c5282' }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
    >
      <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3zm0 2.69L18 12v6h-2v-6h-6v6H8v-6l4-6.31z"/>
      <circle cx="12" cy="9" r="1"/>
    </svg>
  );

  // Emergency Shelter Icon (with person)
  const EmergencyShelterIcon = ({ size = 20, color = '#2c5282' }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
    >
      <path d="M12 1L1 8v2h2v11h18V10h2V8L12 1zm0 2.5L19.5 9H4.5L12 3.5zM5 11h14v7H5v-7z"/>
      <circle cx="8" cy="13" r="1"/>
      <path d="M7 15h2v2H7z"/>
      <circle cx="16" cy="13" r="1"/>
      <path d="M15 15h2v2h-2z"/>
    </svg>
  );

  return (
    <>
      {/* Shelters List */}
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
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <ShelterIcon size={18} color="#dc3545" />
                <div>
                  <strong>{shelter.name || `Shelter ${shelter.shelterId || index + 1}`}</strong>
                  <p style={{ margin: '5px 0 0', fontSize: '0.85rem', color: '#666' }}>
                    {shelter.description || 'No description'}
                  </p>
                  {shelter.status && (
                    <span style={{ 
                      fontSize: '0.8rem', 
                      color: shelter.status === 'Available' ? '#28a745' : 
                             shelter.status === 'Fully Occupied' ? '#dc3545' : '#ffc107',
                      fontWeight: '600'
                    }}>
                      {shelter.status}
                    </span>
                  )}
                  <button
                    onClick={() => onEditShelter && onEditShelter(shelter)}
                    style={{
                      marginTop: '5px',
                      padding: '4px 8px',
                      fontSize: '0.75rem',
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer',
                    }}
                  >
                    Edit
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Map */}
      <div
        style={{
          position: 'relative',
          top: '-160px',
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
                  transform: 'translate(-50%, -50%)',
                  zIndex: 1002,
                  cursor: addShelterMode ? 'default' : 'pointer',
                  transition: 'transform 0.2s ease',
                }}
                title={addShelterMode ? '' : `Click to edit: ${marker.name || 'Shelter'} - ${marker.status || 'Unknown status'}`}
                onClick={(e) => handleShelterClick(marker, e)}
                onMouseEnter={(e) => {
                  if (!addShelterMode) {
                    e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!addShelterMode) {
                    e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
                  }
                }}
              >
                <ShelterIcon size={36} color="#dc3545" />
              </div>
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