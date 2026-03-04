
"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { repository } from "../lib/repository";
import { 
  AlertTriangle, 
  Camera, 
  Package, 
  ChevronRight, 
  MapPin,
  Users,
  Sparkles,
  Building2,
  UserPlus,
  CalendarDays,
  FileText,
  Clock,
  CheckCircle2,
  Map,
  MessageSquare,
  ShieldAlert,
  Zap
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const { toast } = useToast();
  
  // Real-time derived metrics
  const allShifts = repository.shifts;
  const activeShifts = allShifts.filter(s => s.status === 'IN_PROGRESS');
  const lateShifts = allShifts.filter(s => s.issues?.includes('LATE_ARRIVAL'));
  const noShows = allShifts.filter(s => s.status === 'CANCELLED'); // Mocking no-show as cancelled for now
  const pendingReviews = allShifts.filter(s => s.reviewStatus === 'NEEDS_REVIEW').length;
  const expiredCerts = repository.getWorkersWithExpiredCerts();

  const activityMetrics = [
    { label: "Scheduled", value: allShifts.length, icon: CalendarDays, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "On Site", value: activeShifts.length, icon: MapPin, color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "Late", value: lateShifts.length, icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
    { label: "No-Show", value: noShows.length, icon: AlertTriangle, color: "text-red-500", bg: "bg-red-50" },
  ];

  const alerts = [
    { text: `${lateShifts.length} worker arrived late`, icon: Clock, color: "text-amber-600" },
    { text: `${allShifts.filter(s => (s.photosUploaded || 0) < (s.photosRequired || 0)).length} shifts missing photos`, icon: Camera, color: "text-blue-600" },
    { text: `${expiredCerts.length} certification expired`, icon: ShieldAlert, color: "text-red-600" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-28">
      {/* 1. Header */}
      <div className="flex justify-between items-end px-1">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Admin Overview</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Today's Summary</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">System Live</span>
        </div>
      </div>

      {/* 2. Daily Activity Snapshot */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Activity Snapshot</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-1">
          {activityMetrics.map((stat, i) => (
            <div key={i} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center text-center space-y-2">
              <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center", stat.bg)}>
                <stat.icon className={cn("w-5 h-5", stat.color)} />
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Smart Alerts (Action Required) */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
          <Zap className="w-3 h-3" /> Action Required
        </h3>
        <div className="space-y-2 px-1">
          {alerts.map((alert, i) => (
            <Card key={i} className="border-none bg-white shadow-sm rounded-2xl overflow-hidden group hover:border-slate-200 transition-all border border-transparent">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={cn("w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center")}>
                    <alert.icon className={cn("w-5 h-5", alert.color)} />
                  </div>
                  <span className="text-sm font-bold text-slate-700">{alert.text}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-all" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 4. Quick Actions */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Operations</h3>
        <div className="grid grid-cols-2 gap-3 px-1">
          <button className="flex flex-col items-center justify-center p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:bg-slate-50 transition-all active:scale-95">
            <UserPlus className="w-6 h-6 text-blue-600 mb-2" />
            <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Assign Staff</span>
          </button>
          <button className="flex flex-col items-center justify-center p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:bg-slate-50 transition-all active:scale-95">
            <CalendarDays className="w-6 h-6 text-indigo-600 mb-2" />
            <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Create Shift</span>
          </button>
          <Link href="/admin/time-review" className="flex flex-col items-center justify-center p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:bg-slate-50 transition-all active:scale-95 relative">
            <Clock className="w-6 h-6 text-emerald-600 mb-2" />
            <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Review Hours</span>
            {pendingReviews > 0 && (
              <Badge className="absolute top-4 right-4 bg-emerald-500 text-white border-none font-black text-[10px]">
                {pendingReviews}
              </Badge>
            )}
          </Link>
          <button className="flex flex-col items-center justify-center p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:bg-slate-50 transition-all active:scale-95">
            <MessageSquare className="w-6 h-6 text-orange-600 mb-2" />
            <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Send Message</span>
          </button>
        </div>
      </div>

      {/* 5. Site Status Cards */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Site Overview</h3>
        <div className="space-y-3 px-1">
          {repository.sites.map((site) => {
            const siteShifts = allShifts.filter(s => s.siteId === site.id);
            const activeOnSite = siteShifts.filter(s => s.status === 'IN_PROGRESS').length;
            const isAlert = siteShifts.some(s => s.issues && s.issues.length > 0);

            return (
              <Card key={site.id} className="border-none shadow-sm rounded-3xl overflow-hidden bg-white group">
                <CardContent className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm border",
                      isAlert ? "bg-amber-50 border-amber-100 text-amber-500" : "bg-blue-50 border-blue-100 text-blue-500"
                    )}>
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-sm leading-tight">{site.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] font-bold text-slate-400 uppercase">{siteShifts.length} Staff Today</span>
                        <div className="w-1 h-1 rounded-full bg-slate-200" />
                        <span className={cn(
                          "text-[9px] font-black uppercase",
                          activeOnSite > 0 ? "text-emerald-600" : "text-slate-400"
                        )}>
                          {activeOnSite} On Site
                        </span>
                      </div>
                    </div>
                  </div>
                  {isAlert && <AlertTriangle className="w-5 h-5 text-amber-500" />}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* 6. AI Assistant Insights */}
      <div className="px-1">
        <Card className="border-none bg-slate-900 shadow-xl rounded-[2.5rem] overflow-hidden relative group active:scale-[0.98] transition-all">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -mr-32 -mt-32" />
          <CardContent className="p-8 relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none">AI Insight</p>
                <h4 className="text-white font-black text-lg mt-1">Smart Optimization</h4>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-white/80">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                <p className="text-sm font-medium tracking-tight">Alex Rivera finished 30 minutes early today. Review shift history before payroll approval.</p>
              </div>
              <div className="flex items-start gap-3 text-white/80">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                <p className="text-sm font-medium tracking-tight">Supply usage at Metro Hub is 20% higher than average this week.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
