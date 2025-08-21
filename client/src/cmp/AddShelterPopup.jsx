const AddShelterPopup = ({ visible, position, onClose, onSave, shelterData, setShelterData, areaId, areaImageUrl }) => {
  if (!visible) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShelterData(prev => ({
      ...prev,
      [name]: value,
      areaId,
      imageUrl: areaImageUrl,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Additional validation for required fields
    if (!shelterData.name || !shelterData.status || !shelterData.capacity) {
      alert('Please fill in all required fields: Shelter Name, Status, and Capacity.');
      return;
    }
    
    onSave();
  };

  return (
    <div className="shelter-form" style={{ top: position.y, left: position.x, transform: 'translate(-50%, -50%)' }}>
      <form onSubmit={handleSubmit}>
        <h3>Add New Shelter</h3>
        <label>
          Area ID:
          <input
            type="text"
            name="areaId"
            value={shelterData.areaId}
            readOnly
            disabled
          />
        </label>
        <label>
          Shelter Name: <span style={{ color: 'red' }}>*</span>
          <input
            type="text"
            name="name"
            value={shelterData.name}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontSize: '14px',
              marginTop: '4px',
            }}
          />
        </label>
        <label>
          Shelter ID:
          <input
            type="text"
            name="shelterId"
            value={shelterData.shelterId}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Floor:
          <input
            type="text"
            name="floor"
            value={shelterData.floor}
            onChange={handleChange}
          />
        </label>
        <label>
          Status: <span style={{ color: 'red' }}>*</span>
          <select
            name="status"
            value={shelterData.status || ''}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontSize: '14px',
              backgroundColor: 'white',
              marginTop: '4px',
            }}
          >
            <option value="">Select status...</option>
            <option value="Available">Available</option>
            <option value="Fully Occupied">Fully Occupied</option>
            <option value="Under Renovation">Under Renovation</option>
          </select>
        </label>
        <label>
          Accessibility:
          <input
            type="text"
            name="accessibility"
            value={shelterData.accessibility}
            onChange={handleChange}
          />
        </label>
        <label>
          Capacity: <span style={{ color: 'red' }}>*</span>
          <input
            type="number"
            name="capacity"
            value={shelterData.capacity}
            onChange={handleChange}
            required
            min="1"
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontSize: '14px',
              marginTop: '4px',
            }}
          />
        </label>
        <label>
          Description:
          <textarea
            name="description"
            value={shelterData.description}
            onChange={handleChange}
            rows={2}
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

export default AddShelterPopup;