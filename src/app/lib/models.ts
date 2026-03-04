
export type UserRole = 'CLEANER' | 'ADMIN';
export type WorkerType = 'EMPLOYEE' | 'CONTRACT';
export type ShiftStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type ReviewStatus = 'NEEDS_REVIEW' | 'APPROVED' | 'FLAGGED';
export type TimeEventType = 'CLOCK_IN' | 'CLOCK_OUT' | 'BREAK_START' | 'BREAK_END' | 'ADJUSTMENT';
export type EventSource = 'AUTO' | 'MANUAL' | 'ADMIN';
export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type NotificationCategory = 'TIME' | 'APPROVALS' | 'REMINDERS' | 'REWARDS';

export type CertificationStatus = 'VALID' | 'EXPIRING' | 'EXPIRED';

export interface UserCertification {
  id: string;
  name: string;
  status: CertificationStatus;
  expiryDate: string; // ISO
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  workerType: WorkerType;
  phone: string;
  status: 'ACTIVE' | 'INACTIVE';
  points: number;
  avatarUrl: string;
  createdAt: string;
  certifications?: UserCertification[];
}

export interface Site {
  id: string;
  name: string;
  address: string;
  geoRadiusMeters: number;
  timezone: string;
}

export interface ShiftTask {
  id: string;
  label: string;
  completed: boolean;
}

export interface Shift {
  id: string;
  userId: string;
  siteId: string;
  scheduledStart: string; // ISO
  scheduledEnd: string;   // ISO
  status: ShiftStatus;
  reviewStatus?: ReviewStatus;
  siteName?: string;
  managerNote?: string;
  tasks?: ShiftTask[];
  photosRequired?: number;
  photosUploaded?: number;
  inventoryChecked?: boolean;
  issues?: string[]; // e.g., ['LATE', 'MISSING_PHOTOS', 'EARLY_LEAVE']
}

export interface TimeEvent {
  id: string;
  userId: string;
  shiftId: string;
  type: TimeEventType;
  timestamp: string; // ISO
  source: EventSource;
  notes?: string;
}

export interface TimeReviewRequest {
  id: string;
  userId: string;
  shiftId: string;
  reason: string;
  note: string;
  status: RequestStatus;
  createdAt: string; // ISO
  adminNote?: string;
  cleanerName?: string;
}

export interface Notification {
  id: string;
  userId: string;
  role: UserRole;
  category: NotificationCategory;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
}

export interface RewardsLedger {
  id: string;
  userId: string;
  pointsDelta: number;
  reason: string;
  createdAt: string;
}

export interface DocRequest {
  id: string;
  userId: string;
  certId: string;
  docType: string;
  dueDate: string;
  status: 'SENT' | 'OPENED' | 'UPLOADED';
  sentAt: string;
  pushSent: boolean;
  emailSent: boolean;
}
