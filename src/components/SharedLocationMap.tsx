import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Bus } from '@/types/transport';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/enhanced-button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Maximize2 } from 'lucide-react';

interface GoogleMapsProps {
  buses: Bus[];
}

const GOOGLE_MAPS_API_KEY = 'AIzaSyAOVYRIgupAurZup5y1PRh8Ismb1A3lLao';

const GoogleMapsComponent: React.FC<GoogleMapsProps> = ({ buses }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  const activeBuses = buses.filter(bus => bus.status === 'active');
  const [selectedBus, setSelectedBus] = useState<Bus | null>(activeBuses[0] || null);

  const getStatusColor = (status: Bus['status']) => {
    switch (status) {
      case 'active': return 'success';
      case 'delayed': return 'warning';
      case 'inactive': return 'destructive';
      default: return 'secondary';
    }
  };

  const getMarkerColor = (status: Bus['status']) => {
    switch (status) {
      case 'active': return '#22c55e';
      case 'delayed': return '#eab308';
      case 'inactive': return '#ef4444';
      default: return '#6b7280';
    }
  };

  useEffect(() => {
    const initializeMap = async () => {
      if (!mapRef.current) return;

      try {
        const loader = new Loader({
          apiKey: GOOGLE_MAPS_API_KEY,
          version: 'weekly',
          libraries: ['places']
        });

        await loader.load();

        const mapOptions: google.maps.MapOptions = {
          center: { lat: 40.7589, lng: -73.9851 },
          zoom: 13,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          styles: [
            {
              featureType: 'all',
              elementType: 'geometry.fill',
              stylers: [{ weight: '2.00' }]
            },
            {
              featureType: 'all',
              elementType: 'geometry.stroke',
              stylers: [{ color: '#9c9c9c' }]
            }
          ]
        };

        mapInstanceRef.current = new google.maps.Map(mapRef.current, mapOptions);
        setMapLoaded(true);
      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };

    initializeMap();
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Only create marker for selected bus
    if (selectedBus) {
      const marker = new google.maps.Marker({
        position: { lat: selectedBus.location.lat, lng: selectedBus.location.lng },
        map: mapInstanceRef.current,
        title: `${selectedBus.number} - ${selectedBus.route}`,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: getMarkerColor(selectedBus.status),
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 3
        }
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 8px;">
            <h4 style="margin: 0 0 4px 0; font-weight: bold;">${selectedBus.number}</h4>
            <p style="margin: 0 0 2px 0; font-size: 14px;">Route: ${selectedBus.route}</p>
            <p style="margin: 0 0 2px 0; font-size: 14px;">Driver: ${selectedBus.driver}</p>
            <p style="margin: 0; font-size: 12px; color: ${getMarkerColor(selectedBus.status)};">Status: ${selectedBus.status}</p>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(mapInstanceRef.current, marker);
      });

      markersRef.current.push(marker);

      // Center map on selected bus
      mapInstanceRef.current.setCenter({ lat: selectedBus.location.lat, lng: selectedBus.location.lng });
      mapInstanceRef.current.setZoom(15);
    }
  }, [selectedBus, mapLoaded]);

  if (activeBuses.length === 0) {
    return (
      <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
        <div className="text-center">
          <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No active buses available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Bus Selection */}
      <div className="flex flex-wrap gap-2">
        {activeBuses.map((bus) => (
          <Button
            key={bus.id}
            variant={selectedBus?.id === bus.id ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setSelectedBus(bus);
            }}
            className="flex items-center space-x-2"
          >
            <div 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: getMarkerColor(bus.status) }}
            />
            <span>{bus.number}</span>
            <Badge variant={getStatusColor(bus.status)} className="text-xs">
              {bus.status}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Google Maps */}
      <Card className="shadow-card-soft">
        <CardContent className="p-0">
          <div className="bg-gradient-primary text-primary-foreground p-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5" />
                <div>
                  <h3 className="font-semibold">{selectedBus ? `Bus ${selectedBus.number}` : 'Live Bus Tracking'}</h3>
                  <p className="text-sm opacity-90">{selectedBus ? `Route: ${selectedBus.route}` : `${activeBuses.length} active buses`}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="text-primary-foreground hover:bg-white/20"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className={`relative ${isFullscreen ? 'h-[70vh]' : 'h-96'}`}>
            <div ref={mapRef} className="w-full h-full rounded-b-lg" />
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">
            <strong>Live Tracking:</strong> Click on bus markers to see details or use the bus buttons above to center the map on a specific bus.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleMapsComponent;