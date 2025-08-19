import React from 'react';

const ShelterList = ({ markers, onModifyClick, onDiveClick, selectedAreaId }) => {
  const areaMarkers = Array.isArray(markers) ? markers.filter(marker => !marker.shelterId) : [];
  return (
    <div
      style={{
        position: 'absolute',
        top: '80px',
        left: '10px',
        backgroundColor: 'white',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        maxHeight: '400px',
        overflowY: 'auto',
        zIndex: 1000,
        width: '250px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h3 style={{ marginBottom: '15px', color: '#222', fontSize: '1.2rem' }}>Area List</h3>
      {areaMarkers.length === 0 ? (
        <p style={{ color: '#555', fontSize: '0.9rem' }}>No areas added yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {areaMarkers.map((marker, index) => (
            <li
              key={marker.areaId || `marker-${index}`}
              style={{
                padding: '10px',
                borderBottom: '1px solid #eee',
                color: '#333',
                fontSize: '0.95rem',
              }}
            >
              <strong>{marker.name || `Area ${marker.areaId || index + 1}`}</strong>
              <p style={{ margin: '5px 0 0', fontSize: '0.85rem', color: '#666' }}>
                {marker.description || 'No description'}
              </p>
              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button
                  onClick={() => onModifyClick(marker, index)}
                  style={{
                    backgroundColor: '#4a90e2',
                    color: 'white',
                    padding: '6px 12px',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    boxShadow: '0 2px 6px rgba(74,144,226,0.5)',
                  }}
                >
                  Modify
                </button>
                <button
                  onClick={() => onDiveClick(marker.areaId, marker.imageUrl)}
                  style={{
                    backgroundColor: '#5cb85c',
                    color: 'white',
                    padding: '6px 12px',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    boxShadow: '0 2px 6px rgba(92,184,92,0.5)',
                  }}
                >
                  Area Scope
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ShelterList;
