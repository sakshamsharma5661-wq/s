export type UserRole = 'customer' | 'driver' | 'vendor';

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  isVerified: boolean;
  documents: string[];
  createdAt: any;
  avatar?: string;
}

export type BookingStatus = 'pending' | 'accepted' | 'on-transit' | 'completed' | 'cancelled';

export interface Location {
  address: string;
  lat?: number;
  lng?: number;
}

export interface Booking {
  id?: string;
  customerId: string;
  driverId?: string;
  vendorId?: string;
  pickup: Location;
  drop: Location;
  truckType: string;
  status: BookingStatus;
  fare: number;
  createdAt: any;
  updatedAt: any;
}

export interface Truck {
  id?: string;
  ownerId: string;
  type: string;
  regNumber: string;
  capacity: string;
  status: 'active' | 'maintenance' | 'inactive';
}
