export type UserRole = 'CLEANER' | 'ADMIN';
export type WorkerType = 'EMPLOYEE' | 'CONTRACT';
export type ShiftStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type TimeEventType = 'CLOCK_IN' | 'CLOCK_OUT' | 'BREAK_START' | 'BREAK_END' | 'ADJUSTMENT';
export type EventSource = 'AUTO' | 'MANUAL' | 'ADMIN';
export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type NotificationCategory = 'TIME' | 'APPROVALS' | 'REMINDERS' | 'REWARDS';

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
  siteName?: string; // Denormalized for ease
  managerNote?: string;
  tasks?: ShiftTask[];
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
  cleanerName?: string; // Denormalized
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
