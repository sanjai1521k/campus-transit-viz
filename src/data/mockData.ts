import { Bus, Route, Stop, User, Notification } from '@/types/transport';

// Mock users for demo
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Student User',
    role: 'student',
    email: 'student@college.edu'
  },
  {
    id: '2',
    name: 'Admin User',
    role: 'admin',
    email: 'admin@college.edu'
  }
];

// Mock credentials
export const mockCredentials = {
  student: { email: 'student@college.edu', password: 'student123' },
  admin: { email: 'admin@college.edu', password: 'admin123' }
};

// Mock bus stops around a college campus
export const mockStops: Stop[] = [
  { id: '1', name: 'Main Gate', location: { lat: 40.7589, lng: -73.9851 } },
  { id: '2', name: 'Library', location: { lat: 40.7614, lng: -73.9776 } },
  { id: '3', name: 'Student Center', location: { lat: 40.7505, lng: -73.9934 } },
  { id: '4', name: 'Dormitory A', location: { lat: 40.7647, lng: -73.9753 } },
  { id: '5', name: 'Engineering Building', location: { lat: 40.7549, lng: -73.9840 } },
  { id: '6', name: 'Sports Complex', location: { lat: 40.7682, lng: -73.9688 } },
  { id: '7', name: 'Medical Center', location: { lat: 40.7489, lng: -73.9972 } },
  { id: '8', name: 'Parking Lot C', location: { lat: 40.7701, lng: -73.9624 } }
];

// Mock routes
export const mockRoutes: Route[] = [
  {
    id: '1',
    name: 'Campus Loop',
    stops: [mockStops[0], mockStops[1], mockStops[2], mockStops[4], mockStops[0]],
    estimatedDuration: 25,
    color: '#2563eb'
  },
  {
    id: '2',
    name: 'Dormitory Express',
    stops: [mockStops[0], mockStops[3], mockStops[5], mockStops[7], mockStops[0]],
    estimatedDuration: 20,
    color: '#059669'
  },
  {
    id: '3',
    name: 'Medical Shuttle',
    stops: [mockStops[2], mockStops[6], mockStops[1], mockStops[2]],
    estimatedDuration: 15,
    color: '#dc2626'
  }
];

// Mock buses with simulated movement
export const mockBuses: Bus[] = [
  {
    id: '1',
    number: 'BUS-001',
    route: 'Campus Loop',
    driver: 'John Smith',
    location: { lat: 40.7589, lng: -73.9851 },
    sharedLocationUrl: 'https://maps.app.goo.gl/n7ZdRmduioA2ym1i6',
    status: 'active',
    capacity: 45,
    occupancy: 32,
    lastUpdated: new Date()
  },
  {
    id: '2',
    number: 'BUS-002',
    route: 'Dormitory Express',
    driver: 'Sarah Johnson',
    location: { lat: 40.7614, lng: -73.9776 },
    sharedLocationUrl: 'https://maps.app.goo.gl/8XtKvQzM9nN5pP2r7',
    status: 'delayed',
    capacity: 45,
    occupancy: 28,
    lastUpdated: new Date()
  },
  {
    id: '3',
    number: 'BUS-003',
    route: 'Medical Shuttle',
    driver: 'Mike Davis',
    location: { lat: 40.7505, lng: -73.9934 },
    sharedLocationUrl: 'https://maps.app.goo.gl/4BcDeFgH2iJ3kL4m8',
    status: 'active',
    capacity: 30,
    occupancy: 15,
    lastUpdated: new Date()
  },
  {
    id: '4',
    number: 'BUS-004',
    route: 'Campus Loop',
    driver: 'Emily Brown',
    location: { lat: 40.7647, lng: -73.9753 },
    sharedLocationUrl: 'https://maps.app.goo.gl/5NoP6qR7sT8uV9w0A',
    status: 'inactive',
    capacity: 45,
    occupancy: 0,
    lastUpdated: new Date()
  }
];

// Mock notifications
export const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Bus Delay Alert',
    message: 'BUS-002 is delayed by 10 minutes due to traffic.',
    type: 'warning',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    read: false
  },
  {
    id: '2',
    title: 'Route Update',
    message: 'Campus Loop route will have a temporary stop at the New Academic Building.',
    type: 'info',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    read: false
  },
  {
    id: '3',
    title: 'Service Resumed',
    message: 'Medical Shuttle service has resumed normal operations.',
    type: 'success',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    read: true
  }
];

// Function to simulate bus movement
export const updateBusLocation = (bus: Bus): Bus => {
  const variation = 0.001;
  return {
    ...bus,
    location: {
      lat: bus.location.lat + (Math.random() - 0.5) * variation,
      lng: bus.location.lng + (Math.random() - 0.5) * variation
    },
    lastUpdated: new Date()
  };
};

// Generate estimated arrival times for stops
export const generateArrivalTimes = (stops: Stop[]): Stop[] => {
  return stops.map((stop, index) => ({
    ...stop,
    estimatedArrival: new Date(Date.now() + (index + 1) * 5 * 60 * 1000).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    }),
    isActive: index === 0
  }));
};