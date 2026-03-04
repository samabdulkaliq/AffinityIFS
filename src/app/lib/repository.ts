
import { User, Site, Shift, TimeEvent, TimeReviewRequest, Notification, RewardsLedger, UserCertification, DocRequest } from './models';

class MockRepository {
  users: User[] = [];
  sites: Site[] = [];
  shifts: Shift[] = [];
  timeEvents: TimeEvent[] = [];
  reviewRequests: TimeReviewRequest[] = [];
  notifications: Notification[] = [];
  rewards: RewardsLedger[] = [];
  docRequests: DocRequest[] = [];

  constructor() {
    this.seed();
  }

  private seed() {
    // 1. ADMINS
    this.users.push({
      id: "admin-1",
      name: "Abraham Wellman",
      email: "abraham@affinity.com",
      role: 'ADMIN',
      workerType: 'EMPLOYEE',
      phone: "416-555-0101",
      status: 'ACTIVE',
      points: 0,
      avatarUrl: `https://picsum.photos/seed/abraham/100/100`,
      createdAt: new Date().toISOString(),
    });

    // 2. TEAM MEMBERS
    const names = [
      "Alex Rivera", "Jordan Smith", "Sam Taylor", "Casey Jones", "Taylor Reed",
      "Morgan Lee", "Riley Vance", "Quinn Brooks", "Avery Lane", "Parker Gray"
    ];

    for (let i = 1; i <= 10; i++) {
      const cleanerId = i;
      const userCerts: UserCertification[] = [
        { 
          id: `cert-${cleanerId}-1`, 
          name: "Safety Training", 
          status: i === 2 ? 'EXPIRED' : (i === 4 ? 'EXPIRING' : 'VALID'), 
          expiryDate: i === 2 ? '2024-01-15' : (i === 4 ? '2024-04-10' : '2025-06-30') 
        }
      ];

      this.users.push({
        id: `cleaner-${cleanerId}`,
        name: names[i-1] || `Team Member ${cleanerId}`,
        email: `member${cleanerId}@gmail.com`,
        role: 'CLEANER',
        workerType: i % 4 === 0 ? 'CONTRACT' : 'EMPLOYEE',
        phone: `647-555-${1000 + i}`,
        status: 'ACTIVE',
        points: 1200 + (i * 150),
        avatarUrl: `https://picsum.photos/seed/member${i}/100/100`,
        createdAt: new Date().toISOString(),
        certifications: userCerts
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
    
    // 4. SHIFTS FOR REVIEW
    const today = new Date(now);
    const todayStart = new Date(today.setHours(8, 0, 0, 0));
    const todayEnd = new Date(today.setHours(16, 0, 0, 0));

    this.shifts.push({
        id: "shift-review-1",
        userId: "cleaner-1",
        siteId: "site-1",
        siteName: "Metro Hub",
        scheduledStart: todayStart.toISOString(),
        scheduledEnd: todayEnd.toISOString(),
        status: "COMPLETED",
        reviewStatus: "NEEDS_REVIEW",
        photosRequired: 5,
        photosUploaded: 5,
        inventoryChecked: true,
        tasks: [
          { id: 't1', label: 'Wipe Entrance', completed: true },
          { id: 't2', label: 'Refill Soap', completed: true }
        ]
    });

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const yestStart = new Date(yesterday.setHours(9, 0, 0, 0));
    const yestEnd = new Date(yesterday.setHours(18, 0, 0, 0));

    this.shifts.push({
        id: "shift-review-2",
        userId: "cleaner-2",
        siteId: "site-2",
        siteName: "Crystal Plaza",
        scheduledStart: yestStart.toISOString(),
        scheduledEnd: yestEnd.toISOString(),
        status: "COMPLETED",
        reviewStatus: "FLAGGED",
        issues: ["MISSING_PHOTOS", "LATE_ARRIVAL"],
        photosRequired: 5,
        photosUploaded: 2,
        inventoryChecked: true,
        tasks: [
          { id: 't1', label: 'Floor Polishing', completed: true }
        ]
    });

    this.shifts.push({
        id: "shift-review-3",
        userId: "cleaner-3",
        siteId: "site-3",
        siteName: "Bay Street Financial",
        scheduledStart: yestStart.toISOString(),
        scheduledEnd: yestEnd.toISOString(),
        status: "COMPLETED",
        reviewStatus: "APPROVED",
        photosRequired: 5,
        photosUploaded: 5,
        inventoryChecked: true,
        tasks: [{ id: 't1', label: 'Desk Sanitization', completed: true }]
    });

    // Seed an in-progress shift
    this.shifts.push({
      id: "shift-live-1",
      userId: "cleaner-4",
      siteId: "site-1",
      siteName: "Metro Hub",
      scheduledStart: todayStart.toISOString(),
      scheduledEnd: todayEnd.toISOString(),
      status: "IN_PROGRESS",
      reviewStatus: "NEEDS_REVIEW",
      photosRequired: 5,
      photosUploaded: 1,
      tasks: [{ id: 't1', label: 'Lobby Glass', completed: false }]
    });
  }

  getUser(id: string) { return this.users.find(u => u.id === id); }
  getSite(id: string) { return this.sites.find(s => s.id === id); }
  getShiftsForUser(userId: string) { return this.shifts.filter(s => s.userId === userId); }
  getShift(id: string) { return this.shifts.find(s => s.id === id); }
  getReviewRequests() { return this.reviewRequests; }
  getEventsForShift(shiftId: string) { return this.timeEvents.filter(e => e.shiftId === shiftId); }
  getAllEvents() { return [...this.timeEvents].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()); }
  getNotificationsForUser(userId: string) { return this.notifications.filter(n => n.userId === userId); }
  getDocRequestsForUser(userId: string) { return this.docRequests.filter(r => r.userId === userId); }
  
  getWorkersWithExpiredCerts() {
    return this.users.filter(u => u.role === 'CLEANER' && u.certifications?.some(c => c.status === 'EXPIRED'));
  }

  getLateShifts() {
    return this.shifts.filter(s => s.issues?.includes('LATE_ARRIVAL'));
  }

  getMissingPhotoShifts() {
    return this.shifts.filter(s => (s.photosUploaded || 0) < (s.photosRequired || 0));
  }

  createTimeEvent(event: Omit<TimeEvent, 'id'>) {
    const newEvent = { ...event, id: Math.random().toString(36).substring(2, 9) };
    this.timeEvents.push(newEvent);
    return newEvent;
  }

  createDocRequest(request: Omit<DocRequest, 'id'>) {
    const newRequest = { ...request, id: `dr-${Math.random().toString(36).substring(2, 9)}` };
    this.docRequests.push(newRequest);
    return newRequest;
  }

  addUser(user: User) {
    this.users.push(user);
    return user;
  }

  addShift(shift: Shift) {
    this.shifts.push(shift);
    return shift;
  }

  updateShiftStatus(id: string, status: Shift['status']) {
    const shift = this.shifts.find(s => s.id === id);
    if (shift) shift.status = status;
  }

  updateShift(id: string, updates: Partial<Shift>) {
    const idx = this.shifts.findIndex(s => s.id === id);
    if (idx !== -1) {
      this.shifts[idx] = { ...this.shifts[idx], ...updates };
    }
  }

  updateUser(id: string, updates: Partial<User>) {
    const idx = this.users.findIndex(u => u.id === id);
    if (idx !== -1) {
      this.users[idx] = { ...this.users[idx], ...updates };
    }
  }
}

export const repository = new MockRepository();
