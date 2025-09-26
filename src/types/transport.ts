export interface Bus {
  id: string;
  number: string;
  route: string;
  driver: string;
  location: {
    lat: number;
    lng: number;
  };
  sharedLocationUrl?: string;
  status: 'active' | 'delayed' | 'inactive';
  capacity: number;
  occupancy: number;
  lastUpdated: Date;
}

export interface Route {
  id: string;
  name: string;
  stops: Stop[];
  estimatedDuration: number;
  color: string;
}

export interface Stop {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  estimatedArrival?: string;
  isActive?: boolean;
}

export interface User {
  id: string;
  name: string;
  role: 'student' | 'admin';
  email: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: Date;
  read: boolean;
}