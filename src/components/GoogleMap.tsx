import React, { useEffect, useRef, useState } from 'react';
import { Bus } from '@/types/transport';

declare global {
  interface Window {
    google: typeof google;
  }
}

interface GoogleMapProps {
  buses: Bus[];
  center?: { lat: number; lng: number };
  zoom?: number;
}

const GoogleMap: React.FC<GoogleMapProps> = ({ 
  buses, 
  center = { lat: 40.7128, lng: -74.0060 }, // Default to NYC
  zoom = 13 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const checkGoogleMaps = () => {
      if (window.google && window.google.maps) {
        setIsLoaded(true);
        return true;
      }
      return false;
    };

    if (!checkGoogleMaps()) {
      // Wait for Google Maps to load
      const interval = setInterval(() => {
        if (checkGoogleMaps()) {
          clearInterval(interval);
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    // Initialize map
    mapInstanceRef.current = new google.maps.Map(mapRef.current, {
      center,
      zoom,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'transit',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });
  }, [isLoaded, center, zoom]);

  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Add bus markers
    buses.filter(bus => bus.status === 'active').forEach((bus, index) => {
      // Mock coordinates around the center for demo
      const lat = center.lat + (Math.random() - 0.5) * 0.02;
      const lng = center.lng + (Math.random() - 0.5) * 0.02;

      const marker = new google.maps.Marker({
        position: { lat, lng },
        map: mapInstanceRef.current,
        title: `Bus ${bus.number}`,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: bus.status === 'active' ? '#22c55e' : 
                    bus.status === 'delayed' ? '#eab308' : '#ef4444',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2
        }
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div class="p-2">
            <h3 class="font-bold">${bus.number}</h3>
            <p class="text-sm">Route: ${bus.route}</p>
            <p class="text-sm">Status: ${bus.status}</p>
            <p class="text-sm">Occupancy: ${bus.occupancy}/${bus.capacity}</p>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(mapInstanceRef.current, marker);
      });

      markersRef.current.push(marker);
    });
  }, [buses, isLoaded, center]);

  if (!isLoaded) {
    return (
      <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading Google Maps...</p>
          <p className="text-xs text-muted-foreground mt-2">
            Make sure you have added your Google Maps API key
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-96">
      <div ref={mapRef} className="w-full h-full rounded-lg" />
      
      {/* Map Controls */}
      <div className="absolute bottom-4 right-4 bg-card p-3 rounded-lg shadow-md">
        <p className="text-sm font-medium mb-2">Bus Status</p>
        <div className="space-y-1 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success rounded-full"></div>
            <span>Active</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-warning rounded-full"></div>
            <span>Delayed</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-destructive rounded-full"></div>
            <span>Inactive</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleMap;