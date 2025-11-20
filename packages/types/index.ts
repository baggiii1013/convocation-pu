// Shared types for the convocation system

// Enums
export enum UserRole {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  STUDENT = 'STUDENT',
}

export enum AccountState {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
}

export enum EnclosureType {
  STUDENTS = 'STUDENTS',
  FACULTY = 'FACULTY',
  STAFF = 'STAFF',
  GUESTS = 'GUESTS',
  VIP = 'VIP',
  MIXED = 'MIXED',
}

export enum Direction {
  NORTH = 'NORTH',
  SOUTH = 'SOUTH',
  EAST = 'EAST',
  WEST = 'WEST',
  NORTHEAST = 'NORTHEAST',
  NORTHWEST = 'NORTHWEST',
  SOUTHEAST = 'SOUTHEAST',
  SOUTHWEST = 'SOUTHWEST',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  CENTER = 'CENTER',
}

// Seat Assignment Types

export interface Row {
  id: string;
  letter: string;
  startSeat: number;
  endSeat: number;
  reservedSeats: string;
  displayOrder: number;
  enclosureId: string;
}

export interface Enclosure {
  id: string;
  letter: string;
  name?: string | null;
  allocatedFor: EnclosureType;
  entryDirection: Direction;
  displayOrder: number;
  totalSeats: number;
  isActive: boolean;
  rows?: Row[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SeatReservation {
  id: string;
  enclosureLetter: string;
  rowLetter: string;
  seatNumber: number;
  reservedFor?: string | null;
  reservedBy?: string | null;
  createdAt: Date;
}

export interface SeatAllocation {
  id: string;
  enclosureLetter: string;
  rowLetter: string;
  seatNumber: number;
  allocatedAt: Date;
  enclosureId: string;
  attendeeId: string;
}

// Attendee Types

export interface Attendee {
  id: string;
  enrollmentId: string;
  name: string;
  course: string;
  school: string;
  degree: string;
  email: string;
  phone?: string | null;
  convocationEligible: boolean;
  convocationRegistered: boolean;
  assignedEnclosure?: string | null;
  createdAt: Date;
  updatedAt: Date;
  accountId?: string | null;
  allocation?: SeatAllocation;
}

// Account Types

export interface Account {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  profileImageURL?: string | null;
  role: UserRole;
  assignedIAMPolicies: string[];
  accountState: AccountState;
  isActive: boolean;
  lastLoginAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// API Request/Response Types

export interface CreateEnclosureRequest {
  letter: string;
  name?: string;
  allocatedFor: EnclosureType;
  entryDirection: Direction;
  displayOrder?: number;
  rows: {
    letter: string;
    startSeat: number;
    endSeat: number;
    reservedSeats?: string;
    displayOrder?: number;
  }[];
}

export interface UpdateEnclosureRequest {
  letter?: string;
  name?: string;
  allocatedFor?: EnclosureType;
  entryDirection?: Direction;
  displayOrder?: number;
  rows?: {
    letter: string;
    startSeat: number;
    endSeat: number;
    reservedSeats?: string;
    displayOrder?: number;
  }[];
}

export interface ReserveSeatRequest {
  reservations: {
    enclosureLetter: string;
    rowLetter: string;
    seatNumber: number;
    reservedFor?: string;
    reservedBy?: string;
  }[];
}

export interface ReserveSeatResponse {
  success: number;
  failed: number;
  reservations: SeatReservation[];
  errors: {
    seat: string;
    error: string;
  }[];
}

export interface GetEnclosuresResponse {
  id: string;
  letter: string;
  name?: string | null;
  allocatedFor: EnclosureType;
  entryDirection: Direction;
  displayOrder: number;
  totalSeats: number;
  allocatedSeats: number;
  isActive: boolean;
  rows: Row[];
  createdAt: Date;
  updatedAt: Date;
}

export interface GetReservationsResponse {
  reservations: SeatReservation[];
}

// API Error Response
export interface ApiError {
  error: string;
  code?: string;
  details?: any;
}

// API Success Response
export interface ApiSuccess<T = any> {
  success: true;
  data?: T;
  message?: string;
}

// Email Types
export enum EmailType {
  PROMOTIONAL = 'PROMOTIONAL',
  INFORMATIONAL = 'INFORMATIONAL',
  REMINDER = 'REMINDER',
  ANNOUNCEMENT = 'ANNOUNCEMENT',
  TICKET = 'TICKET',
}

export interface SendEmailRequest {
  recipients: {
    enclosures?: string[]; // Filter by enclosure letters
    attendeeIds?: string[]; // Specific attendee IDs
    all?: boolean; // Send to all attendees
  };
  subject: string;
  message: string; // Plain text or HTML
  emailType: EmailType;
  sendAsHtml?: boolean;
}

export interface EmailRecipient {
  enrollmentId: string;
  name: string;
  email: string;
  enclosure?: string;
}

export interface SendEmailResponse {
  success: number;
  failed: number;
  totalRecipients: number;
  recipients: EmailRecipient[];
  errors?: {
    email: string;
    error: string;
  }[];
}

