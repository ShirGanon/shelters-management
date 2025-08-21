import React, { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import './MapView.css';
import Modal from "./Modal.jsx";
import AddShelterPopup from './AddShelterPopup.jsx';
import ShelterList from './ShelterList.jsx';
import ImageViewWithShelters from './ImageViewWithShelters.jsx';
import MarkersLayer from './MarkersLayer.jsx';


const imageBounds = [[0, 0], [1000, 1000]];

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
  const [addShelterMode, setAddShelterMode] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [showImageView, setShowImageView] = useState(false);
  const [selectedAreaId, setSelectedAreaId] = useState(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [shelterData, setShelterData] = useState({
    areaId: '',
    shelterId: '',
    name: '',
    floor: '',
    status: '',
    accessibility: '',
    capacity: '',
    description: '',
    imageUrl: '',
  });
  const mapRef = useRef();

  useEffect(() => {
    axios.get("http://localhost:8080/areas/list")
      .then(res => {
        const data = Array.isArray(res.data) ? res.data.map((item, index) => ({
          ...item,
          areaId: item.id || `area-${index + 1}`,
          latlng: item.latlng || { lat: 500, lng: 500 },
        })) : [];
        setMarkers(data);
        setAreaCounter(data.length + 1);
      })
      .catch(err => {
        console.error("Failed to fetch areas:", err);
        setMarkers([]);
      });
  }, []);

  const handleAddClick = (latlng) => {
    setCurrentLatLng(latlng);
    setAreaData({
      areaId: `area-${areaCounter}`,
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
    setCurrentLatLng(marker.latlng || { lat: 500, lng: 500 });
    setAreaData({
      areaId: marker.areaId,
      name: marker.name || '',
      description: marker.description || '',
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
        latlng: currentLatLng || { lat: 500, lng: 500 },
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
      formData.append('lat', currentLatLng?.lat || 500);
      formData.append('lng', currentLatLng?.lng || 500);

      axios.put(`http://localhost:8080/areas/${areaData.areaId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
        .then(res => console.log("Updated:", res.data))
        .catch(err => console.error("Error updating area:", err));
    } else {
      const newMarker = {
        latlng: currentLatLng || { lat: 500, lng: 500 },
        ...areaData,
      };
      setMarkers(prev => [...prev, newMarker]);
      setModalVisible(false);
      setAreaCounter(prev => prev + 1);

      const formData = new FormData();
      formData.append('areaId', areaData.areaId);
      formData.append('name', areaData.name);
      formData.append('description', areaData.description);
      // const imgFile = new File(["hello"], "example.png", { type: "image/png" });
      formData.append('image', imgFile);
      if (areaData.image) {
        formData.append('image', areaData.image);
      }
      formData.append('lat', currentLatLng?.lat || 500);
      formData.append('lng', currentLatLng?.lng || 500);

      axios.post(`http://localhost:8080/areas/upload`, formData)
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

    axios.delete(`http://localhost:8080/areas/delete/${areaIdToDelete}`)
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

  const handleDiveIn = (areaId, imageUrl) => {
    if (areaId && imageUrl) {
      setSelectedAreaId(areaId);
      setSelectedImageUrl(imageUrl);
      setShowImageView(true);
    }
  };

  const handleBack = () => {
    setShowImageView(false);
    setSelectedAreaId(null);
    setSelectedImageUrl(null);
    setAddShelterMode(false);
    setPopupVisible(false);
  };

  const handleImageClick = (e) => {
    if (addShelterMode) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const lat = (y / rect.height) * 1000;
      const lng = (x / rect.width) * 1000;
      setCurrentLatLng({ lat, lng });
      setPopupPosition({ x: e.clientX, y: e.clientY });
      setPopupVisible(true);
      setShelterData({
        areaId: selectedAreaId,
        shelterId: `shelter-${areaCounter}`,
        name: '',
        floor: '',
        status: '',
        accessibility: '',
        capacity: '',
        description: '',
        imageUrl: selectedImageUrl,
      });
    }
  };

  const handleAddShelterClick = () => {
    setAddShelterMode(prev => !prev);
    if (popupVisible) {
      setPopupVisible(false);
    }
  };

  const handleSaveShelter = () => {
    const newMarker = {
      latlng: currentLatLng || { lat: 500, lng: 500 },
      shelterId: shelterData.shelterId,
      ...shelterData,
    };
    setMarkers(prev => [...prev, newMarker]);
    setPopupVisible(false);
    setAddShelterMode(false);
    setAreaCounter(prev => prev + 1);

    const formData = new URLSearchParams();
    formData.append('area_id', shelterData.areaId);
    formData.append('name', shelterData.name);
    formData.append('floor', shelterData.floor);
    formData.append('status', shelterData.status);
    formData.append('accessibility', shelterData.accessibility);
    formData.append('capacity', shelterData.capacity);
    formData.append('description', shelterData.description);
    formData.append('lat', newMarker.latlng.lat);
    formData.append('lng', newMarker.latlng.lng);

    axios.post("http://localhost:8080/shelters/add", formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
      .then(res => console.log("Saved shelter:", res.data))
      .catch(err => console.error("Error saving shelter:", err));
  };

  return (
    <>
      <h1 className="app-title">Welcome to Shelter API</h1>

      {!showImageView && (
        <ShelterList
          markers={markers}
          onModifyClick={handleMarkerClick}
          onDiveClick={handleDiveIn}
          selectedAreaId={selectedAreaId}
        />
      )}

      {!showImageView ? (
        <div className="map-container">
         <button
          onClick={() => setAddMode(!addMode)}
          className={`add-area-button ${addMode ? 'active' : ''}`}
          >
          {addMode ? 'Cancel Add Mode' : 'Add New Area'}
        </button>

        <MarkersLayer
          imageUrl={imageUrl}
          markers={markers}
          defaultIcon={defaultIcon}
          handleMarkerClick={handleMarkerClick}
          handleMarkerDragEnd={handleMarkerDragEnd}
          handleAddClick={handleAddClick}
          addMode={addMode}
          imageBounds={imageBounds}
          mapRef={mapRef}
        />
      </div>

      ) : (
        <div style={{ position: 'relative' }}>
          <ImageViewWithShelters
            markers={markers}
            imageUrl={selectedImageUrl}
            onImageClick={handleImageClick}
            addShelterMode={addShelterMode}
            onAddShelterClick={handleAddShelterClick}
            areaId={selectedAreaId}
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
              areaId={selectedAreaId}
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