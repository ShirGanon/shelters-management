import React, { useState, useEffect, useMemo } from 'react';

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
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const areaShelters = Array.isArray(markers)
      ? markers.filter(marker => marker.areaId === areaId && marker.shelterId)
      : [];
    setShelterList(areaShelters);
  }, [markers, areaId]);

  // Filter shelters based on search term
  const filteredShelters = useMemo(() => {
    if (!searchTerm.trim()) {
      return shelterList;
    }
    
    return shelterList.filter(shelter => {
      const name = shelter.name || `Shelter ${shelter.shelterId || ''}`;
      const description = shelter.description || '';
      const shelterId = shelter.shelterId || '';
      const status = shelter.status || '';
      const accessibility = shelter.accessibility || '';
      const capacity = shelter.capacity ? shelter.capacity.toString() : '';
      const floor = shelter.floor ? shelter.floor.toString() : '';
      
      const searchLower = searchTerm.toLowerCase();
      
      return (
        name.toLowerCase().includes(searchLower) ||
        description.toLowerCase().includes(searchLower) ||
        shelterId.toLowerCase().includes(searchLower) ||
        status.toLowerCase().includes(searchLower) ||
        accessibility.toLowerCase().includes(searchLower) ||
        capacity.includes(searchLower) ||
        floor.includes(searchLower)
      );
    });
  }, [shelterList, searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

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
          maxHeight: '730px',
          overflowY: 'auto',
          zIndex: 1003,
          width: '500px',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <h3 style={{ marginBottom: '15px', color: '#222', fontSize: '1.2rem' }}>
          Shelters in Area
        </h3>
        
        {/* Search Input */}
        <div style={{ marginBottom: '15px', position: 'relative' }}>
          <input
            type="text"
            placeholder="Search shelters by name, ID, status, floor, capacity..."
            value={searchTerm}
            onChange={handleSearchChange}
            style={{
              width: '100%',
              padding: '10px 40px 10px 12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '0.9rem',
              outline: 'none',
              transition: 'border-color 0.2s ease',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#dc3545';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#ddd';
            }}
          />
          
          {/* Search Icon */}
          <div
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#666',
              pointerEvents: searchTerm ? 'auto' : 'none',
              cursor: searchTerm ? 'pointer' : 'default',
            }}
            onClick={searchTerm ? clearSearch : undefined}
          >
            {searchTerm ? (
              // Clear icon (X)
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            ) : (
              // Search icon
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
            )}
          </div>
        </div>

        {/* Results Counter */}
        {searchTerm && (
          <div style={{
            marginBottom: '10px',
            fontSize: '0.85rem',
            color: '#666',
            fontStyle: 'italic'
          }}>
            {filteredShelters.length === 0 
              ? 'No shelters found' 
              : `Found ${filteredShelters.length} shelter${filteredShelters.length === 1 ? '' : 's'}`
            }
            {searchTerm && (
              <span style={{ marginLeft: '5px' }}>
                for "{searchTerm}"
              </span>
            )}
          </div>
        )}

        {/* Shelter List */}
        {filteredShelters.length === 0 ? (
          <p style={{ color: '#555', fontSize: '0.9rem' }}>
            {searchTerm ? 'No shelters match your search.' : 'No shelters added yet.'}
          </p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {filteredShelters.map((shelter, index) => (
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
                  backgroundColor: 'transparent',
                  borderRadius: '4px',
                  transition: 'background-color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f8f9fa';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                <ShelterIcon size={18} color="#dc3545" />
                <div style={{ flex: 1 }}>
                  <strong>{shelter.name || `Shelter ${shelter.shelterId || index + 1}`}</strong>
                  
                  {/* Shelter Details */}
                  <div style={{ margin: '5px 0', fontSize: '0.8rem', color: '#888' }}>
                    {shelter.shelterId && (
                      <span style={{ marginRight: '10px' }}>
                        ID: <strong>{shelter.shelterId}</strong>
                      </span>
                    )}
                    {shelter.floor && (
                      <span style={{ marginRight: '10px' }}>
                        Floor: <strong>{shelter.floor}</strong>
                      </span>
                    )}
                    {shelter.capacity && (
                      <span style={{ marginRight: '10px' }}>
                        Capacity: <strong>{shelter.capacity}</strong>
                      </span>
                    )}
                    {shelter.accessibility && (
                      <span>
                        Accessible: <strong>{shelter.accessibility}</strong>
                      </span>
                    )}
                  </div>
                  
                  <p style={{ margin: '5px 0 0', fontSize: '0.85rem', color: '#666' }}>
                    {shelter.description || 'No description'}
                  </p>
                  
                  {shelter.status && (
                    <span style={{ 
                      fontSize: '0.8rem', 
                      color: shelter.status === 'Available' ? '#28a745' : 
                             shelter.status === 'Fully Occupied' ? '#dc3545' : '#ffc107',
                      fontWeight: '600',
                      display: 'block',
                      marginTop: '3px'
                    }}>
                      Status: {shelter.status}
                    </span>
                  )}
                  
                  <button
                    onClick={() => onEditShelter && onEditShelter(shelter)}
                    style={{
                      marginTop: '8px',
                      padding: '6px 12px',
                      fontSize: '0.8rem',
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#0056b3';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#007bff';
                    }}
                  >
                    Edit Shelter
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
            onClick={onBackClick} 
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