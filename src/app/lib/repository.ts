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

    const certNames = ["WHMIS 2024", "First Aid & CPR", "Site Safety Protocol", "Equipment Safety"];

    for (let i = 1; i <= 10; i++) {
      const cleanerId = i;
      
      // Seed certifications with varied scenarios
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
    const sources: any[] = ['AUTO', 'MANUAL', 'ADMIN'];

    for (let i = 0; i < 15; i++) {
      const randomCleaner = this.users.filter(u => u.role === 'CLEANER')[Math.floor(Math.random() * 10)];
      const randomSite = this.sites[Math.floor(Math.random() * this.sites.length)];
      const timeOffset = i * 12; // Spread events over a few hours
      
      this.timeEvents.push({
        id: `event-${i}`,
        userId: randomCleaner.id,
        shiftId: `shift-mock-${i}`,
        type: eventTypes[Math.floor(Math.random() * 3)], // mostly clock/break
        timestamp: new Date(now.getTime() - timeOffset * 60000).toISOString(),
        source: sources[Math.floor(Math.random() * 2)], // mostly auto/manual
        notes: i % 5 === 0 ? "Geofence verified at site entrance." : undefined
      });
    }

    // --- CLEANER 1: ALEX RIVERA (Active Operational Lifecycle) ---
    const todayAt9 = new Date(now); todayAt9.setHours(9, 0, 0, 0);
    const todayAt17 = new Date(now); todayAt17.setHours(17, 0, 0, 0);

    this.shifts.push({
        id: "shift-alex-today",
        userId: "cleaner-1",
        siteId: "site-1",
        siteName: "Metro Hub",
        scheduledStart: todayAt9.toISOString(),
        scheduledEnd: todayAt17.toISOString(),
        status: "SCHEDULED",
        managerNote: "South gate entry only. Security will provide keys.",
        tasks: [
          { id: 't1', label: 'Sanitize Lobby Desks', completed: false },
          { id: 't2', label: 'Refill Restroom Dispensers', completed: false },
          { id: 't3', label: 'Vacuum Zone A & B', completed: false },
          { id: 't4', label: 'Waste Disposal Audit', completed: false }
        ]
    });

    // Past History
    const yest = new Date(now); yest.setDate(now.getDate() - 1);
    this.shifts.push({
        id: "shift-alex-yest",
        userId: "cleaner-1",
        siteId: "site-1",
        siteName: "Metro Hub",
        scheduledStart: new Date(yest.setHours(9, 0)).toISOString(),
        scheduledEnd: new Date(yest.setHours(17, 0)).toISOString(),
        status: "COMPLETED",
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
      },
      {
        id: "req-02",
        userId: "cleaner-4",
        cleanerName: "Casey Jones",
        shiftId: "s-past-02",
        reason: "Missed Clock-Out",
        note: "Phone died before I could clock out at the end of the shift.",
        status: "PENDING",
        createdAt: new Date(now.getTime() - 48 * 3600000).toISOString()
      }
    );

    // --- NOTIFICATIONS ---
    const cleanerIds = ['cleaner-1', 'cleaner-2'];
    cleanerIds.forEach(id => {
      this.notifications.push(
        {
          id: `n-${id}-1`,
          userId: id,
          role: 'CLEANER',
          category: 'TIME',
          title: 'Shift Confirmation',
          body: 'Geofence verified at Metro Hub. Shift starting now.',
          createdAt: new Date(now.getTime() - 15 * 60000).toISOString(),
          read: true
        },
        {
          id: `n-${id}-2`,
          userId: id,
          role: 'CLEANER',
          category: 'APPROVALS',
          title: 'Time Review Approved',
          body: 'Your break adjustment for Tuesday has been approved by David Smith.',
          createdAt: new Date(now.getTime() - 120 * 60000).toISOString(),
          read: false
        }
      );
    });

    // --- REWARDS ---
    cleanerIds.forEach(id => {
      this.rewards.push(
        { id: `r-${id}-1`, userId: id, pointsDelta: 500, reason: 'Monthly Attendance Bonus', createdAt: new Date(now.getTime() - 2 * 24 * 3600000).toISOString() },
        { id: `r-${id}-2`, userId: id, pointsDelta: 200, reason: 'Quality Photo Audit: Metro Hub', createdAt: new Date(now.getTime() - 1 * 24 * 3600000).toISOString() }
      );
    });
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

  getWorkersWithExpiringCerts() {
    return this.users.filter(u => u.role === 'CLEANER' && u.certifications?.some(c => c.status === 'EXPIRING'));
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
