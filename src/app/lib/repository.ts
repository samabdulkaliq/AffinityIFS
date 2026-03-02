import { User, Site, Shift, TimeEvent, TimeReviewRequest, Notification, RewardsLedger } from './models';

class MockRepository {
  users: User[] = [];
  sites: Site[] = [];
  shifts: Shift[] = [];
  timeEvents: TimeEvent[] = [];
  reviewRequests: TimeReviewRequest[] = [];
  notifications: Notification[] = [];
  rewards: RewardsLedger[] = [];

  constructor() {
    this.seed();
  }

  private seed() {
    // Admins
    for (let i = 1; i <= 5; i++) {
      this.users.push({
        id: `admin-${i}`,
        name: `Admin User ${i}`,
        role: 'ADMIN',
        workerType: 'EMPLOYEE',
        phone: `555-010${i}`,
        status: 'ACTIVE',
        points: 0,
        avatarUrl: `https://picsum.photos/seed/admin${i}/100/100`,
      });
    }

    // Cleaners
    for (let i = 1; i <= 20; i++) {
      this.users.push({
        id: `cleaner-${i}`,
        name: `Cleaner ${i}`,
        role: 'CLEANER',
        workerType: i % 3 === 0 ? 'CONTRACT' : 'EMPLOYEE',
        phone: `555-${1000 + i}`,
        status: 'ACTIVE',
        points: Math.floor(Math.random() * 500),
        avatarUrl: `https://picsum.photos/seed/cleaner${i}/100/100`,
      });
    }

    // Sites
    const siteNames = ["Skyline Towers", "Crystal Plaza", "Green Valley Hospital", "Metro Hub", "Oak Ridge School"];
    for (let i = 0; i < siteNames.length; i++) {
      this.sites.push({
        id: `site-${i + 1}`,
        name: siteNames[i],
        address: `${100 + i} Main St, Toronto, ON`,
        geoRadiusMeters: 100,
        timezone: "America/Toronto"
      });
    }

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Scenario 1: Missing Clock-Out (Admin Challenge)
    this.shifts.push({
      id: "shift-1",
      userId: "cleaner-1",
      siteId: "site-1",
      siteName: "Skyline Towers",
      scheduledStart: new Date(yesterday.setHours(9, 0, 0, 0)).toISOString(),
      scheduledEnd: new Date(yesterday.setHours(17, 0, 0, 0)).toISOString(),
      status: "IN_PROGRESS" 
    });
    this.timeEvents.push({
        id: "ev-1",
        userId: "cleaner-1",
        shiftId: "shift-1",
        type: "CLOCK_IN",
        timestamp: new Date(yesterday.setHours(8, 55, 0, 0)).toISOString(),
        source: "AUTO"
    });

    // Scenario 2: Late Arrival Review Request
    this.shifts.push({
      id: "shift-2",
      userId: "cleaner-2",
      siteId: "site-2",
      siteName: "Crystal Plaza",
      scheduledStart: new Date(yesterday.setHours(8, 0, 0, 0)).toISOString(),
      scheduledEnd: new Date(yesterday.setHours(16, 0, 0, 0)).toISOString(),
      status: "COMPLETED"
    });
    this.timeEvents.push({
        id: "ev-2",
        userId: "cleaner-2",
        shiftId: "shift-2",
        type: "CLOCK_IN",
        timestamp: new Date(yesterday.setHours(8, 45, 0, 0)).toISOString(),
        source: "AUTO"
    });
    this.reviewRequests.push({
      id: "req-1",
      userId: "cleaner-2",
      cleanerName: "Cleaner 2",
      shiftId: "shift-2",
      reason: "Late Arrival",
      note: "Traffic on the 401 was backed up for miles due to an accident. Tried my best to get here!",
      status: "PENDING",
      createdAt: new Date().toISOString()
    });

    // Scenario 3: Missing break (Ontario Rule Challenge)
    this.shifts.push({
        id: "shift-3",
        userId: "cleaner-3",
        siteId: "site-3",
        siteName: "Green Valley Hospital",
        scheduledStart: new Date(yesterday.setHours(10, 0, 0, 0)).toISOString(),
        scheduledEnd: new Date(yesterday.setHours(20, 0, 0, 0)).toISOString(), // 10 hour shift
        status: "COMPLETED"
    });
    this.timeEvents.push({
        id: "ev-3",
        userId: "cleaner-3",
        shiftId: "shift-3",
        type: "CLOCK_IN",
        timestamp: new Date(yesterday.setHours(10, 0, 0, 0)).toISOString(),
        source: "AUTO"
    });
    this.timeEvents.push({
        id: "ev-4",
        userId: "cleaner-3",
        shiftId: "shift-3",
        type: "CLOCK_OUT",
        timestamp: new Date(yesterday.setHours(20, 0, 0, 0)).toISOString(),
        source: "AUTO"
    });
    this.reviewRequests.push({
        id: "req-2",
        userId: "cleaner-3",
        cleanerName: "Cleaner 3",
        shiftId: "shift-3",
        reason: "Break Correction",
        note: "I was so busy I never took my 30 min break. Can you verify this?",
        status: "PENDING",
        createdAt: new Date().toISOString()
      });

    // Today's Shift for Cleaner 1
    this.shifts.push({
        id: "shift-today-1",
        userId: "cleaner-1",
        siteId: "site-4",
        siteName: "Metro Hub",
        scheduledStart: new Date(today.setHours(9, 0, 0, 0)).toISOString(),
        scheduledEnd: new Date(today.setHours(15, 0, 0, 0)).toISOString(),
        status: "SCHEDULED"
    });
  }

  getUser(id: string) { return this.users.find(u => u.id === id); }
  getSite(id: string) { return this.sites.find(s => s.id === id); }
  getShiftsForUser(userId: string) { return this.shifts.filter(s => s.userId === userId); }
  getShift(id: string) { return this.shifts.find(s => s.id === id); }
  getReviewRequests() { return this.reviewRequests; }
  
  createTimeEvent(event: Omit<TimeEvent, 'id'>) {
    const newEvent = { ...event, id: Math.random().toString(36).substr(2, 9) };
    this.timeEvents.push(newEvent);
    return newEvent;
  }

  getEventsForShift(shiftId: string) {
    return this.timeEvents.filter(e => e.shiftId === shiftId).sort((a,b) => a.timestamp.localeCompare(b.timestamp));
  }

  updateReviewRequest(id: string, updates: Partial<TimeReviewRequest>) {
    const idx = this.reviewRequests.findIndex(r => r.id === id);
    if (idx !== -1) {
      this.reviewRequests[idx] = { ...this.reviewRequests[idx], ...updates };
    }
  }
}

export const repository = new MockRepository();
