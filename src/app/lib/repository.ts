import { User, Site, Shift, TimeEvent, TimeReviewRequest, Notification, RewardsLedger } from './models';

// Simple in-memory storage for demo since we don't have a real DB yet.
// This will reset on full page reload but persist during SPA navigation.
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
    // 5 Admins
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

    // 200 Cleaners
    for (let i = 1; i <= 200; i++) {
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

    // 20 Sites
    const siteNames = ["Skyline Towers", "Crystal Plaza", "Green Valley Hospital", "Metro Hub", "Oak Ridge School", "Sunset Mall", "Apex Offices", "Heritage Library", "Pinnacle Suites", "Grandview Residences", "Silver Lake Clinic", "Golden Gate Plaza", "Summit Park", "Echo Valley Tech", "Azure Business Center", "Terra Firm Hq", "North Star Warehouse", "Bridgeport Apartments", "Willow Creek Commons", "Pacific View Estates"];
    for (let i = 0; i < 20; i++) {
      this.sites.push({
        id: `site-${i + 1}`,
        name: siteNames[i],
        address: `${100 + i} Main St, Toronto, ON`,
        geoRadiusMeters: 100,
        timezone: "America/Toronto"
      });
    }

    // Some Seeded Shifts and scenarios
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Scenario 1: Completed Shift
    this.shifts.push({
      id: "shift-1",
      userId: "cleaner-1",
      siteId: "site-1",
      siteName: "Skyline Towers",
      scheduledStart: new Date(yesterday.setHours(9, 0, 0, 0)).toISOString(),
      scheduledEnd: new Date(yesterday.setHours(17, 0, 0, 0)).toISOString(),
      status: "COMPLETED"
    });

    // Scenario 2: Missed Clock Out
    this.shifts.push({
      id: "shift-2",
      userId: "cleaner-2",
      siteId: "site-2",
      siteName: "Crystal Plaza",
      scheduledStart: new Date(yesterday.setHours(8, 0, 0, 0)).toISOString(),
      scheduledEnd: new Date(yesterday.setHours(16, 0, 0, 0)).toISOString(),
      status: "IN_PROGRESS" // Stuck
    });

    // Scenario 3: Review Request Pending
    const shift3Start = new Date(yesterday.setHours(10, 0, 0, 0)).toISOString();
    this.shifts.push({
        id: "shift-3",
        userId: "cleaner-3",
        siteId: "site-3",
        siteName: "Green Valley Hospital",
        scheduledStart: shift3Start,
        scheduledEnd: new Date(yesterday.setHours(18, 0, 0, 0)).toISOString(),
        status: "COMPLETED"
    });
    this.reviewRequests.push({
      id: "req-1",
      userId: "cleaner-3",
      cleanerName: "Cleaner 3",
      shiftId: "shift-3",
      reason: "Missed Clock-In",
      note: "Phone was dead when I arrived. Started work exactly at 10 AM.",
      status: "PENDING",
      createdAt: new Date().toISOString()
    });

    // Scenario 4: GPS Unavailable
    this.notifications.push({
        id: "not-1",
        userId: "cleaner-1",
        role: "CLEANER",
        category: "TIME",
        title: "GPS Unavailable",
        body: "We couldn't verify your location at Skyline Towers. Please submit a manual report 📍",
        createdAt: new Date().toISOString(),
        read: false
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

  // Getters & Setters
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
