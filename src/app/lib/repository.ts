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
      this.users.push({
        id: `cleaner-${i}`,
        name: names[i-1] || `Cleaner ${i}`,
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
      { id: "site-2", name: "Crystal Plaza", addr: "290 Bremner Blvd, Toronto" }
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

    // --- CLEANER 1: ALEX RIVERA (Scenario: Approaching Site) ---
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

    // --- CLEANER 2: JORDAN SMITH (Scenario: Active Duty) ---
    this.shifts.push({
        id: "shift-jordan-active",
        userId: "cleaner-2",
        siteId: "site-2",
        siteName: "Crystal Plaza",
        scheduledStart: new Date(now.getTime() - 4 * 3600000).toISOString(),
        scheduledEnd: new Date(now.getTime() + 4 * 3600000).toISOString(),
        status: "IN_PROGRESS",
        managerNote: "Attention: Floor scrubber on floor 4 is leaking. Use manual mop for zone 4B.",
        tasks: [
          { id: 'j1', label: 'Floor 4 Mopping', completed: true },
          { id: 'j2', label: 'Elevator Glass Polish', completed: false },
          { id: 'j3', label: 'Kitchen Area Deep Clean', completed: true },
          { id: 'j4', label: 'Security Log Update', completed: false }
        ]
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
