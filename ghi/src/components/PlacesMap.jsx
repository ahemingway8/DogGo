import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
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

const MapCenterUpdater = ({ center }) => {
    const map = useMap()
    map.setView(center, map.getZoom())
    return null
};

const PlacesMap = ({ locations = [], center }) => {
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

            {/* Update map center dynamically */}
            <MapCenterUpdater center={center} />

            {locations.map((location, index) => (
                <Marker
                    key={index}
                    position={[location.latitude, location.longitude]}
                >
                    <Popup>
                        <strong>{location.name}</strong>
                        <br />
                        {location.address}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    )
};

export default PlacesMap;
