import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in React-Leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  initialLocation?: { lat: number; lng: number };
  height?: string;
}

// Component to handle map clicks
const LocationSelector = ({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click: (e) => {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

// Component to update map view when location changes
const MapUpdater = ({ location }: { location: { lat: number; lng: number } }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([location.lat, location.lng], 13);
  }, [location, map]);
  return null;
};

export const LocationPicker: React.FC<LocationPickerProps> = ({ 
  onLocationSelect, 
  initialLocation = { lat: 14.5995, lng: 120.9842 }, // Manila default
  height = '300px' 
}) => {
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [address, setAddress] = useState('Loading address...');

  // Reverse geocoding function (using Nominatim API)
  const getAddressFromCoords = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      if (data.display_name) {
        setAddress(data.display_name);
        onLocationSelect(lat, lng, data.display_name);
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      setAddress('Address not found');
      onLocationSelect(lat, lng, `${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    }
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
    getAddressFromCoords(lat, lng);
  };

  // Get initial address
  useEffect(() => {
    getAddressFromCoords(initialLocation.lat, initialLocation.lng);
  }, []);

  return (
    <div className="space-y-2">
      <div className="text-sm text-gray-600">
        <strong>Selected Location:</strong> {address}
      </div>
      <div 
        className="rounded-lg overflow-hidden border border-gray-300"
        style={{ height }}
      >
        <MapContainer
          center={[selectedLocation.lat, selectedLocation.lng]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[selectedLocation.lat, selectedLocation.lng]} />
          <LocationSelector onLocationSelect={handleLocationSelect} />
          <MapUpdater location={selectedLocation} />
        </MapContainer>
      </div>
      <div className="text-xs text-gray-500">
        Click on the map to set project location
      </div>
    </div>
  );
};
