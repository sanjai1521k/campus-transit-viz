import React, { useState, useEffect } from 'react';
import { Bus, Plus, Edit3, Trash2, Settings, LogOut, Bell, Users, MapPin, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/enhanced-button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { mockBuses, mockNotifications } from '@/data/mockData';
import { Bus as BusType, Notification } from '@/types/transport';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [buses, setBuses] = useState<BusType[]>(mockBuses);
  const [notifications] = useState<Notification[]>(mockNotifications);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingBus, setEditingBus] = useState<BusType | null>(null);
  const [newBus, setNewBus] = useState({
    number: '',
    route: '',
    driver: '',
    capacity: 45,
    status: 'inactive' as BusType['status']
  });

  const handleAddBus = () => {
    const bus: BusType = {
      id: Math.random().toString(36).substr(2, 9),
      number: newBus.number,
      route: newBus.route,
      driver: newBus.driver,
      location: { lat: 40.7589, lng: -73.9851 },
      status: newBus.status,
      capacity: newBus.capacity,
      occupancy: 0,
      lastUpdated: new Date()
    };

    setBuses([...buses, bus]);
    toast({
      title: "Bus Added",
      description: `${bus.number} has been added to the fleet.`,
      variant: "default",
    });
    
    setNewBus({ number: '', route: '', driver: '', capacity: 45, status: 'inactive' });
    setIsAddDialogOpen(false);
  };

  const handleEditBus = (bus: BusType) => {
    setEditingBus(bus);
    setNewBus({
      number: bus.number,
      route: bus.route,
      driver: bus.driver,
      capacity: bus.capacity,
      status: bus.status
    });
  };

  const handleUpdateBus = () => {
    if (!editingBus) return;

    setBuses(buses.map(bus => 
      bus.id === editingBus.id 
        ? { ...bus, ...newBus, lastUpdated: new Date() }
        : bus
    ));

    toast({
      title: "Bus Updated",
      description: `${newBus.number} has been updated successfully.`,
      variant: "default",
    });

    setEditingBus(null);
    setNewBus({ number: '', route: '', driver: '', capacity: 45, status: 'inactive' });
  };

  const handleDeleteBus = (busId: string) => {
    setBuses(buses.filter(bus => bus.id !== busId));
    toast({
      title: "Bus Removed",
      description: "Bus has been removed from the fleet.",
      variant: "destructive",
    });
  };

  const handleStatusChange = (busId: string, newStatus: BusType['status']) => {
    setBuses(buses.map(bus => 
      bus.id === busId 
        ? { ...bus, status: newStatus, lastUpdated: new Date() }
        : bus
    ));

    toast({
      title: "Status Updated",
      description: `Bus status changed to ${newStatus}.`,
      variant: "default",
    });
  };

  const getStatusColor = (status: BusType['status']) => {
    switch (status) {
      case 'active': return 'success';
      case 'delayed': return 'warning';
      case 'inactive': return 'destructive';
      default: return 'secondary';
    }
  };

  const getBusStats = () => {
    const active = buses.filter(bus => bus.status === 'active').length;
    const delayed = buses.filter(bus => bus.status === 'delayed').length;
    const inactive = buses.filter(bus => bus.status === 'inactive').length;
    const totalOccupancy = buses.reduce((sum, bus) => sum + bus.occupancy, 0);
    const totalCapacity = buses.reduce((sum, bus) => sum + bus.capacity, 0);

    return { active, delayed, inactive, totalOccupancy, totalCapacity };
  };

  const stats = getBusStats();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-secondary text-secondary-foreground shadow-bus">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Settings className="h-8 w-8" />
              <div>
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
                <p className="text-sm opacity-90">Fleet Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="text-secondary-foreground hover:bg-white/20">
                <Bell className="h-5 w-5" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={logout}
                className="text-secondary-foreground hover:bg-white/20"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card-soft">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-success/10 rounded-lg">
                  <Bus className="h-6 w-6 text-success" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Active Buses</p>
                  <p className="text-2xl font-bold text-success">{stats.active}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card-soft">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <Clock className="h-6 w-6 text-warning" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Delayed</p>
                  <p className="text-2xl font-bold text-warning">{stats.delayed}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card-soft">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-destructive/10 rounded-lg">
                  <MapPin className="h-6 w-6 text-destructive" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Inactive</p>
                  <p className="text-2xl font-bold text-destructive">{stats.inactive}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card-soft">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Occupancy</p>
                  <p className="text-2xl font-bold text-primary">
                    {Math.round((stats.totalOccupancy / stats.totalCapacity) * 100)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bus Management */}
          <div className="lg:col-span-2">
            <Card className="shadow-card-soft">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Fleet Management</CardTitle>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="gradient">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Bus
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Bus</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="busNumber">Bus Number</Label>
                        <Input
                          id="busNumber"
                          value={newBus.number}
                          onChange={(e) => setNewBus({...newBus, number: e.target.value})}
                          placeholder="BUS-005"
                        />
                      </div>
                      <div>
                        <Label htmlFor="route">Route</Label>
                        <Input
                          id="route"
                          value={newBus.route}
                          onChange={(e) => setNewBus({...newBus, route: e.target.value})}
                          placeholder="Campus Loop"
                        />
                      </div>
                      <div>
                        <Label htmlFor="driver">Driver Name</Label>
                        <Input
                          id="driver"
                          value={newBus.driver}
                          onChange={(e) => setNewBus({...newBus, driver: e.target.value})}
                          placeholder="Driver Name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="capacity">Capacity</Label>
                        <Input
                          id="capacity"
                          type="number"
                          value={newBus.capacity}
                          onChange={(e) => setNewBus({...newBus, capacity: parseInt(e.target.value)})}
                        />
                      </div>
                      <Button onClick={handleAddBus} className="w-full" variant="gradient">
                        Add Bus
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {buses.map((bus) => (
                    <div key={bus.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-semibold">{bus.number}</h3>
                          <Badge variant={getStatusColor(bus.status)}>
                            {bus.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{bus.route}</p>
                        <p className="text-sm text-muted-foreground">Driver: {bus.driver}</p>
                        <p className="text-sm text-muted-foreground">
                          Occupancy: {bus.occupancy}/{bus.capacity} 
                          ({Math.round((bus.occupancy / bus.capacity) * 100)}%)
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Select
                          value={bus.status}
                          onValueChange={(value: BusType['status']) => handleStatusChange(bus.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="delayed">Delayed</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEditBus(bus)}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDeleteBus(bus.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notifications */}
          <div>
            <Card className="shadow-card-soft">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-accent" />
                  <span>Recent Alerts</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg border ${
                        notification.read ? 'bg-muted/30' : 'bg-card'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          notification.type === 'warning' ? 'bg-warning' :
                          notification.type === 'error' ? 'bg-destructive' :
                          notification.type === 'success' ? 'bg-success' :
                          'bg-primary'
                        }`} />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{notification.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {notification.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Bus Dialog */}
      {editingBus && (
        <Dialog open={!!editingBus} onOpenChange={() => setEditingBus(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Bus: {editingBus.number}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="editBusNumber">Bus Number</Label>
                <Input
                  id="editBusNumber"
                  value={newBus.number}
                  onChange={(e) => setNewBus({...newBus, number: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="editRoute">Route</Label>
                <Input
                  id="editRoute"
                  value={newBus.route}
                  onChange={(e) => setNewBus({...newBus, route: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="editDriver">Driver Name</Label>
                <Input
                  id="editDriver"
                  value={newBus.driver}
                  onChange={(e) => setNewBus({...newBus, driver: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="editCapacity">Capacity</Label>
                <Input
                  id="editCapacity"
                  type="number"
                  value={newBus.capacity}
                  onChange={(e) => setNewBus({...newBus, capacity: parseInt(e.target.value)})}
                />
              </div>
              <Button onClick={handleUpdateBus} className="w-full" variant="transport">
                Update Bus
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminDashboard;