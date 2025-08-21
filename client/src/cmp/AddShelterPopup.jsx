const AddShelterPopup = ({ visible, position, onClose, onSave, shelterData, setShelterData, areaId, areaImageUrl, isEdit = false }) => {
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
    <div 
      className="shelter-form" 
      style={{ 
        position: 'absolute',
        top: position.y, 
        left: position.x, 
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        zIndex: 10000,
        minWidth: '300px',
        maxWidth: '400px',
      }}
    >
      <form onSubmit={handleSubmit}>
        <h3 style={{ marginBottom: '15px', color: '#222' }}>
          {isEdit ? 'Edit Shelter Details' : 'Add New Shelter'}
        </h3>
        <label style={{ display: 'block', marginBottom: '10px' }}>
          <span style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Area ID:</span>
          <input
            type="text"
            name="areaId"
            value={shelterData.areaId}
            readOnly
            disabled
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontSize: '14px',
              backgroundColor: '#f5f5f5',
              color: '#666',
            }}
          />
        </label>

        <label style={{ display: 'block', marginBottom: '10px' }}>
          <span style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
            Shelter Name: <span style={{ color: 'red' }}>*</span>
          </span>
          <input
            type="text"
            name="name"
            value={shelterData.name || ''}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontSize: '14px',
            }}
          />
        </label>

        <label style={{ display: 'block', marginBottom: '10px' }}>
          <span style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Shelter ID:</span>
          <input
            type="text"
            name="shelterId"
            value={shelterData.shelterId || ''}
            onChange={handleChange}
            required={!isEdit}
            readOnly={isEdit}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontSize: '14px',
              backgroundColor: isEdit ? '#f5f5f5' : 'white',
              color: isEdit ? '#666' : 'black',
            }}
          />
        </label>

        <label style={{ display: 'block', marginBottom: '10px' }}>
          <span style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Floor:</span>
          <input
            type="text"
            name="floor"
            value={shelterData.floor || ''}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontSize: '14px',
            }}
          />
        </label>

        <label style={{ display: 'block', marginBottom: '10px' }}>
          <span style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
            Status: <span style={{ color: 'red' }}>*</span>
          </span>
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
            }}
          >
            <option value="">Select status...</option>
            <option value="Available">Available</option>
            <option value="Fully Occupied">Fully Occupied</option>
            <option value="Under Renovation">Under Renovation</option>
          </select>
        </label>

        <label style={{ display: 'block', marginBottom: '10px' }}>
          <span style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Accessibility:</span>
          <input
            type="text"
            name="accessibility"
            value={shelterData.accessibility || ''}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontSize: '14px',
            }}
          />
        </label>

        <label style={{ display: 'block', marginBottom: '10px' }}>
          <span style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
            Capacity: <span style={{ color: 'red' }}>*</span>
          </span>
          <input
            type="number"
            name="capacity"
            value={shelterData.capacity || ''}
            onChange={handleChange}
            required
            min="1"
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontSize: '14px',
            }}
          />
        </label>

        <label style={{ display: 'block', marginBottom: '15px' }}>
          <span style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Description:</span>
          <textarea
            name="description"
            value={shelterData.description || ''}
            onChange={handleChange}
            rows={2}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontSize: '14px',
              resize: 'vertical',
            }}
          />
        </label>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
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
            {isEdit ? 'Update Shelter' : 'Save Shelter'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddShelterPopup;