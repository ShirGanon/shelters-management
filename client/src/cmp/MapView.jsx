import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, ImageOverlay, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

const imageBounds = [[0, 0], [1000, 1000]];

const AddMarkerOnClick = ({ onAddClick, active }) => {
  useMapEvents({
    click(e) {
      if (active) {
        onAddClick(e.latlng);
      }
    }
  });
  return null;
};

const Modal = ({ visible, onClose, onSave, onDelete, areaData, setAreaData, isEdit }) => {
  if (!visible) return null;

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files.length > 0) {
      setAreaData(prev => ({ ...prev, image: files[0], imageUrl: URL.createObjectURL(files[0]) }));
    } else {
      setAreaData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave();
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 1000,
    }}>
      <form onSubmit={handleSubmit} style={{
        backgroundColor: 'white', padding: '20px', borderRadius: '8px',
        width: '320px', maxHeight: '80vh', overflowY: 'auto',
        direction: 'ltr',
        fontFamily: 'Arial, sans-serif',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
      }}>
        <h3 style={{ marginBottom: '20px', color: '#222' }}>{isEdit ? 'Edit Area Details' : 'Area Details'}</h3>

        <label style={{ display: 'block', marginBottom: '15px', color: '#333' }}>
          Area ID:
          <input
            type="text"
            name="areaId"
            value={areaData.areaId}
            readOnly
            style={{
              width: '100%',
              marginTop: '6px',
              padding: '8px',
              border: '1.5px solid #bbb',
              borderRadius: '6px',
              backgroundColor: '#f9f9f9',
              fontWeight: '600',
              color: '#555',
              cursor: 'not-allowed',
              userSelect: 'none'
            }}
          />
        </label>

        <label style={{ display: 'block', marginBottom: '15px', color: '#333' }}>
          Area Name:
          <input
            type="text"
            name="name"
            value={areaData.name}
            onChange={handleChange}
            required
            placeholder="Enter area name"
            style={{
              width: '100%',
              marginTop: '6px',
              padding: '10px',
              border: '2px solid #888',
              borderRadius: '8px',
              fontSize: '1rem',
              outline: 'none',
              transition: 'border-color 0.3s',
            }}
            onFocus={(e) => e.target.style.borderColor = '#4a90e2'}
            onBlur={(e) => e.target.style.borderColor = '#888'}
          />
        </label>

        <label style={{ display: 'block', marginBottom: '15px', color: '#333' }}>
          Description:
          <textarea
            name="description"
            value={areaData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Enter description"
            style={{
              width: '100%',
              marginTop: '6px',
              padding: '8px',
              border: '1.5px solid #ccc',
              borderRadius: '6px',
              fontSize: '1rem',
              resize: 'vertical',
            }}
          />
        </label>

        <label style={{ display: 'block', marginBottom: '20px', color: '#555' }}>
          Upload Image:
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            style={{ display: 'none' }}
            id="image-upload-input"
          />
          <label
            htmlFor="image-upload-input"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '12px',
              marginTop: '8px',
              border: '2px dashed grey',
              borderRadius: '8px',
              backgroundColor: '#fafafa',
              color: '#666',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
              userSelect: 'none',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fafafa')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20"
              viewBox="0 0 24 24"
              width="20"
              fill="#666"
              style={{ marginRight: '8px' }}
              aria-hidden="true"
            >
              <path d="M5 20h14v-2H5v2zm7-18L5.33 9h3.84v4H10v-4h4v4h1.83v-4h3.84L12 2z" />
            </svg>
            Click or Drag to Upload Image
          </label>
          {areaData.image && (
            <div
              style={{
                marginTop: '8px',
                fontStyle: 'italic',
                color: '#444',
                fontSize: '0.9rem',
                overflowWrap: 'break-word',
                maxWidth: '100%',
              }}
            >
              Selected file: {areaData.image.name}
            </div>
          )}
          {areaData.imageUrl && (
            <img
              src={areaData.imageUrl}
              alt="Preview"
              style={{ marginTop: '10px', maxWidth: '100%', borderRadius: '6px', boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }}
            />
          )}
        </label>

        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
          <div style={{ flexGrow: 1 }}>
            <button
              type="submit"
              style={{
                backgroundColor: '#4a90e2',
                color: 'white',
                padding: '8px 18px',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                boxShadow: '0 2px 6px rgba(74,144,226,0.5)',
                width: '100%',
              }}
            >
              Save
            </button>
          </div>
          <div style={{ flexGrow: 1 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 18px',
                borderRadius: '6px',
                border: '1.5px solid #aaa',
                backgroundColor: 'white',
                cursor: 'pointer',
                fontWeight: '600',
                color: '#333',
                width: '100%',
              }}
            >
              Cancel
            </button>
          </div>
          {isEdit && (
            <div style={{ flexGrow: 1 }}>
              <button
                type="button"
                onClick={onDelete}
                style={{
                  backgroundColor: '#d9534f',
                  color: 'white',
                  padding: '8px 18px',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  width: '100%',
                }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

const ShelterList = ({ markers, onModifyClick, onDiveClick }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: '10px',
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
      <h3 style={{ marginBottom: '15px', color: '#222', fontSize: '1.2rem' }}>Shelter List</h3>
      {markers.length === 0 ? (
        <p style={{ color: '#555', fontSize: '0.9rem' }}>No shelters added yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {markers.map((marker, index) => (
            <li
              key={marker.areaId}
              style={{
                padding: '10px',
                borderBottom: '1px solid #eee',
                color: '#333',
                fontSize: '0.95rem',
              }}
            >
              <strong>{marker.name || `Area ${marker.areaId}`}</strong>
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
                  onClick={() => onDiveClick(marker.imageUrl)}
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

const AddShelterPopup = ({ visible, position, onClose, onSave, shelterData, setShelterData, areaImageUrl }) => {
  if (!visible) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShelterData(prev => ({
      ...prev,
      [name]: value,
      imageUrl: areaImageUrl, // Set the area image URL for the shelter
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave();
  };

  return (
    <div style={{
      position: 'absolute',
      top: position.y,
      left: position.x,
      backgroundColor: 'white',
      padding: '15px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 1001,
      fontFamily: 'Arial, sans-serif',
      transform: 'translate(-50%, -50%)',
    }}>
      <form onSubmit={handleSubmit}>
        <h3 style={{ marginBottom: '15px', color: '#222' }}>Add New Shelter</h3>
        <label style={{ display: 'block', marginBottom: '10px', color: '#333' }}>
          Area Number:
          <input
            type="text"
            name="areaNumber"
            value={shelterData.areaNumber}
            onChange={handleChange}
            style={{
              width: '100%',
              marginTop: '6px',
              padding: '8px',
              border: '1.5px solid #888',
              borderRadius: '6px',
            }}
          />
        </label>
        <label style={{ display: 'block', marginBottom: '10px', color: '#333' }}>
          Shelter Name:
          <input
            type="text"
            name="name"
            value={shelterData.name}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              marginTop: '6px',
              padding: '8px',
              border: '1.5px solid #888',
              borderRadius: '6px',
            }}
          />
        </label>
        <label style={{ display: 'block', marginBottom: '10px', color: '#333' }}>
          Shelter ID:
          <input
            type="text"
            name="areaId"
            value={shelterData.areaId}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              marginTop: '6px',
              padding: '8px',
              border: '1.5px solid #888',
              borderRadius: '6px',
            }}
          />
        </label>
        <label style={{ display: 'block', marginBottom: '10px', color: '#333' }}>
          Floor:
          <input
            type="text"
            name="floor"
            value={shelterData.floor}
            onChange={handleChange}
            style={{
              width: '100%',
              marginTop: '6px',
              padding: '8px',
              border: '1.5px solid #888',
              borderRadius: '6px',
            }}
          />
        </label>
        <label style={{ display: 'block', marginBottom: '10px', color: '#333' }}>
          Status:
          <input
            type="text"
            name="status"
            value={shelterData.status}
            onChange={handleChange}
            style={{
              width: '100%',
              marginTop: '6px',
              padding: '8px',
              border: '1.5px solid #888',
              borderRadius: '6px',
            }}
          />
        </label>
        <label style={{ display: 'block', marginBottom: '10px', color: '#333' }}>
          Accessibility:
          <input
            type="text"
            name="accessibility"
            value={shelterData.accessibility}
            onChange={handleChange}
            style={{
              width: '100%',
              marginTop: '6px',
              padding: '8px',
              border: '1.5px solid #888',
              borderRadius: '6px',
            }}
          />
        </label>
        <label style={{ display: 'block', marginBottom: '10px', color: '#333' }}>
          Description:
          <textarea
            name="description"
            value={shelterData.description}
            onChange={handleChange}
            rows={2}
            style={{
              width: '100%',
              marginTop: '6px',
              padding: '8px',
              border: '1.5px solid #888',
              borderRadius: '6px',
            }}
          />
        </label>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="submit"
            style={{
              backgroundColor: '#4a90e2',
              color: 'white',
              padding: '8px 18px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              boxShadow: '0 2px 6px rgba(74,144,226,0.5)',
            }}
          >
            Save
          </button>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '8px 18px',
              borderRadius: '6px',
              border: '1.5px solid #aaa',
              backgroundColor: 'white',
              cursor: 'pointer',
              fontWeight: '600',
              color: '#333',
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

const ImageViewWithShelters = ({ markers, imageUrl, onImageClick, addMode, onAddShelterClick }) => {
  const [shelterList, setShelterList] = useState([]);

  useEffect(() => {
    // Filter shelters for the current area based on imageUrl
    const areaShelters = markers.filter(marker => marker.imageUrl === imageUrl);
    setShelterList(areaShelters);
  }, [markers, imageUrl]);

  const handleClick = (e) => {
    if (addMode) {
      onImageClick(e);
    }
  };

  return (
    <div style={{ position: 'relative', height: '600px', width: '100%', borderRadius: '8px', boxShadow: '0 3px 10px rgba(0,0,0,0.2)', overflow: 'hidden' }}>
      <img
        src={imageUrl}
        alt="Area Detail"
        onClick={handleClick}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          borderRadius: '8px',
          cursor: addMode ? 'crosshair' : 'default',
        }}
      />
      {markers.map((marker) => (
        <div
          key={marker.areaId}
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
      ))}
      <button
        onClick={onAddShelterClick}
        style={{
          position: 'absolute',
          top: '50px',
          left: '10px',
          backgroundColor: '#4a90e2',
          color: 'white',
          padding: '8px 18px',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: '600',
          boxShadow: '0 2px 6px rgba(74,144,226,0.5)',
        }}
      >
        Add Shelter
      </button>
      <div
        style={{
          position: 'absolute',
          top: '100px',
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
        <h3 style={{ marginBottom: '15px', color: '#222', fontSize: '1.2rem' }}>Shelters in Area</h3>
        {shelterList.length === 0 ? (
          <p style={{ color: '#555', fontSize: '0.9rem' }}>No shelters added yet.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {shelterList.map((shelter, index) => (
              <li
                key={shelter.areaId}
                style={{
                  padding: '10px',
                  borderBottom: '1px solid #eee',
                  color: '#333',
                  fontSize: '0.95rem',
                }}
              >
                <strong>{shelter.name || `Shelter ${shelter.areaId}`}</strong>
                <p style={{ margin: '5px 0 0', fontSize: '0.85rem', color: '#666' }}>
                  {shelter.description || 'No description'}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const MapView = ({ imageUrl }) => {
  const [markers, setMarkers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentLatLng, setCurrentLatLng] = useState(null);
  const [areaCounter, setAreaCounter] = useState(1);
  const [areaData, setAreaData] = useState({
    areaId: '',
    name: '',
    description: '',
    image: null,
    imageUrl: null,
  });
  const [addMode, setAddMode] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [showImageView, setShowImageView] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [shelterData, setShelterData] = useState({
    areaNumber: '',
    areaId: '',
    name: '',
    floor: '',
    status: '',
    accessibility: '',
    description: '',
  });
  const mapRef = useRef();

  useEffect(() => {
    axios.get("http://localhost:8080/areas")
      .then(res => {
        setMarkers(res.data);
        setAreaCounter(res.data.length + 1);
      })
      .catch(err => console.error("Failed to fetch areas:", err));
  }, []);

  const handleAddClick = (latlng) => {
    setCurrentLatLng(latlng);
    setAreaData({
      areaId: areaCounter.toString(),
      name: '',
      description: '',
      image: null,
      imageUrl: null,
    });
    setModalVisible(true);
    setAddMode(false);
    setEditIndex(null);
  };

  const handleMarkerClick = (marker, index) => {
    setCurrentLatLng(marker.latlng);
    setAreaData({
      areaId: marker.areaId,
      name: marker.name,
      description: marker.description,
      image: null,
      imageUrl: marker.imageUrl || null,
    });
    setModalVisible(true);
    setEditIndex(index);
    setAddMode(false);
  };

  const handleSave = () => {
    if (editIndex !== null) {
      const updatedMarkers = [...markers];
      updatedMarkers[editIndex] = {
        ...updatedMarkers[editIndex],
        latlng: currentLatLng,
        ...areaData,
      };
      setMarkers(updatedMarkers);
      setModalVisible(false);

      const formData = new FormData();
      formData.append('areaId', areaData.areaId);
      formData.append('name', areaData.name);
      formData.append('description', areaData.description);
      if (areaData.image) {
        formData.append('image', areaData.image);
      }
      formData.append('lat', currentLatLng.lat);
      formData.append('lng', currentLatLng.lng);

      axios.put(`http://localhost:8080/areas/${areaData.areaId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
        .then(res => console.log("Updated:", res.data))
        .catch(err => console.error("Error updating area:", err));
    } else {
      const newMarker = {
        latlng: currentLatLng,
        ...areaData,
      };
      setMarkers(prev => [...prev, newMarker]);
      setModalVisible(false);
      setAreaCounter(prev => prev + 1);

      const formData = new FormData();
      formData.append('areaId', areaData.areaId);
      formData.append('name', areaData.name);
      formData.append('description', areaData.description);
      if (areaData.image) {
        formData.append('image', areaData.image);
      }
      formData.append('lat', currentLatLng.lat);
      formData.append('lng', currentLatLng.lng);

      axios.post("http://localhost:8080/areas", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
        .then(res => console.log("Saved:", res.data))
        .catch(err => console.error("Error saving area:", err));
    }
  };

  const handleDelete = () => {
    if (editIndex === null) return;

    const areaIdToDelete = markers[editIndex].areaId;
    setMarkers(prev => prev.filter((_, i) => i !== editIndex));
    setModalVisible(false);
    setEditIndex(null);

    axios.delete(`http://localhost:8080/areas/${areaIdToDelete}`)
      .then(res => console.log("Deleted:", res.data))
      .catch(err => console.error("Error deleting area:", err));
  };

  const defaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    shadowSize: [41, 41]
  });

  const handleMarkerDragEnd = (e, index) => {
    const newLatLng = e.target.getLatLng();
    setMarkers(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], latlng: newLatLng };
      return copy;
    });
  };

  const handleDiveIn = (imageUrl) => {
    if (imageUrl) {
      setSelectedImageUrl(imageUrl);
      setShowImageView(true);
    }
  };

  const handleBack = () => {
    setShowImageView(false);
    setSelectedImageUrl(null);
    setAddMode(false);
    setPopupVisible(false);
  };

  const handleImageClick = (e) => {
    if (addMode) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const lat = (y / rect.height) * 1000;
      const lng = (x / rect.width) * 1000;
      setCurrentLatLng({ lat, lng });
      setPopupPosition({ x: e.clientX, y: e.clientY });
      setPopupVisible(true);
      setShelterData({
        areaNumber: '',
        areaId: areaCounter.toString(),
        name: '',
        floor: '',
        status: '',
        accessibility: '',
        description: '',
      });
    }
  };

  const handleAddShelterClick = () => {
    setPopupVisible(true);
    setShelterData({
      areaNumber: '',
      areaId: areaCounter.toString(),
      name: '',
      floor: '',
      status: '',
      accessibility: '',
      description: '',
      imageUrl: selectedImageUrl,
    });
    setPopupPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  };

  const handleSaveShelter = () => {
    const newMarker = {
      latlng: currentLatLng || { lat: 500, lng: 500 }, // Default position if not set
      ...shelterData,
    };
    setMarkers(prev => [...prev, newMarker]);
    setPopupVisible(false);
    setAddMode(false);

    const formData = new FormData();
    formData.append('areaNumber', shelterData.areaNumber);
    formData.append('areaId', shelterData.areaId);
    formData.append('name', shelterData.name);
    formData.append('floor', shelterData.floor);
    formData.append('status', shelterData.status);
    formData.append('accessibility', shelterData.accessibility);
    formData.append('description', shelterData.description);
    formData.append('lat', newMarker.latlng.lat);
    formData.append('lng', newMarker.latlng.lng);
    formData.append('imageUrl', shelterData.imageUrl);

    axios.post("http://localhost:8080/areas", formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then(res => console.log("Saved shelter:", res.data))
      .catch(err => console.error("Error saving shelter:", err));
  };

  return (
    <>
      <div style={{ marginBottom: 12, display: 'flex', gap: 10, alignItems: 'center' }}>
        <button
          onClick={() => setAddMode(!addMode)}
          style={{
            padding: '10px 18px',
            fontWeight: '600',
            backgroundColor: addMode ? '#d9534f' : '#4a90e2',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
          }}
        >
          {addMode ? 'Cancel Add Mode' : 'Add New Area'}
        </button>
        <span style={{ fontSize: 14, color: '#555' }}>
          {addMode ? 'Click on map to add an area.' : 'Click "Add New Area" to start adding markers.'}
        </span>
      </div>

      {!showImageView && (
        <ShelterList
          markers={markers}
          onModifyClick={handleMarkerClick}
          onDiveClick={handleDiveIn}
        />
      )}

      {!showImageView ? (
        <MapContainer
          ref={mapRef}
          center={[500, 500]}
          zoom={0}
          minZoom={-2}
          maxZoom={2}
          maxBounds={imageBounds}
          maxBoundsViscosity={1.0}
          scrollWheelZoom={true}
          style={{ height: '600px', width: '100%', borderRadius: 8, boxShadow: '0 3px 10px rgba(0,0,0,0.2)' }}
          crs={L.CRS.Simple}
        >
          <ImageOverlay url={imageUrl} bounds={imageBounds} />

          <AddMarkerOnClick onAddClick={handleAddClick} active={addMode} />

          {markers.map((marker, index) => (
            <Marker
              key={marker.areaId}
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
                  <h4 style={{ marginBottom: 6 }}>{marker.name || `Area ${marker.areaId}`}</h4>
                  <p style={{ marginBottom: 6, fontSize: '0.9rem' }}>{marker.description || 'No description'}</p>
                  {marker.imageUrl && (
                    <img
                      src={marker.imageUrl}
                      alt={`Area ${marker.areaId}`}
                      style={{ width: '100%', borderRadius: '6px', marginTop: 6 }}
                    />
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      ) : (
        <div style={{ position: 'relative' }}>
          <ImageViewWithShelters
            markers={markers}
            imageUrl={selectedImageUrl}
            onImageClick={handleImageClick}
            addMode={addMode}
            onAddShelterClick={handleAddShelterClick}
          />
          <button
            onClick={handleBack}
            style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              backgroundColor: '#d9534f',
              color: 'white',
              padding: '8px 18px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              boxShadow: '0 2px 6px rgba(217,83,79,0.5)',
            }}
          >
            Back
          </button>
          {popupVisible && (
            <AddShelterPopup
              visible={popupVisible}
              position={popupPosition}
              onClose={() => setPopupVisible(false)}
              onSave={handleSaveShelter}
              shelterData={shelterData}
              setShelterData={setShelterData}
              areaImageUrl={selectedImageUrl}
            />
          )}
        </div>
      )}

      <Modal
        visible={modalVisible}
        onClose={() => { setModalVisible(false); setEditIndex(null); setAddMode(false); }}
        onSave={handleSave}
        onDelete={handleDelete}
        areaData={areaData}
        setAreaData={setAreaData}
        isEdit={editIndex !== null}
      />
    </>
  );
};

export default MapView;