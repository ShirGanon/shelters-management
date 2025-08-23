import React, { useState, useEffect } from 'react';

const ImageViewWithShelters = ({
  markers,
  imageUrl,
  onImageClick,
  addShelterMode,
  onAddShelterClick,
  areaId,
  onEditShelter,
  onBackClick
}) => {
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

      {/* Image Container */}
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
        {/* Toolbar */}
        <div
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            display: 'flex',
            gap: '10px',
            background: 'rgba(255,255,255,0.85)',
            padding: '8px 12px',
            borderRadius: '8px',
            zIndex: 1000,
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
          }}
        >
          {/* Back Button */}
          <button
            onClick={onBackClick} // הפונקציונליות של הכפתור Back הרגיל
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: '#d9534f',
              color: 'white',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          >
            Back
          </button>

          {/* Add New Shelter */}
          <button
            onClick={onAddShelterClick}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: addShelterMode ? '#dc3545' : '#05cb5a',
              color: 'white',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          >
            {addShelterMode ? 'Cancel Add Shelter' : 'Add New Shelter'}
          </button>
        </div>

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
      </div>
    </>
  );
};

export default ImageViewWithShelters;
