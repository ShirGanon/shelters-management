import React, { useEffect, useState } from 'react';
import { MapContainer, ImageOverlay, Marker, useMapEvents, Polygon } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

const imageBounds = [[0, 0], [1000, 1000]];

const buildings = [
  { id: 1, name: "בניין 8", polygon: [[489, 1], [557, 0], [555, 32], [490, 31], [490, 15]] },
  { id: 2, name: "בניין 7", polygon: [[243, 184], [223, 188], [223, 222], [242, 224]] },
  { id: 3, name: "בניין 6", polygon: [[167, 248], [193, 207], [213, 207], [211, 266]] },
  { id: 4, name: "בניין 5", polygon: [[110, 188], [105, 277], [128, 280], [127, 188]] },
  { id: 5, name: "בניין 4", polygon: [[125, 360], [125, 393], [144, 393], [143, 361]] },
  { id: 6, name: "בניין 3", polygon: [[50, 354], [52, 404], [85, 413], [91, 356]] },
  { id: 7, name: "בניין 2", polygon: [[57, 426], [60, 468], [87, 469], [89, 426]] },
  { id: 8, name: "בניין 1", polygon: [[66, 498], [69, 551], [93, 552], [93, 499]] },
  { id: 9, name: "מעונות סטודנטים", polygon: [[218, 230], [218, 324], [268, 325], [269, 227]] }
];

const pointInPolygon = (point, vs) => {
  const x = point[0], y = point[1];
  let inside = false;
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const xi = vs[i][0], yi = vs[i][1];
    const xj = vs[j][0], yj = vs[j][1];
    const intersect = ((yi > y) !== (yj > y)) &&
      (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
};

const AddMarkerOnClick = ({ onAddClick, enableAdd }) => {
  useMapEvents({
    click(e) {
      if (!enableAdd) return;
      const point = [e.latlng.lat, e.latlng.lng];
      const inside = buildings.some(building => pointInPolygon(point, building.polygon));
      if (inside) {
        onAddClick(e.latlng);
      } else {
        alert('הנקודה מחוץ לפוליגון של בניין.');
      }
    }
  });
  return null;
};

const Modal = ({ visible, onClose, onSave, markerData, setMarkerData }) => {
  if (!visible) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMarkerData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
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
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        width: '300px',
        maxHeight: '80vh',
        overflowY: 'auto',
        direction: 'rtl',
        fontFamily: 'inherit'
      }}>
        <h3 style={{ textAlign: 'center' }}>פרטי מקלט</h3>

        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="status">סטטוס:</label><br />
          <select
            id="status"
            name="status"
            value={markerData.status}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '6px' }}
          >
            <option value="">בחר סטטוס</option>
            <option value="פתוח">פתוח</option>
            <option value="סגור">סגור</option>
            <option value="בשיפוץ">בשיפוץ</option>
          </select>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="capacity">קיבולת:</label><br />
          <input
            id="capacity"
            type="number"
            name="capacity"
            value={markerData.capacity}
            onChange={handleChange}
            min="1"
            required
            style={{ width: '100%', padding: '6px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="accessible">
            <input
              type="checkbox"
              name="accessible"
              checked={markerData.accessible}
              onChange={handleChange}
              style={{ marginLeft: '5px' }}
            />
            נגיש
          </label>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="notes">הערות:</label><br />
          <textarea
            id="notes"
            name="notes"
            value={markerData.notes}
            onChange={handleChange}
            maxLength={2000}
            rows={4}
            style={{ width: '100%', padding: '6px' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button type="submit" style={{ padding: '8px 12px' }}>שמור</button>
          <button type="button" onClick={onClose} style={{ padding: '8px 12px' }}>ביטול</button>
        </div>
      </form>
    </div>
  );
};

const MapView = ({ imageUrl, area }) => {
  const [markers, setMarkers] = useState([]);
  const [enableAdd, setEnableAdd] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentLatLng, setCurrentLatLng] = useState(null);
  const [markerData, setMarkerData] = useState({
    status: '',
    capacity: '',
    accessible: false,
    notes: '',
  });

  useEffect(() => {
    axios
      .get(`http://localhost:8080/shelters/area/${area}`)
      .then((res) => setMarkers(res.data || []))
      .catch(() => setMarkers([]));
  }, [area]);

  const handleAddClick = (latlng) => {
    setCurrentLatLng(latlng);
    setMarkerData({
      status: '',
      capacity: '',
      accessible: false,
      notes: '',
    });
    setModalVisible(true);
  };

  const handleSave = () => {
    const newMarker = {
      latlng: currentLatLng,
      ...markerData,
    };

    setMarkers(prev => [...prev, newMarker]);
    setModalVisible(false);

    axios.post("http://localhost:8080/shelters/add", {
      name: "New Shelter",
      capacity: markerData.capacity,
      status: markerData.status,
      accessibility: markerData.accessible ? "yes" : "no",
      lat: currentLatLng.lat,
      lng: currentLatLng.lng,
      area_id: area,
    }).then(res => console.log("Saved:", res.data))
      .catch(err => console.error("Error:", err));
  };

  return (
    <div>
      <button
        onClick={() => setEnableAdd(!enableAdd)}
        style={{
          margin: '10px',
          padding: '8px 16px',
          backgroundColor: enableAdd ? '#4CAF50' : '#f0f0f0',
          color: enableAdd ? 'white' : 'black',
          border: '1px solid #ccc',
          cursor: 'pointer',
          borderRadius: '4px',
        }}
      >
        {enableAdd ? 'מצב הוספת מקלטים פעיל - לחץ כדי לכבות' : 'הפעל הוספת מקלטים'}
      </button>

      <MapContainer
        crs={L.CRS.Simple}
        bounds={imageBounds}
        style={{ height: '600px', width: '90vw' }}
        minZoom={-2}
      >
        <ImageOverlay url={imageUrl} bounds={imageBounds} />

        {buildings.map(({ id, polygon }) => (
          <Polygon
            key={id}
            positions={polygon}
            pathOptions={{ color: 'blue', fillOpacity: 0.2 }}
          />
        ))}

        <AddMarkerOnClick onAddClick={handleAddClick} enableAdd={enableAdd} />

        {markers.map((marker, i) => (
          <Marker key={i} position={marker.latlng || { lat: marker.lat, lng: marker.lng }} />
        ))}
      </MapContainer>

      <Modal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
        markerData={markerData}
        setMarkerData={setMarkerData}
      />
    </div>
  );
};

export default MapView;
