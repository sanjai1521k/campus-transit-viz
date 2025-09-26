import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Users, Navigation, Bell, LogOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/enhanced-button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { mockBuses, mockRoutes, generateArrivalTimes, updateBusLocation } from '@/data/mockData';
import { Bus, Route, Stop } from '@/types/transport';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const [buses, setBuses] = useState<Bus[]>(mockBuses);
  const [routes] = useState<Route[]>(mockRoutes);
  const [selectedRoute, setSelectedRoute] = useState<Route>(routes[0]);
  const [routeStops, setRouteStops] = useState<Stop[]>([]);

  // Simulate bus movement and route updates
  useEffect(() => {
    const interval = setInterval(() => {
      setBuses(prevBuses => 
        prevBuses.map(bus => updateBusLocation(bus))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Update route stops with arrival times
  useEffect(() => {
    setRouteStops(generateArrivalTimes(selectedRoute.stops));
  }, [selectedRoute]);

  const getStatusColor = (status: Bus['status']) => {
    switch (status) {
      case 'active': return 'success';
      case 'delayed': return 'warning';
      case 'inactive': return 'destructive';
      default: return 'secondary';
    }
  };

  const getOccupancyColor = (occupancy: number, capacity: number) => {
    const percentage = (occupancy / capacity) * 100;
    if (percentage > 80) return 'text-destructive';
    if (percentage > 60) return 'text-warning';
    return 'text-success';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary text-primary-foreground shadow-bus">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <MapPin className="h-8 w-8" />
              <div>
                <h1 className="text-xl font-bold">Campus Transport</h1>
                <p className="text-sm opacity-90">Welcome, {user?.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-white/20">
                <Bell className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={logout}
                className="text-primary-foreground hover:bg-white/20"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <Card className="shadow-card-soft">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Navigation className="h-5 w-5 text-primary" />
                  <span>Live Bus Tracking</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-lg h-96 flex items-center justify-center relative overflow-hidden">
                  {/* Mock Map Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5">
                    <div className="absolute inset-0 opacity-20">
                      <div className="grid grid-cols-6 h-full">
                        {Array.from({ length: 24 }).map((_, i) => (
                          <div key={i} className="border border-muted-foreground/20" />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Mock Bus Icons */}
                  {buses.filter(bus => bus.status === 'active').map((bus, index) => (
                    <div
                      key={bus.id}
                      className="absolute animate-pulse-soft"
                      style={{
                        left: `${20 + index * 15}%`,
                        top: `${30 + index * 10}%`,
                      }}
                    >
                      <div className="bg-bus-indicator p-3 rounded-full shadow-bus">
                        <MapPin className="h-6 w-6 text-white" />
                      </div>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                        <Badge variant="secondary" className="text-xs">
                          {bus.number}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  
                  {/* Map Legend */}
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
              </CardContent>
            </Card>
          </div>

          {/* Route Info & Bus List */}
          <div className="space-y-6">
            {/* Route Selection */}
            <Card className="shadow-card-soft">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-secondary" />
                  <span>Select Route</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {routes.map((route) => (
                    <Button
                      key={route.id}
                      variant={selectedRoute.id === route.id ? "gradient" : "outline"}
                      className="w-full justify-start"
                      onClick={() => setSelectedRoute(route)}
                    >
                      <div 
                        className="w-3 h-3 rounded-full mr-3"
                        style={{ backgroundColor: route.color }}
                      />
                      {route.name}
                      <Badge variant="secondary" className="ml-auto">
                        {route.estimatedDuration}min
                      </Badge>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Route Stops */}
            <Card className="shadow-card-soft">
              <CardHeader>
                <CardTitle>Upcoming Stops</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {routeStops.map((stop, index) => (
                    <div
                      key={stop.id}
                      className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                        stop.isActive ? 'bg-primary/10 border border-primary/20' : 'bg-muted/50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          stop.isActive ? 'bg-primary animate-pulse' : 'bg-muted-foreground/50'
                        }`} />
                        <span className={`font-medium ${
                          stop.isActive ? 'text-primary' : 'text-foreground'
                        }`}>
                          {stop.name}
                        </span>
                      </div>
                      <Badge variant={stop.isActive ? "default" : "secondary"}>
                        {stop.estimatedArrival}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Bus Status */}
            <Card className="shadow-card-soft">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-accent" />
                  <span>Active Buses</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {buses.map((bus) => (
                    <div key={bus.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">{bus.number}</p>
                        <p className="text-sm text-muted-foreground">{bus.route}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={getStatusColor(bus.status)}>
                          {bus.status}
                        </Badge>
                        <p className={`text-sm mt-1 ${getOccupancyColor(bus.occupancy, bus.capacity)}`}>
                          {bus.occupancy}/{bus.capacity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;