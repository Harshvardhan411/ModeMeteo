import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icon
const customIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41],
});

// Component to handle map clicks
const MapClickHandler = ({ onLocationSelect }) => {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onLocationSelect(lat, lng);
    },
  });
  return null;
};

const WeatherMap = ({ onLocationSelect, theme, isVisible }) => {
  const [position, setPosition] = useState([20, 0]); // Default center
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get user's current location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPosition([latitude, longitude]);
        },
        (error) => {
          console.log('Geolocation error:', error);
          // Keep default position
        }
      );
    }
  }, []);

  // Adjust zoom level based on screen size
  const getInitialZoom = () => {
    if (window.innerWidth < 640) return 2; // Mobile
    if (window.innerWidth < 1024) return 3; // Tablet
    return 4; // Desktop
  };

  const handleLocationSelect = async (lat, lng) => {
    setSelectedLocation({ lat, lng });
    setIsLoading(true);
    
    // Try to get city name from coordinates (reverse geocoding)
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lng}&limit=1&appid=d9e7cf502f37e5bf0b7510fe50397c88`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          const locationName = `${data[0].name}, ${data[0].country}`;
          onLocationSelect(lat, lng, locationName);
        } else {
          onLocationSelect(lat, lng, `Location (${lat.toFixed(2)}, ${lng.toFixed(2)})`);
        }
      } else {
        onLocationSelect(lat, lng, `Location (${lat.toFixed(2)}, ${lng.toFixed(2)})`);
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      onLocationSelect(lat, lng, `Location (${lat.toFixed(2)}, ${lng.toFixed(2)})`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`w-full h-64 sm:h-80 md:h-96 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border ${theme.borderColor} ${theme.card} backdrop-blur-sm`}>
      <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className={`text-base sm:text-lg font-semibold ${theme.textColor} flex items-center gap-2`}>
          <span className="text-lg sm:text-xl">🗺️</span>
          <span className="hidden sm:inline">Click on the map to get weather</span>
          <span className="sm:hidden">Tap map for weather</span>
        </h3>
        <p className={`text-xs sm:text-sm ${theme.subtextColor} mt-1 hidden sm:block`}>
          Click anywhere on the map to get weather information for that location
        </p>
      </div>
      
      <div className="relative h-48 sm:h-64 md:h-80">
        <MapContainer
          center={position}
          zoom={getInitialZoom()}
          style={{ height: '100%', width: '100%' }}
          className="z-10"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onLocationSelect={handleLocationSelect} />
          
          {selectedLocation && (
            <Marker 
              position={[selectedLocation.lat, selectedLocation.lng]} 
              icon={customIcon}
            >
              <Popup>
                <div className="text-center">
                  <p className="font-semibold text-sm">Selected Location</p>
                  <p className="text-xs text-gray-600">
                    {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                  </p>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
        
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-20">
            <div className="bg-white/90 dark:bg-gray-800/90 rounded-lg px-4 py-3 shadow-lg">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Loading weather...
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherMap; 