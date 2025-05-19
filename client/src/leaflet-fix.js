import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Remove the default method Leaflet uses to get icon URLs
delete L.Icon.Default.prototype._getIconUrl;

// Manually set the correct paths to the marker icons from the Leaflet package
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});
