import { useMapEvents } from 'react-leaflet';

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

export default AddMarkerOnClick;