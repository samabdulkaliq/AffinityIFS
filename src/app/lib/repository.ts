import { User, Site, Shift, TimeEvent, TimeReviewRequest, Notification, RewardsLedger } from './models';

/**
 * @fileOverview Enterprise Mock Repository for Affinity.
 * Seeded with complex operational scenarios: 
 * - Ontario break rule violations
 * - Geofence disputes
 * - Supply stock triggers
 * - Multi-role communication threads
 * - Diverse Rewards and Points scenarios
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

    // 2. CLEANERS - Diverse Personas
    const names = [
      "Alex Rivera", "Jordan Smith", "Sam Taylor", "Casey Jones", "Taylor Reed",
      "Morgan Bell", "Riley West", "Quinn Davis", "Avery Lane", "Skyler Cole"
    ];

    for (let i = 1; i <= 10; i++) {
      this.users.push({
        id: `cleaner-${i}`,
        name: names[i-1] || `Cleaner ${i}`,
        role: 'CLEANER',
        workerType: i % 4 === 0 ? 'CONTRACT' : 'EMPLOYEE',
        phone: `647-555-${1000 + i}`,
        status: 'ACTIVE',
        points: i === 1 ? 4850 : 1200 + (i * 50),
        avatarUrl: `https://picsum.photos/seed/cleaner${i}/100/100`,
      });
    }

    // 3. SITES (Toronto Focused)
    const siteData = [
      { id: "site-1", name: "Metro Hub", addr: "100 Front St W, Toronto" },
      { id: "site-2", name: "Crystal Plaza", addr: "290 Bremner Blvd, Toronto" },
      { id: "site-3", name: "Skyline Towers", addr: "301 Front St W, Toronto" },
      { id: "site-4", name: "Oak Ridge School", addr: "1 Austin Terrace, Toronto" }
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
    const yesterday = new Date(now); yesterday.setDate(yesterday.getDate() - 1);
    const twoDaysAgo = new Date(now); twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    const lastWeek = new Date(now); lastWeek.setDate(lastWeek.getDate() - 7);

    // --- CLEANER 1: ALEX RIVERA (Scenario: Active Vault & High Points) ---
    this.shifts.push({
        id: "shift-alex-today",
        userId: "cleaner-1",
        siteId: "site-1",
        siteName: "Metro Hub",
        scheduledStart: todayAt9.toISOString(),
        scheduledEnd: todayAt17.toISOString(),
        status: "SCHEDULED"
    });

    // REWARDS HISTORY for Alex (Cleaner 1)
    this.rewards.push(
      { id: 'r1', userId: 'cleaner-1', pointsDelta: 1000, reason: 'Safety Compliance Milestone (Quarterly)', createdAt: now.toISOString() },
      { id: 'r2', userId: 'cleaner-1', pointsDelta: 500, reason: 'Perfect Attendance Week 8', createdAt: yesterday.toISOString() },
      { id: 'r3', userId: 'cleaner-1', pointsDelta: 750, reason: 'WHMIS Certification Completion', createdAt: twoDaysAgo.toISOString() },
      { id: 'r4', userId: 'cleaner-1', pointsDelta: 250, reason: 'Client Excellence - 5 Star Site Review', createdAt: lastWeek.toISOString() },
      { id: 'r5', userId: 'cleaner-1', pointsDelta: 100, reason: 'First Log of the Day Bonus', createdAt: now.toISOString() },
      { id: 'r6', userId: 'cleaner-1', pointsDelta: 2250, reason: 'Regional Top Performer Award', createdAt: lastWeek.toISOString() }
    );

    // --- CLEANER 2: JORDAN SMITH (Scenario: Active / On Site) ---
    this.shifts.push({
        id: "shift-jordan-active",
        userId: "cleaner-2",
        siteId: "site-2",
        siteName: "Crystal Plaza",
        scheduledStart: new Date(now.getTime() - 4 * 3600000).toISOString(),
        scheduledEnd: new Date(now.getTime() + 4 * 3600000).toISOString(),
        status: "IN_PROGRESS"
    });
    this.timeEvents.push({
      id: "ev-1", userId: "cleaner-2", shiftId: "shift-jordan-active",
      type: "CLOCK_IN", timestamp: new Date(now.getTime() - 4 * 3600000).toISOString(), source: "AUTO"
    });

    // --- ADMIN SCENARIO: PENDING REVIEW ---
    this.reviewRequests.push({
        id: "req-break-01",
        userId: "cleaner-3",
        cleanerName: "Sam Taylor",
        shiftId: "shift-past-01",
        reason: "Break Correction",
        note: "I worked 12 hours straight at Skyline Towers. The site was double-booked and I couldn't leave the floor for my 30m break.",
        status: "PENDING",
        createdAt: now.toISOString()
    });

    this.reviewRequests.push({
        id: "req-late-01",
        userId: "cleaner-4",
        cleanerName: "Casey Jones",
        shiftId: "shift-past-02",
        reason: "GPS Issue",
        note: "I was at the North Gate on time at 7:55am, but the geofence only triggered when I entered the main lobby at 8:15am.",
        status: "PENDING",
        createdAt: yesterday.toISOString()
    });

    // --- GLOBAL NOTIFICATIONS ---
    this.notifications.push({
        id: "n-global-1", userId: "all", role: "CLEANER", category: "REMINDERS",
        title: "WHMIS Update Required", body: "New safety protocols for Lot B chemicals uploaded. Please review in Training.",
        createdAt: now.toISOString(), read: false
    });
  }

  getUser(id: string) { return this.users.find(u => u.id === id); }
  getSite(id: string) { return this.sites.find(s => s.id === id); }
  getShiftsForUser(userId: string) { return this.shifts.filter(s => s.userId === userId); }
  getShift(id: string) { return this.shifts.find(s => s.id === id); }
  getReviewRequests() { return this.reviewRequests; }
  getEventsForShift(shiftId: string) { return this.timeEvents.filter(e => e.shiftId === shiftId); }
  getRewardsForUser(userId: string) { return this.rewards.filter(r => r.userId === userId).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); }
  
  createTimeEvent(event: Omit<TimeEvent, 'id'>) {
    const newEvent = { ...event, id: Math.random().toString(36).substring(2, 9) };
    this.timeEvents.push(newEvent);
    return newEvent;
  }

  updateReviewRequest(id: string, updates: Partial<TimeReviewRequest>) {
    const idx = this.reviewRequests.findIndex(r => r.id === id);
    if (idx !== -1) this.reviewRequests[idx] = { ...this.reviewRequests[idx], ...updates };
  }
}

export const repository = new MockRepository();
