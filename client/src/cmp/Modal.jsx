const Modal = ({ visible, onClose, onSave, onDelete, areaData, setAreaData, isEdit }) => {
  if (!visible) return null;

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files.length > 0) {
      setAreaData(prev => ({ 
        ...prev, 
        image: files[0], 
        imageUrl: URL.createObjectURL(files[0]),
        imageName: files[0].name // Store filename for display
      }));
    } else {
      setAreaData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required image for new areas
    if (!isEdit && !areaData.image) {
      alert('Please select an image for the area.');
      return;
    }
    
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
          Upload Image: {!isEdit && <span style={{ color: 'red' }}>*</span>}
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            required={!isEdit} // Required only for new areas
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
              border: !isEdit && !areaData.image ? '2px dashed #e74c3c' : '2px dashed grey',
              borderRadius: '8px',
              backgroundColor: '#fafafa',
              color: !isEdit && !areaData.image ? '#e74c3c' : '#666',
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
              fill={!isEdit && !areaData.image ? '#e74c3c' : '#666'}
              style={{ marginRight: '8px' }}
              aria-hidden="true"
            >
              <path d="M5 20h14v-2H5v2zm7-18L5.33 9h3.84v4H10v-4h4v4h1.83v-4h3.84L12 2z" />
            </svg>
            {!isEdit && !areaData.image 
              ? 'Required: Click or Drag to Upload Image' 
              : 'Click or Drag to Upload Image'
            }
          </label>
          
          {/* Show validation message for new areas without image */}
          {!isEdit && !areaData.image && (
            <div style={{
              marginTop: '5px',
              fontSize: '0.85rem',
              color: '#e74c3c',
              fontStyle: 'italic'
            }}>
              Image is required for new areas
            </div>
          )}
          
          {areaData.image && (
            <div
              style={{
                marginTop: '8px',
                fontStyle: 'italic',
                color: '#28a745',
                fontSize: '0.9rem',
                overflowWrap: 'break-word',
                maxWidth: '100%',
              }}
            >
              ✓ Selected file: {areaData.image.name}
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
              disabled={!isEdit && !areaData.image} // Disable save button if no image for new areas
              style={{
                backgroundColor: (!isEdit && !areaData.image) ? '#ccc' : '#4a90e2',
                color: 'white',
                padding: '8px 18px',
                border: 'none',
                borderRadius: '6px',
                cursor: (!isEdit && !areaData.image) ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                boxShadow: (!isEdit && !areaData.image) ? 'none' : '0 2px 6px rgba(74,144,226,0.5)',
                width: '100%',
                transition: 'background-color 0.3s ease',
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

export default Modal;