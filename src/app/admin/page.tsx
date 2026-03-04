
"use client";

import { useMemo, useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { repository } from "../lib/repository";
import { 
  Shield, 
  AlertTriangle, 
  Camera, 
  Package, 
  Activity as ActivityIcon, 
  ChevronRight, 
  MapPin,
  Users,
  CheckCircle2,
  Zap,
  PlusCircle,
  CalendarPlus,
  FileBarChart,
  Coffee,
  Sparkles,
  Building2,
  Clock,
  Search,
  Plus,
  ArrowRight,
  UserPlus,
  CalendarDays,
  FileText,
  Briefcase
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminDashboard() {
  const { toast } = useToast();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const [newWorker, setNewWorker] = useState({ name: '', email: '', type: 'EMPLOYEE' as const });
  const [newShift, setNewShift] = useState({ siteId: '', userId: '', startTime: '', endTime: '' });

  const pendingRequests = repository.getReviewRequests().filter(r => r.status === 'PENDING');
  const expiredCerts = repository.getWorkersWithExpiredCerts();
  const allShifts = repository.shifts;
  const activeShifts = allShifts.filter(s => s.status === 'IN_PROGRESS');

  const metrics = useMemo(() => {
    const activeStaffCount = new Set(activeShifts.map(s => s.userId)).size;
    const activeSitesCount = new Set(activeShifts.map(s => s.siteId)).size;
    
    const workersOnBreak = repository.timeEvents.filter(e => e.type === 'BREAK_START').length - 
                           repository.timeEvents.filter(e => e.type === 'BREAK_END').length;
    
    const issuesDetected = allShifts.filter(s => (s.issues?.length || 0) > 0).length;

    return {
      activeStaffCount,
      activeSitesCount,
      workersOnBreak: Math.max(0, workersOnBreak),
      issuesDetected
    };
  }, [activeShifts, allShifts, refreshKey]);

  const aiInsights = [
    { text: "Metro Hub missing 2 work photos", icon: Camera },
    { text: `${expiredCerts.length} certification expires this week`, icon: Shield },
    { text: "A team member is currently on a break", icon: Coffee }
  ];

  const handleQuickAction = (action: string) => {
    setActiveModal(action);
  };

  const handleAddStaff = () => {
    if (!newWorker.name || !newWorker.email) {
      toast({ variant: "destructive", title: "Missing Information", description: "Please enter a name and email." });
      return;
    }
    repository.addUser({
      id: `team-${Math.random().toString(36).substr(2, 5)}`,
      name: newWorker.name,
      email: newWorker.email,
      role: 'CLEANER',
      workerType: newWorker.type,
      phone: "647-000-0000",
      status: 'ACTIVE',
      points: 1000,
      avatarUrl: `https://picsum.photos/seed/${newWorker.name}/100/100`,
      certifications: [{ id: 'c1', name: 'Standard Training', status: 'VALID', expiryDate: '2025-12-01' }]
    });
    setRefreshKey(prev => prev + 1);
    setActiveModal(null);
    setNewWorker({ name: '', email: '', type: 'EMPLOYEE' });
    toast({ title: "Team Member Registered ✅", description: "New member added to the system." });
  };

  const handleCreateAssignment = () => {
    if (!newShift.siteId || !newShift.userId) {
      toast({ variant: "destructive", title: "Selection Required", description: "Please select a site and a worker." });
      return;
    }
    const site = repository.getSite(newShift.siteId);
    repository.addShift({
      id: `shift-${Math.random().toString(36).substr(2, 5)}`,
      userId: newShift.userId,
      siteId: newShift.siteId,
      siteName: site?.name || "Unknown Site",
      scheduledStart: new Date().toISOString(),
      scheduledEnd: new Date(Date.now() + 8 * 3600000).toISOString(),
      status: 'SCHEDULED',
      tasks: [
        { id: 't1', label: 'Entrance Cleaning', completed: false },
        { id: 't2', label: 'Restroom Sanitization', completed: false }
      ],
      photosRequired: 5,
      photosUploaded: 0
    });
    setRefreshKey(prev => prev + 1);
    setActiveModal(null);
    toast({ title: "Shift Scheduled 🗓️", description: "Assignment successfully created and assigned." });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-28">
      <div className="flex justify-between items-end px-1">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Operations Dashboard</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Live Field Command</p>
        </div>
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">System Live</span>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Certification & Payroll Alerts</h3>
        <div className="grid grid-cols-1 gap-3">
          {expiredCerts.length > 0 && (
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <Link href="/admin/workers?filter=EXPIRED">
                <Card className="border-none bg-red-50 hover:bg-red-100 transition-colors rounded-[2rem] overflow-hidden group border border-red-100/50 shadow-sm">
                  <CardContent className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                        <Shield className="w-6 h-6 text-red-500" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-red-600/60 uppercase tracking-widest">Certification Alert</p>
                        <p className="text-sm font-black text-red-900">{expiredCerts.length} Staff Certifications Expired</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-red-300 group-hover:translate-x-1 transition-all" />
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          )}

          {metrics.issuesDetected > 0 && (
             <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }}>
                <Link href="/admin/approvals">
                  <Card className="border-none bg-amber-50 hover:bg-amber-100 transition-colors rounded-[2rem] overflow-hidden group border border-amber-100/50 shadow-sm">
                    <CardContent className="p-5 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                          <AlertTriangle className="w-6 h-6 text-amber-500" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-amber-600/60 uppercase tracking-widest">Payroll Exceptions</p>
                          <p className="text-sm font-black text-amber-900">{metrics.issuesDetected} Site Exceptions Detected</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-amber-300 group-hover:translate-x-1 transition-all" />
                    </CardContent>
                  </Card>
                </Link>
             </motion.div>
          )}
        </div>
      </div>

      <Card className="border-none bg-slate-900 shadow-2xl rounded-[2.5rem] overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] -mr-32 -mt-32" />
        <CardContent className="p-8 space-y-8 relative z-10">
          <div>
            <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">Operations Snapshot</p>
            <h3 className="text-white text-2xl font-black mt-1">Live Performance</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Members Active", value: metrics.activeStaffCount, icon: Users, color: "text-blue-400" },
              { label: "Sites Running", value: metrics.activeSitesCount, icon: Building2, color: "text-emerald-400" },
              { label: "On Break", value: metrics.workersOnBreak, icon: Coffee, color: "text-amber-400" },
              { label: "Issues", value: metrics.issuesDetected, icon: AlertTriangle, color: "text-red-400" },
            ].map((stat, i) => (
              <div key={i} className="bg-white/5 p-5 rounded-[2rem] border border-white/5 backdrop-blur-md">
                <stat.icon className={cn("w-5 h-5 mb-3", stat.color)} />
                <p className="text-2xl font-black text-white">{stat.value}</p>
                <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="px-1">
        <Card className="border-none bg-blue-600 shadow-xl shadow-blue-200 rounded-[2.5rem] overflow-hidden group active:scale-[0.98] transition-all relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700" />
          <CardContent className="p-6 relative z-10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <p className="text-xs font-black text-white uppercase tracking-widest">AI Operations Assistant</p>
            </div>
            <div className="space-y-3">
              {aiInsights.map((insight, i) => (
                <div key={i} className="flex items-center gap-3 text-white/90">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-300" />
                  <p className="text-sm font-medium tracking-tight">{insight.text}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Site Activity Pulse</h3>
          <Link href="/admin/feed">
            <Badge variant="outline" className="border-slate-200 text-slate-400 font-black cursor-pointer hover:bg-slate-100">VIEW ALL</Badge>
          </Link>
        </div>
        <div className="space-y-3">
          {repository.sites.slice(0, 3).map((site) => {
            const siteActiveStaff = repository.shifts.filter(s => s.siteId === site.id && s.status === 'IN_PROGRESS').length;
            return (
              <Link key={site.id} href="/admin/feed">
                <Card className="border-none shadow-sm hover:shadow-md transition-all rounded-[1.8rem] bg-white overflow-hidden group">
                  <CardContent className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                        <MapPin className="w-6 h-6 text-slate-400 group-hover:text-blue-500" />
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 text-sm">{site.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Users className="w-3 h-3 text-blue-500" />
                          <span className="text-[10px] font-bold text-slate-400 uppercase">{siteActiveStaff} Workers On Site</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-blue-500" />
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Workforce Management</h3>
        <div className="grid grid-cols-2 gap-3 px-1">
          <button 
            onClick={() => handleQuickAction('ADD_STAFF')}
            className="flex flex-col items-center justify-center p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:border-blue-200 hover:bg-blue-50/30 transition-all active:scale-95"
          >
            <UserPlus className="w-6 h-6 text-blue-600 mb-2" />
            <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Add Member</span>
          </button>
          <button 
            onClick={() => handleQuickAction('SCHEDULE')}
            className="flex flex-col items-center justify-center p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:border-blue-200 hover:bg-blue-50/30 transition-all active:scale-95"
          >
            <CalendarDays className="w-6 h-6 text-indigo-600 mb-2" />
            <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Schedule</span>
          </button>
          <button 
            onClick={() => handleQuickAction('REPORT')}
            className="flex flex-col items-center justify-center p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:border-blue-200 hover:bg-blue-50/30 transition-all active:scale-95"
          >
            <FileText className="w-6 h-6 text-emerald-600 mb-2" />
            <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Run Report</span>
          </button>
          <Link href="/admin/assets" className="flex flex-col items-center justify-center p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:border-blue-200 hover:bg-blue-50/30 transition-all active:scale-95">
            <Package className="w-6 h-6 text-orange-600 mb-2" />
            <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Supplies</span>
          </Link>
        </div>
      </div>

      <Dialog open={activeModal === 'ADD_STAFF'} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="max-w-[440px] rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
          <div className="p-8 bg-blue-600 text-white">
            <DialogHeader className="text-left space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shadow-lg">
                  <UserPlus className="w-5 h-5 text-white" />
                </div>
                <DialogTitle className="text-2xl font-black text-white">Register Member</DialogTitle>
              </div>
              <DialogDescription className="text-blue-100 font-medium text-sm">
                Add a new field worker to your operational roster.
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="p-8 space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Full Name</Label>
              <Input 
                value={newWorker.name}
                onChange={(e) => setNewWorker({ ...newWorker, name: e.target.value })}
                placeholder="e.g. Maria Thompson" 
                className="h-12 rounded-xl border-slate-100 bg-slate-50 focus-visible:ring-blue-600 font-bold" 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email Address</Label>
              <Input 
                value={newWorker.email}
                onChange={(e) => setNewWorker({ ...newWorker, email: e.target.value })}
                placeholder="maria@affinity.com" 
                className="h-12 rounded-xl border-slate-100 bg-slate-50 focus-visible:ring-blue-600 font-bold" 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Employment Type</Label>
              <Select value={newWorker.type} onValueChange={(val: any) => setNewWorker({ ...newWorker, type: val })}>
                <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-100 font-bold">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EMPLOYEE">Employee (Full Time)</SelectItem>
                  <SelectItem value="CONTRACT">Contractor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="p-8 bg-slate-50 border-t border-slate-100">
             <Button onClick={handleAddStaff} className="w-full h-14 bg-slate-900 text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl shadow-slate-200">
                Confirm Registration
             </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={activeModal === 'SCHEDULE'} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="max-w-[440px] rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
          <div className="p-8 bg-indigo-600 text-white">
            <DialogHeader className="text-left space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shadow-lg">
                  <CalendarDays className="w-5 h-5 text-white" />
                </div>
                <DialogTitle className="text-2xl font-black text-white">Assign Shift</DialogTitle>
              </div>
              <DialogDescription className="text-indigo-100 font-medium text-sm">
                Deploy staff to a specific site and time slot.
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="p-8 space-y-4">
             <div className="space-y-2">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Select Site</Label>
                <Select onValueChange={(val) => setNewShift({ ...newShift, siteId: val })}>
                  <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-100 font-bold">
                    <SelectValue placeholder="Choose a location" />
                  </SelectTrigger>
                  <SelectContent>
                    {repository.sites.map(s => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
             </div>
             <div className="space-y-2">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Assign Worker</Label>
                <Select onValueChange={(val) => setNewShift({ ...newShift, userId: val })}>
                  <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-100 font-bold">
                    <SelectValue placeholder="Search staff" />
                  </SelectTrigger>
                  <SelectContent>
                    {repository.users.filter(u => u.role === 'CLEANER').map(u => (
                      <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
             </div>
             <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Start Time</Label>
                  <Input type="time" className="h-12 rounded-xl bg-slate-50 border-slate-100 font-bold" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">End Time</Label>
                  <Input type="time" className="h-12 rounded-xl bg-slate-50 border-slate-100 font-bold" />
                </div>
             </div>
          </div>
          <DialogFooter className="p-8 bg-slate-50 border-t border-slate-100">
             <Button onClick={handleCreateAssignment} className="w-full h-14 bg-slate-900 text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl shadow-slate-200">
                Create Assignment
             </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={activeModal === 'REPORT'} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="max-w-[440px] rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
          <div className="p-8 bg-emerald-600 text-white">
            <DialogHeader className="text-left space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shadow-lg">
                  <FileBarChart className="w-5 h-5 text-white" />
                </div>
                <DialogTitle className="text-2xl font-black text-white">Operational Reports</DialogTitle>
              </div>
              <DialogDescription className="text-emerald-100 font-medium text-sm">
                Generate data exports for payroll and site audits.
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="p-8 space-y-4">
             <div className="grid grid-cols-1 gap-3">
                <div onClick={() => { setActiveModal(null); toast({ title: "Processing Payroll Export 📊", description: "CSV file is being generated." }); }} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/20 transition-all cursor-pointer group">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Type</p>
                        <p className="text-base font-black text-slate-800">Payroll Hours Export</p>
                        <p className="text-[10px] text-slate-400 font-bold mt-1">CSV Format • Includes break deductions</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                    </div>
                </div>
                <div onClick={() => { setActiveModal(null); toast({ title: "Generating Audit PDF 📊", description: "A summary will be sent to your email." }); }} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/20 transition-all cursor-pointer group">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Type</p>
                        <p className="text-base font-black text-slate-800">Site Performance Audit</p>
                        <p className="text-[10px] text-slate-400 font-bold mt-1">PDF Format • Photos and task logs</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                    </div>
                </div>
                <div onClick={() => { setActiveModal(null); toast({ title: "Incident Summary 📊", description: "Filtering recent field reports." }); }} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/20 transition-all cursor-pointer group">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Type</p>
                        <p className="text-base font-black text-slate-800">Incident & Supply Alerts</p>
                        <p className="text-[10px] text-slate-400 font-bold mt-1">Summary of field issues</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                    </div>
                </div>
             </div>
          </div>
          <DialogFooter className="p-8 bg-slate-50 border-t border-slate-100">
             <div className="w-full text-center text-[9px] font-black text-slate-400 uppercase tracking-widest">
                Select a report type to begin
             </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
