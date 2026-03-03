import { User, Site, Shift, TimeEvent, TimeReviewRequest, Notification, RewardsLedger } from './models';

/**
 * @fileOverview Mock Repository for Affinity Workforce Platform.
 * Seeded with multiple production scenarios for the Duty/Clock and Cycle tabs.
 */

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
    // 1. ADMiNS
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

    // 2. CLEANERS
    for (let i = 1; i <= 20; i++) {
      this.users.push({
        id: `cleaner-${i}`,
        name: `Cleaner ${i}`,
        role: 'CLEANER',
        workerType: i % 3 === 0 ? 'CONTRACT' : 'EMPLOYEE',
        phone: `555-${1000 + i}`,
        status: 'ACTIVE',
        points: 1250 + (i * 50),
        avatarUrl: `https://picsum.photos/seed/cleaner${i}/100/100`,
      });
    }

    // 3. SITES
    const siteNames = ["Metro Hub", "Crystal Plaza", "Skyline Towers", "Oak Ridge School", "Green Valley Hospital"];
    const addresses = [
        "100 Front St W, Toronto, ON",
        "290 Bremner Blvd, Toronto, ON",
        "301 Front St W, Toronto, ON",
        "1 Austin Terrace, Toronto, ON",
        "190 Elizabeth St, Toronto, ON"
    ];
    for (let i = 0; i < siteNames.length; i++) {
      this.sites.push({
        id: `site-${i + 1}`,
        name: siteNames[i],
        address: addresses[i],
        geoRadiusMeters: 100,
        timezone: "America/Toronto"
      });
    }

    const now = new Date();
    const todayAt9 = new Date(now); todayAt9.setHours(9, 0, 0, 0);
    const todayAt17 = new Date(now); todayAt17.setHours(17, 0, 0, 0);
    
    const tomorrow = new Date(now); tomorrow.setDate(tomorrow.getDate() + 1);
    const nextDay = new Date(now); nextDay.setDate(nextDay.getDate() + 2);
    
    const yesterday = new Date(now); yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(now); lastWeek.setDate(lastWeek.getDate() - 7);

    // --- CYCLE TAB SCENARIOS (Cleaner 1) ---

    // 1. Active/Approach (Scenario A for Duty Tab)
    this.shifts.push({
        id: "shift-approach",
        userId: "cleaner-1",
        siteId: "site-1",
        siteName: "Metro Hub",
        scheduledStart: todayAt9.toISOString(),
        scheduledEnd: todayAt17.toISOString(),
        status: "SCHEDULED"
    });

    // 2. Upcoming Shift 1
    this.shifts.push({
        id: "shift-tomorrow",
        userId: "cleaner-1",
        siteId: "site-2",
        siteName: "Crystal Plaza",
        scheduledStart: new Date(tomorrow.setHours(8, 0, 0, 0)).toISOString(),
        scheduledEnd: new Date(tomorrow.setHours(16, 0, 0, 0)).toISOString(),
        status: "SCHEDULED"
    });

    // 3. Upcoming Shift 2
    this.shifts.push({
        id: "shift-next-day",
        userId: "cleaner-1",
        siteId: "site-4",
        siteName: "Oak Ridge School",
        scheduledStart: new Date(nextDay.setHours(18, 0, 0, 0)).toISOString(),
        scheduledEnd: new Date(nextDay.setHours(22, 0, 0, 0)).toISOString(),
        status: "SCHEDULED"
    });

    // 4. Completed History 1
    this.shifts.push({
        id: "shift-completed-1",
        userId: "cleaner-1",
        siteId: "site-3",
        siteName: "Skyline Towers",
        scheduledStart: new Date(yesterday.setHours(10, 0, 0, 0)).toISOString(),
        scheduledEnd: new Date(yesterday.setHours(18, 0, 0, 0)).toISOString(),
        status: "COMPLETED"
    });

    // 5. Cancelled Shift
    this.shifts.push({
        id: "shift-cancelled",
        userId: "cleaner-1",
        siteId: "site-5",
        siteName: "Green Valley Hospital",
        scheduledStart: new Date(lastWeek.setHours(12, 0, 0, 0)).toISOString(),
        scheduledEnd: new Date(lastWeek.setHours(20, 0, 0, 0)).toISOString(),
        status: "CANCELLED"
    });

    // --- OTHER SCENARIOS ---
    
    // Scenario B: Cleaner 2 - already at "Crystal Plaza" (IN_PROGRESS -> CLOCKED_IN)
    this.shifts.push({
        id: "shift-active",
        userId: "cleaner-2",
        siteId: "site-2",
        siteName: "Crystal Plaza",
        scheduledStart: new Date(now.setHours(8, 0, 0, 0)).toISOString(),
        scheduledEnd: new Date(now.setHours(16, 0, 0, 0)).toISOString(),
        status: "IN_PROGRESS"
    });
    this.timeEvents.push({
        id: "ev-active-start",
        userId: "cleaner-2",
        shiftId: "shift-active",
        type: "CLOCK_IN",
        timestamp: new Date(now.setHours(7, 58, 0, 0)).toISOString(),
        source: "AUTO"
    });

    // Scenario C: Admin Challenge - Missing Break at "Skyline Towers"
    this.shifts.push({
        id: "shift-dispute",
        userId: "cleaner-3",
        siteId: "site-3",
        siteName: "Skyline Towers",
        scheduledStart: new Date(yesterday.setHours(10, 0, 0, 0)).toISOString(),
        scheduledEnd: new Date(yesterday.setHours(22, 0, 0, 0)).toISOString(), 
        status: "COMPLETED"
    });
    this.timeEvents.push({ id: "ev-d-1", userId: "cleaner-3", shiftId: "shift-dispute", type: "CLOCK_IN", timestamp: new Date(yesterday.setHours(10, 0, 0, 0)).toISOString(), source: "AUTO" });
    this.timeEvents.push({ id: "ev-d-2", userId: "cleaner-3", shiftId: "shift-dispute", type: "CLOCK_OUT", timestamp: new Date(yesterday.setHours(22, 0, 0, 0)).toISOString(), source: "AUTO" });
    
    this.reviewRequests.push({
        id: "req-ontario-break",
        userId: "cleaner-3",
        cleanerName: "Cleaner 3",
        shiftId: "shift-dispute",
        reason: "Break Correction",
        note: "I worked 12 hours straight and couldn't find a relief to take my mandatory 30m break. Requesting adjustment.",
        status: "PENDING",
        createdAt: new Date().toISOString()
    });

    // Seed some notifications
    this.notifications.push({
        id: "n1", userId: "cleaner-1", role: "CLEANER", category: "REMINDERS", title: "Shift Approaching",
        body: "Your shift at Metro Hub starts in 15 minutes. Geofence is active.",
        createdAt: new Date().toISOString(), read: false
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
