import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const PlacesMap = ({ locations, center }) => {
    return (
        <MapContainer
            center={center}
            zoom={13}
            style={{ height: '500px', width: '100%' }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {locations.map((location, index) => (
                <Marker
                    key={index}
                    position={[location.latitude, location.longitude]}
                >
                    <Popup>
                        <strong>{location.name}</strong>
                        <br />
                        {location.address}
                        <br />
                        Distance: {location.distance}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default PlacesMap;
