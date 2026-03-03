import { User, Site, Shift, TimeEvent, TimeReviewRequest, Notification, RewardsLedger } from './models';

/**
 * @fileOverview Mock Repository for Affinity Workforce Platform.
 * Seeded with multiple production scenarios for the Duty, Cycle, Vault, and Arena tabs.
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
    const names = [
      "Alex Rivera", "Jordan Smith", "Sam Taylor", "Casey Jones", "Taylor Reed",
      "Morgan Bell", "Riley West", "Quinn Davis", "Avery Lane", "Skyler Cole",
      "Charlie Fox", "Peyton Hill", "Dakota Moon", "Emerson Blue", "Sage Grey",
      "Phoenix Sun", "Justice Law", "River Song", "Ocean Deep", "Sky High"
    ];

    for (let i = 1; i <= 20; i++) {
      this.users.push({
        id: `cleaner-${i}`,
        name: names[i-1] || `Cleaner ${i}`,
        role: 'CLEANER',
        workerType: i % 3 === 0 ? 'CONTRACT' : 'EMPLOYEE',
        phone: `555-${1000 + i}`,
        status: 'ACTIVE',
        points: 2000 - (i * 75) + (i === 1 ? 850 : 0), // Cleaner 1 gets a boost
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
    const yesterday = new Date(now); yesterday.setDate(yesterday.getDate() - 1);

    // --- CLEANER 1 SCENARIOS (Vault & Cycle) ---
    this.shifts.push({
        id: "shift-approach",
        userId: "cleaner-1",
        siteId: "site-1",
        siteName: "Metro Hub",
        scheduledStart: todayAt9.toISOString(),
        scheduledEnd: todayAt17.toISOString(),
        status: "SCHEDULED"
    });

    this.rewards.push({
        id: "r1", userId: "cleaner-1", pointsDelta: 500, reason: "Perfect Attendance Streak", createdAt: yesterday.toISOString()
    });
    this.rewards.push({
        id: "r2", userId: "cleaner-1", pointsDelta: 250, reason: "5-Star Site Feedback", createdAt: new Date(now.getTime() - 86400000 * 2).toISOString()
    });
    this.rewards.push({
        id: "r3", userId: "cleaner-1", pointsDelta: 100, reason: "Eco-Friendly Supply Usage", createdAt: new Date(now.getTime() - 86400000 * 5).toISOString()
    });

    // --- OTHER SCENARIOS ---
    this.shifts.push({
        id: "shift-active",
        userId: "cleaner-2",
        siteId: "site-2",
        siteName: "Crystal Plaza",
        scheduledStart: new Date(now.setHours(8, 0, 0, 0)).toISOString(),
        scheduledEnd: new Date(now.setHours(16, 0, 0, 0)).toISOString(),
        status: "IN_PROGRESS"
    });

    this.reviewRequests.push({
        id: "req-ontario-break",
        userId: "cleaner-3",
        cleanerName: "Casey Jones",
        shiftId: "shift-dispute",
        reason: "Break Correction",
        note: "I worked 12 hours straight and couldn't find a relief to take my mandatory 30m break.",
        status: "PENDING",
        createdAt: new Date().toISOString()
    });

    this.notifications.push({
        id: "n1", userId: "cleaner-1", role: "CLEANER", category: "REMINDERS", title: "Shift Approaching",
        body: "Your shift at Metro Hub starts in 15 minutes.",
        createdAt: new Date().toISOString(), read: false
    });
  }

  getUser(id: string) { return this.users.find(u => u.id === id); }
  getSite(id: string) { return this.sites.find(s => s.id === id); }
  getShiftsForUser(userId: string) { return this.shifts.filter(s => s.userId === userId); }
  getShift(id: string) { return this.shifts.find(s => s.id === id); }
  getReviewRequests() { return this.reviewRequests; }
  getRewardsForUser(userId: string) { return this.rewards.filter(r => r.userId === userId).sort((a,b) => b.createdAt.localeCompare(a.createdAt)); }
  
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
