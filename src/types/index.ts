export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: string;
}

export type TripCategory = 'Moon' | 'Mars' | 'ISS' | 'Venus' | 'Jupiter' | 'Saturn' | 'Europa' | 'Proxima Centauri';

export interface Trip {
  id: string;
  name: string;
  destination: string;
  description: string;
  price: number;
  departureDate: string;
  duration: string;
  totalSeats: number;
  availableSeats: number;
  image: string;
  category: TripCategory;
}

export interface Booking {
  id: string;
  userId: string;
  tripId: string;
  seatNumber: string;
  class: 'Economy' | 'Business' | 'First Class';
  status: 'confirmed' | 'cancelled' | 'refunded';
  totalPaid: number;
  createdAt: string;
  qrCode?: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  tripId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}
