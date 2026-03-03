import { User, Site, Shift, TimeEvent, TimeReviewRequest, Notification, RewardsLedger, UserCertification } from './models';

/**
 * @fileOverview Enterprise Mock Repository for Affinity.
 * Seeded with complex operational scenarios based on PRD requirements.
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
    // 1. ADMINS
    for (let i = 1; i <= 3; i++) {
      this.users.push({
        id: `admin-${i}`,
        name: i === 1 ? "David Smith" : `Admin User ${i}`,
        email: i === 1 ? "david@affinity.com" : `admin${i}@affinity.com`,
        role: 'ADMIN',
        workerType: 'EMPLOYEE',
        phone: `416-555-010${i}`,
        status: 'ACTIVE',
        points: 0,
        avatarUrl: `https://picsum.photos/seed/admin${i}/100/100`,
      });
    }

    // 2. CLEANERS
    const names = [
      "Alex Rivera", "Jordan Smith", "Sam Taylor", "Casey Jones", "Taylor Reed",
      "Morgan Lee", "Riley Vance", "Quinn Brooks", "Avery Lane", "Parker Gray"
    ];

    for (let i = 1; i <= 10; i++) {
      const cleanerId = i;
      
      const userCerts: UserCertification[] = [
        { 
          id: `cert-${cleanerId}-1`, 
          name: "WHMIS 2024", 
          status: i === 2 ? 'EXPIRED' : (i === 4 ? 'EXPIRING' : 'VALID'), 
          expiryDate: i === 2 ? '2024-01-15' : (i === 4 ? '2024-04-10' : '2025-06-30') 
        },
        { 
          id: `cert-${cleanerId}-2`, 
          name: "First Aid & CPR", 
          status: i % 3 === 0 ? 'EXPIRING' : 'VALID', 
          expiryDate: i % 3 === 0 ? '2024-04-01' : '2026-02-20' 
        }
      ];

      this.users.push({
        id: `cleaner-${cleanerId}`,
        name: names[i-1] || `Cleaner ${cleanerId}`,
        email: `cleaner${cleanerId}@affinity.com`,
        role: 'CLEANER',
        workerType: i % 4 === 0 ? 'CONTRACT' : 'EMPLOYEE',
        phone: `647-555-${1000 + i}`,
        status: 'ACTIVE',
        points: 1200 + (i * 150),
        avatarUrl: `https://picsum.photos/seed/cleaner${i}/100/100`,
        certifications: userCerts
      });
    }

    // 3. SITES
    const siteData = [
      { id: "site-1", name: "Metro Hub", addr: "100 Front St W, Toronto" },
      { id: "site-2", name: "Crystal Plaza", addr: "290 Bremner Blvd, Toronto" },
      { id: "site-3", name: "Bay Street Financial", addr: "161 Bay St, Toronto" },
      { id: "site-4", name: "Yorkville Tech Center", addr: "1240 Bay St, Toronto" }
    ];
    siteData.forEach((s) => {
      this.sites.push({
        id: s.id,
        name: s.name,
        address: s.addr,
        geoRadiusMeters: 100,
        timezone: "America/Toronto"
      });
    });

    const now = new Date();
    
    // --- LIVE FEED SEEDING ---
    const eventTypes: any[] = ['CLOCK_IN', 'CLOCK_OUT', 'BREAK_START', 'BREAK_END', 'ADJUSTMENT'];
    for (let i = 0; i < 15; i++) {
      const randomCleaner = this.users.filter(u => u.role === 'CLEANER')[Math.floor(Math.random() * 10)];
      const timeOffset = i * 12;
      this.timeEvents.push({
        id: `event-${i}`,
        userId: randomCleaner.id,
        shiftId: `shift-mock-${i}`,
        type: eventTypes[Math.floor(Math.random() * 3)],
        timestamp: new Date(now.getTime() - timeOffset * 60000).toISOString(),
        source: 'AUTO',
        notes: i % 5 === 0 ? "Geofence verified at site entrance." : undefined
      });
    }

    // --- SHIFT SCENARIOS FOR ALEX RIVERA ---
    const todayAt9 = new Date(now); todayAt9.setHours(9, 0, 0, 0);
    const todayAt17 = new Date(now); todayAt17.setHours(17, 0, 0, 0);

    // Active
    this.shifts.push({
        id: "shift-alex-today",
        userId: "cleaner-1",
        siteId: "site-1",
        siteName: "Metro Hub",
        scheduledStart: todayAt9.toISOString(),
        scheduledEnd: todayAt17.toISOString(),
        status: "IN_PROGRESS",
        tasks: [
          { id: 't1', label: 'Sanitize Lobby Desks', completed: true },
          { id: 't2', label: 'Refill Restroom Dispensers', completed: false }
        ]
    });

    // Past: Normal (Approved)
    const yestAt9 = new Date(now); yestAt9.setDate(now.getDate() - 1); yestAt9.setHours(9, 0);
    const yestAt17 = new Date(now); yestAt17.setDate(now.getDate() - 1); yestAt17.setHours(17, 0);
    this.shifts.push({
        id: "shift-alex-yest",
        userId: "cleaner-1",
        siteId: "site-1",
        siteName: "Metro Hub",
        scheduledStart: yestAt9.toISOString(),
        scheduledEnd: yestAt17.toISOString(),
        status: "COMPLETED",
    });

    // Past: Adjusted (Late Arrival)
    const tuesAt9 = new Date(now); tuesAt9.setDate(now.getDate() - 2); tuesAt9.setHours(9, 0);
    const tuesAt17 = new Date(now); tuesAt17.setDate(now.getDate() - 2); tuesAt17.setHours(17, 0);
    this.shifts.push({
        id: "shift-alex-tues",
        userId: "cleaner-1",
        siteId: "site-2",
        siteName: "Crystal Plaza",
        scheduledStart: new Date(tuesAt9.getTime() + 45 * 60000).toISOString(), // 45m late
        scheduledEnd: tuesAt17.toISOString(),
        status: "COMPLETED",
        managerNote: "Clock-in adjusted to reflect actual site arrival time (verified via GPS)."
    });

    // Upcoming
    const tomorrowAt8 = new Date(now); tomorrowAt8.setDate(now.getDate() + 1); tomorrowAt8.setHours(8, 0);
    const tomorrowAt16 = new Date(now); tomorrowAt16.setDate(now.getDate() + 1); tomorrowAt16.setHours(16, 0);
    this.shifts.push({
        id: "shift-alex-tomorrow",
        userId: "cleaner-1",
        siteId: "site-3",
        siteName: "Bay Street Financial",
        scheduledStart: tomorrowAt8.toISOString(),
        scheduledEnd: tomorrowAt16.toISOString(),
        status: "SCHEDULED",
    });

    // --- REVIEW REQUESTS ---
    this.reviewRequests.push(
      {
        id: "req-01",
        userId: "cleaner-3",
        cleanerName: "Sam Taylor",
        shiftId: "s-past-01",
        reason: "Break Correction",
        note: "Worked through break due to site emergency (water leak).",
        status: "PENDING",
        createdAt: new Date(now.getTime() - 24 * 3600000).toISOString()
      }
    );

    // --- NOTIFICATIONS ---
    this.notifications.push(
      {
        id: `n-cleaner-1-1`,
        userId: "cleaner-1",
        role: 'CLEANER',
        category: 'TIME',
        title: 'Shift Confirmation',
        body: 'Geofence verified at Metro Hub. Shift starting now.',
        createdAt: new Date(now.getTime() - 15 * 60000).toISOString(),
        read: true
      }
    );

    // --- REWARDS ---
    this.rewards.push(
      { id: `r-cleaner-1-1`, userId: "cleaner-1", pointsDelta: 500, reason: 'Monthly Attendance Bonus', createdAt: new Date(now.getTime() - 2 * 24 * 3600000).toISOString() }
    );
  }

  getUser(id: string) { return this.users.find(u => u.id === id); }
  getSite(id: string) { return this.sites.find(s => s.id === id); }
  getShiftsForUser(userId: string) { return this.shifts.filter(s => s.userId === userId); }
  getShift(id: string) { return this.shifts.find(s => s.id === id); }
  getReviewRequests() { return this.reviewRequests; }
  getEventsForShift(shiftId: string) { return this.timeEvents.filter(e => e.shiftId === shiftId); }
  getAllEvents() { return [...this.timeEvents].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()); }
  getRewardsForUser(userId: string) { return this.rewards.filter(r => r.userId === userId); }
  getNotificationsForUser(userId: string) { return this.notifications.filter(n => n.userId === userId); }
  
  getWorkersWithExpiredCerts() {
    return this.users.filter(u => u.role === 'CLEANER' && u.certifications?.some(c => c.status === 'EXPIRED'));
  }

  createTimeEvent(event: Omit<TimeEvent, 'id'>) {
    const newEvent = { ...event, id: Math.random().toString(36).substring(2, 9) };
    this.timeEvents.push(newEvent);
    return newEvent;
  }

  updateReviewRequest(id: string, updates: Partial<TimeReviewRequest>) {
    const idx = this.reviewRequests.findIndex(r => r.id === id);
    if (idx !== -1) this.reviewRequests[idx] = { ...this.reviewRequests[idx], ...updates };
  }

  updateShiftTasks(shiftId: string, taskId: string) {
    const shift = this.shifts.find(s => s.id === shiftId);
    if (shift && shift.tasks) {
      const task = shift.tasks.find(t => t.id === taskId);
      if (task) task.completed = !task.completed;
    }
  }
}

export const repository = new MockRepository();
