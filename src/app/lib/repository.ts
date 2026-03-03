import { User, Site, Shift, TimeEvent, TimeReviewRequest, Notification, RewardsLedger } from './models';

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
      "Alex Rivera", "Jordan Smith", "Sam Taylor", "Casey Jones", "Taylor Reed"
    ];

    for (let i = 1; i <= 5; i++) {
      const cleanerId = i;
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
      });
    }

    // 3. SITES
    const siteData = [
      { id: "site-1", name: "Metro Hub", addr: "100 Front St W, Toronto" },
      { id: "site-2", name: "Crystal Plaza", addr: "290 Bremner Blvd, Toronto" },
      { id: "site-3", name: "Bay Street Financial", addr: "161 Bay St, Toronto" }
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
    const todayAt9 = new Date(now); todayAt9.setHours(9, 0, 0, 0);
    const todayAt17 = new Date(now); todayAt17.setHours(17, 0, 0, 0);

    // --- CLEANER 1: ALEX RIVERA (Active Operational Lifecycle) ---
    // Active Today
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

    // Upcoming Tomorrow
    const tomorrow = new Date(now); tomorrow.setDate(now.getDate() + 1);
    this.shifts.push({
        id: "shift-alex-tomorrow",
        userId: "cleaner-1",
        siteId: "site-2",
        siteName: "Crystal Plaza",
        scheduledStart: new Date(tomorrow.setHours(8, 0)).toISOString(),
        scheduledEnd: new Date(tomorrow.setHours(16, 0)).toISOString(),
        status: "SCHEDULED",
        tasks: []
    });

    // Past History (Successful)
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

    // Past History (Cancelled)
    const lastWeek = new Date(now); lastWeek.setDate(now.getDate() - 7);
    this.shifts.push({
        id: "shift-alex-cancelled",
        userId: "cleaner-1",
        siteId: "site-3",
        siteName: "Bay Street Financial",
        scheduledStart: new Date(lastWeek.setHours(20, 0)).toISOString(),
        scheduledEnd: new Date(lastWeek.setHours(4, 0)).toISOString(),
        status: "CANCELLED",
    });

    // --- NOTIFICATIONS SCENARIOS ---
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
        },
        {
          id: `n-${id}-3`,
          userId: id,
          role: 'CLEANER',
          category: 'REMINDERS',
          title: 'WHMIS Certification',
          body: 'Your WHMIS safety training expires in 5 days. Please renew in the Profile tab.',
          createdAt: new Date(now.getTime() - 360 * 60000).toISOString(),
          read: false
        },
        {
          id: `n-${id}-4`,
          userId: id,
          role: 'CLEANER',
          category: 'REWARDS',
          title: 'Achievement Unlocked',
          body: 'Earned 200 PTS for "Perfect Documentation" during your Metro Hub shift.',
          createdAt: new Date(now.getTime() - 24 * 3600000).toISOString(),
          read: true
        }
      );
    });

    // --- REWARDS SCENARIOS ---
    cleanerIds.forEach(id => {
      this.rewards.push(
        { id: `r-${id}-1`, userId: id, pointsDelta: 500, reason: 'Monthly Attendance Bonus', createdAt: new Date(now.getTime() - 2 * 24 * 3600000).toISOString() },
        { id: `r-${id}-2`, userId: id, pointsDelta: 200, reason: 'Quality Photo Audit: Metro Hub', createdAt: new Date(now.getTime() - 1 * 24 * 3600000).toISOString() },
        { id: `r-${id}-3`, userId: id, pointsDelta: 150, reason: 'Safe Motion Compliance', createdAt: new Date(now.getTime() - 5 * 3600000).toISOString() }
      );
    });

    // --- GLOBAL DATA ---
    this.reviewRequests.push({
        id: "req-01",
        userId: "cleaner-3",
        cleanerName: "Sam Taylor",
        shiftId: "s-past-01",
        reason: "Break Correction",
        note: "Worked through break due to site emergency.",
        status: "PENDING",
        createdAt: now.toISOString()
    });
  }

  getUser(id: string) { return this.users.find(u => u.id === id); }
  getSite(id: string) { return this.sites.find(s => s.id === id); }
  getShiftsForUser(userId: string) { return this.shifts.filter(s => s.userId === userId); }
  getShift(id: string) { return this.shifts.find(s => s.id === id); }
  getReviewRequests() { return this.reviewRequests; }
  getEventsForShift(shiftId: string) { return this.timeEvents.filter(e => e.shiftId === shiftId); }
  getRewardsForUser(userId: string) { return this.rewards.filter(r => r.userId === userId); }
  getNotificationsForUser(userId: string) { return this.notifications.filter(n => n.userId === userId); }
  
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
