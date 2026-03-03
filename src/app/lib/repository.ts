import { User, Site, Shift, TimeEvent, TimeReviewRequest, Notification, RewardsLedger, UserCertification } from './models';

/**
 * @fileOverview Enterprise Mock Repository for Affinity.
 * Seeded with complex operational scenarios for production testing.
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

    // Sam Tester for focused UI testing
    this.users.push({
      id: "cleaner-sam",
      name: "Sam Tester",
      email: "sam@affinity.com",
      role: 'CLEANER',
      workerType: 'EMPLOYEE',
      phone: "416-555-9999",
      status: 'ACTIVE',
      points: 2500,
      avatarUrl: "https://picsum.photos/seed/samtester/100/100",
      certifications: [
        { id: "cert-sam-1", name: "WHMIS 2024", status: 'VALID', expiryDate: '2025-12-31' },
        { id: "cert-sam-2", name: "Site Rules", status: 'VALID', expiryDate: '2025-08-15' }
      ]
    });

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
    
    // --- SHIFT SCENARIOS FOR ALEX RIVERA ---
    const todayAt9 = new Date(now); todayAt9.setHours(9, 0, 0, 0);
    const todayAt17 = new Date(now); todayAt17.setHours(17, 0, 0, 0);

    this.shifts.push({
        id: "shift-alex-today",
        userId: "cleaner-1",
        siteId: "site-1",
        siteName: "Metro Hub",
        scheduledStart: todayAt9.toISOString(),
        scheduledEnd: todayAt17.toISOString(),
        status: "IN_PROGRESS",
        tasks: [
          { id: 't1', label: 'Wipe Lobby Tables', completed: true },
          { id: 't2', label: 'Refill Restroom Soap', completed: false }
        ]
    });

    // --- SHIFT SCENARIOS FOR SAM ---
    const samTodayStart = new Date(now); samTodayStart.setHours(10, 0, 0, 0);
    const samTodayEnd = new Date(now); samTodayEnd.setHours(18, 0, 0, 0);
    this.shifts.push({
      id: "shift-sam-today",
      userId: "cleaner-sam",
      siteId: "site-3",
      siteName: "Bay Street Financial",
      scheduledStart: samTodayStart.toISOString(),
      scheduledEnd: samTodayEnd.toISOString(),
      status: "SCHEDULED",
      tasks: [
        { id: 's1', label: 'Mop Lobby', completed: false },
        { id: 's2', label: 'Refill Towels', completed: false },
        { id: 's3', label: 'Sanitize Desk Surfaces', completed: false }
      ]
    });

    // Past Shifts
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

    // --- NOTIFICATIONS ---
    this.notifications.push(
      {
        id: `n-cleaner-1-1`,
        userId: "cleaner-1",
        role: 'CLEANER',
        category: 'TIME',
        title: 'Work Verified',
        body: 'You arrived at Metro Hub. Work clock started.',
        createdAt: new Date(now.getTime() - 15 * 60000).toISOString(),
        read: true
      }
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
