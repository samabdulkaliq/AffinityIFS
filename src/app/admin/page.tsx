
"use client";

import { useMemo, useState } from "react";
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
  ArrowRight
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

export default function AdminDashboard() {
  const { toast } = useToast();
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const pendingRequests = repository.getReviewRequests().filter(r => r.status === 'PENDING');
  const expiredCerts = repository.getWorkersWithExpiredCerts();
  const allShifts = repository.shifts;
  const activeShifts = allShifts.filter(s => s.status === 'IN_PROGRESS');

  // Calculate Operational Metrics
  const metrics = useMemo(() => {
    const activeStaffCount = new Set(activeShifts.map(s => s.userId)).size;
    const activeSitesCount = new Set(activeShifts.map(s => s.siteId)).size;
    
    // Mocking "On Break" and "Issues" based on repository data
    const workersOnBreak = repository.timeEvents.filter(e => e.type === 'BREAK_START').length - 
                           repository.timeEvents.filter(e => e.type === 'BREAK_END').length;
    
    const issuesDetected = allShifts.filter(s => (s.issues?.length || 0) > 0).length;

    return {
      activeStaffCount,
      activeSitesCount,
      workersOnBreak: Math.max(0, workersOnBreak),
      issuesDetected
    };
  }, [activeShifts, allShifts]);

  // AI Insights Logic
  const aiInsights = [
    { text: "Metro Hub missing 2 work photos", icon: Camera },
    { text: `${expiredCerts.length} certification expires this week`, icon: Shield },
    { text: "Sam Tester is currently on a break", icon: Coffee }
  ];

  const handleQuickAction = (action: string) => {
    setActiveModal(action);
  };
  
  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-28">
      {/* Header */}
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

      {/* 1. Smart Alerts */}
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
                        <p className="text-sm font-black text-red-900">{expiredCerts.length} Certifications Expired</p>
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

      {/* 2. Live Operations Overview */}
      <Card className="border-none bg-slate-900 shadow-2xl rounded-[2.5rem] overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] -mr-32 -mt-32" />
        <CardContent className="p-8 space-y-8 relative z-10">
          <div>
            <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">Operations Overview</p>
            <h3 className="text-white text-2xl font-black mt-1">Live Metrics</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Staff Active", value: metrics.activeStaffCount, icon: Users, color: "text-blue-400" },
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

      {/* 3. AI Operations Assistant */}
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

      {/* 4. Workforce Management / Site Pulse */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Site Activity Pulse</h3>
          <Link href="/admin/feed">
            <Badge variant="outline" className="border-slate-200 text-slate-400 font-black cursor-pointer hover:bg-slate-100">VIEW ALL</Badge>
          </Link>
        </div>
        <div className="space-y-3">
          {repository.sites.slice(0, 3).map((site) => {
            const siteActiveStaff = activeShifts.filter(s => s.siteId === site.id).length;
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
                          <span className="text-[10px] font-bold text-slate-400 uppercase">{siteActiveStaff} Workers Active</span>
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

      {/* 5. Workforce Management Quick Actions */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Workforce Management</h3>
        <div className="grid grid-cols-2 gap-3 px-1">
          <button 
            onClick={() => handleQuickAction('ADD_STAFF')}
            className="flex flex-col items-center justify-center p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:border-blue-200 hover:bg-blue-50/30 transition-all active:scale-95"
          >
            <PlusCircle className="w-6 h-6 text-blue-600 mb-2" />
            <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Add Staff</span>
          </button>
          <button 
            onClick={() => handleQuickAction('SCHEDULE')}
            className="flex flex-col items-center justify-center p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:border-blue-200 hover:bg-blue-50/30 transition-all active:scale-95"
          >
            <CalendarPlus className="w-6 h-6 text-indigo-600 mb-2" />
            <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Schedule</span>
          </button>
          <button 
            onClick={() => handleQuickAction('REPORT')}
            className="flex flex-col items-center justify-center p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:border-blue-200 hover:bg-blue-50/30 transition-all active:scale-95"
          >
            <FileBarChart className="w-6 h-6 text-emerald-600 mb-2" />
            <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Run Report</span>
          </button>
          <Link href="/admin/assets" className="flex flex-col items-center justify-center p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:border-blue-200 hover:bg-blue-50/30 transition-all active:scale-95">
            <Package className="w-6 h-6 text-orange-600 mb-2" />
            <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Supply Mgmt</span>
          </Link>
        </div>
      </div>

      {/* MODALS FOR QUICK ACTIONS */}
      <Dialog open={activeModal === 'ADD_STAFF'} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="max-w-[440px] rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
          <div className="p-8 bg-blue-600 text-white">
            <DialogHeader className="text-left space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shadow-lg">
                  <PlusCircle className="w-5 h-5 text-white" />
                </div>
                <DialogTitle className="text-2xl font-black text-white">Register Staff</DialogTitle>
              </div>
              <DialogDescription className="text-blue-100 font-medium text-sm">
                Add a new field worker to your operational roster.
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="p-8 space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Full Name</Label>
              <Input placeholder="e.g. Maria Thompson" className="h-12 rounded-xl border-slate-100 bg-slate-50 focus-visible:ring-blue-600 font-bold" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email Address</Label>
              <Input placeholder="maria@affinity.com" className="h-12 rounded-xl border-slate-100 bg-slate-50 focus-visible:ring-blue-600 font-bold" />
            </div>
          </div>
          <DialogFooter className="p-8 bg-slate-50 border-t border-slate-100">
             <Button onClick={() => { setActiveModal(null); toast({ title: "Staff Registered ✅", description: "Worker added to directory." }); }} className="w-full h-14 bg-slate-900 text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl shadow-slate-200">
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
                  <CalendarPlus className="w-5 h-5 text-white" />
                </div>
                <DialogTitle className="text-2xl font-black text-white">Schedule Shift</DialogTitle>
              </div>
              <DialogDescription className="text-indigo-100 font-medium text-sm">
                Assign work sites and times to your staff.
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="p-8 space-y-6">
             <div className="bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-200 text-center">
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Select Site & Worker</p>
                <div className="flex justify-center mt-4">
                   <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-400">
                      <Search className="w-6 h-6" />
                   </div>
                </div>
             </div>
          </div>
          <DialogFooter className="p-8 bg-slate-50 border-t border-slate-100">
             <Button onClick={() => setActiveModal(null)} className="w-full h-14 bg-slate-900 text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl shadow-slate-200">
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
                <DialogTitle className="text-2xl font-black text-white">Operational Report</DialogTitle>
              </div>
              <DialogDescription className="text-emerald-100 font-medium text-sm">
                Generate performance and payroll data.
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="p-8 space-y-4">
             <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-all cursor-pointer">
                    <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Type</p>
                    <p className="text-sm font-bold text-slate-800">Payroll Export</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-all cursor-pointer">
                    <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Type</p>
                    <p className="text-sm font-bold text-slate-800">Site Performance</p>
                </div>
             </div>
          </div>
          <DialogFooter className="p-8 bg-slate-50 border-t border-slate-100">
             <Button onClick={() => { setActiveModal(null); toast({ title: "Report Generated 📊", description: "Sent to your email." }); }} className="w-full h-14 bg-slate-900 text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl shadow-slate-200">
                Run Report
             </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
