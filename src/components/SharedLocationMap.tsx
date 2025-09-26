import React, { useState } from 'react';
import { Bus } from '@/types/transport';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/enhanced-button';
import { Badge } from '@/components/ui/badge';
import { MapPin, ExternalLink, Maximize2 } from 'lucide-react';

interface SharedLocationMapProps {
  buses: Bus[];
}

const SharedLocationMap: React.FC<SharedLocationMapProps> = ({ buses }) => {
  const [selectedBus, setSelectedBus] = useState<Bus | null>(
    buses.find(bus => bus.status === 'active') || buses[0] || null
  );
  const [isFullscreen, setIsFullscreen] = useState(false);

  const activeBuses = buses.filter(bus => bus.status === 'active' && bus.sharedLocationUrl);

  const getStatusColor = (status: Bus['status']) => {
    switch (status) {
      case 'active': return 'success';
      case 'delayed': return 'warning';
      case 'inactive': return 'destructive';
      default: return 'secondary';
    }
  };

  const openInGoogleMaps = (url: string) => {
    window.open(url, '_blank');
  };

  if (activeBuses.length === 0) {
    return (
      <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
        <div className="text-center">
          <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No active buses with shared locations available</p>
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
            onClick={() => setSelectedBus(bus)}
            className="flex items-center space-x-2"
          >
            <div 
              className="w-2 h-2 rounded-full"
              style={{ 
                backgroundColor: bus.status === 'active' ? '#22c55e' : 
                               bus.status === 'delayed' ? '#eab308' : '#ef4444'
              }}
            />
            <span>{bus.number}</span>
            <Badge variant={getStatusColor(bus.status)} className="text-xs">
              {bus.status}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Selected Bus Location */}
      {selectedBus && selectedBus.sharedLocationUrl && (
        <Card className="shadow-card-soft">
          <CardContent className="p-0">
            <div className="bg-gradient-primary text-primary-foreground p-4 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5" />
                  <div>
                    <h3 className="font-semibold">Bus {selectedBus.number}</h3>
                    <p className="text-sm opacity-90">Route: {selectedBus.route}</p>
                    <p className="text-xs opacity-75">Driver: {selectedBus.driver}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="text-primary-foreground hover:bg-white/20"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openInGoogleMaps(selectedBus.sharedLocationUrl!)}
                    className="text-primary-foreground hover:bg-white/20"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className={`relative ${isFullscreen ? 'h-[70vh]' : 'h-96'}`}>
              <iframe
                src={selectedBus.sharedLocationUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-b-lg"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">
            <strong>Live Location:</strong> Click on any bus above to view its real-time shared location. 
            Use the external link button to open the full Google Maps view.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SharedLocationMap;