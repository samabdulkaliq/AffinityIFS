
"use client";

import { useAuth } from "@/app/lib/store";
import { repository } from "@/app/lib/repository";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  ChevronRight, 
  CheckCircle2, 
  XCircle,
  Timer,
  LayoutGrid
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

/**
 * @fileOverview My Shifts.
 * Simplified view of upcoming and past work with clear hour breakdowns.
 */

export default function CleanerShiftsPage() {
  const { user } = useAuth();
  if (!user) return null;

  // Sorting shifts chronologically, descending
  const shifts = repository.getShiftsForUser(user.id).sort((a, b) => 
    new Date(b.scheduledStart).getTime() - new Date(a.scheduledStart).getTime()
  );

  const activeShift = shifts.find(s => s.status === 'IN_PROGRESS');
  const upcomingShifts = shifts.filter(s => s.status === 'SCHEDULED');
  const pastShifts = shifts.filter(s => s.status === 'COMPLETED' || s.status === 'CANCELLED');

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'COMPLETED': return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case 'IN_PROGRESS': return "bg-blue-50 text-blue-600 border-blue-100";
      case 'CANCELLED': return "bg-red-50 text-red-600 border-red-100";
      default: return "bg-slate-50 text-slate-500 border-slate-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle2 className="w-4 h-4" />;
      case 'CANCELLED': return <XCircle className="w-4 h-4" />;
      case 'IN_PROGRESS': return <Timer className="w-4 h-4 animate-pulse" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const calculateHours = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    const diffMs = e.getTime() - s.getTime();
    const hours = diffMs / (1000 * 60 * 60);
    return hours.toFixed(1);
  };

  const calculatePaidHours = (start: string, end: string) => {
    const hours = parseFloat(calculateHours(start, end));
    // Apply Ontario 30min deduction for shifts > 5 hours
    if (hours > 5) return (hours - 0.5).toFixed(1);
    return hours.toFixed(1);
  };

  return (
    <div className="space-y-8 pb-32 animate-in fade-in duration-700">
      <div className="px-1 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Schedule 📅</h2>
          <p className="text-sm text-slate-500 font-medium mt-2">Manage your work and history.</p>
        </div>
        <Badge variant="outline" className="font-black border-slate-200">
          {shifts.length} TOTAL
        </Badge>
      </div>

      {/* Active Today */}
      {activeShift && (
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-widest px-2">Active now 🔥</h3>
          <Link href={`/cleaner/shifts/${activeShift.id}`}>
            <Card className="border-none shadow-xl shadow-blue-100 rounded-[2rem] bg-white group active:scale-[0.98] transition-all overflow-hidden border-l-4 border-l-blue-500">
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h4 className="text-2xl font-black text-slate-900 leading-tight">{activeShift.siteName}</h4>
                    <p className="text-xs text-slate-500 font-bold">{formatDate(activeShift.scheduledStart)}</p>
                  </div>
                  <Badge className="bg-blue-600 text-white font-black uppercase text-[10px] px-3">Live</Badge>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-2 text-slate-600 font-bold text-sm">
                    <Clock className="w-4 h-4 text-blue-500" />
                    Working since {formatTime(activeShift.scheduledStart)}
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      )}

      {/* Upcoming Pipeline */}
      {upcomingShifts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Upcoming 🗓️</h3>
          <div className="space-y-3">
            {upcomingShifts.map((shift) => (
              <Link key={shift.id} href={`/cleaner/shifts/${shift.id}`}>
                <Card className="border-none shadow-sm rounded-3xl bg-white hover:shadow-md transition-all active:scale-[0.98] group">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-slate-50 flex flex-col items-center justify-center border border-slate-100 group-hover:bg-blue-50 transition-colors">
                        <span className="text-[8px] font-black text-slate-400 uppercase">{new Date(shift.scheduledStart).toLocaleDateString([], { month: 'short' })}</span>
                        <span className="text-lg font-black text-slate-900">{new Date(shift.scheduledStart).getDate()}</span>
                      </div>
                      <div className="space-y-0.5">
                        <h5 className="text-sm font-black text-slate-800">{shift.siteName}</h5>
                        <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {formatTime(shift.scheduledStart)} – {formatTime(shift.scheduledEnd)}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-blue-500" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Past Verified History */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">History 📂</h3>
        <div className="space-y-3">
          {pastShifts.map((shift) => (
            <Link key={shift.id} href={`/cleaner/shifts/${shift.id}`}>
              <Card className="border-none shadow-sm rounded-3xl bg-white/70 hover:bg-white transition-all group active:scale-[0.98]">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center border-2",
                      getStatusStyle(shift.status)
                    )}>
                      {getStatusIcon(shift.status)}
                    </div>
                    <div className="space-y-0.5">
                      <h5 className="text-sm font-black text-slate-700">{shift.siteName}</h5>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400">
                          {formatDateShort(shift.scheduledStart)}
                        </span>
                        <Badge variant="outline" className={cn("text-[7px] font-black px-1.5 py-0 border", getStatusStyle(shift.status))}>
                          {shift.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div className="space-y-0.5">
                      <p className="text-sm font-black text-slate-900">{shift.status === 'COMPLETED' ? calculatePaidHours(shift.scheduledStart, shift.scheduledEnd) : '0.0'}</p>
                      <p className="text-[8px] font-black text-slate-400 uppercase">Paid Hrs</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-200 group-hover:text-blue-500" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {shifts.length === 0 && (
        <div className="py-24 text-center space-y-4 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center">
            <LayoutGrid className="w-10 h-10 text-slate-200" />
          </div>
          <p className="text-slate-400 font-black text-xs uppercase tracking-widest">No Shift History</p>
        </div>
      )}
    </div>
  );
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
}

function formatDateShort(iso: string) {
  return new Date(iso).toLocaleDateString([], { month: 'short', day: 'numeric' });
}
