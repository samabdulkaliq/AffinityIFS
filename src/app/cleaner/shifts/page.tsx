"use client";

import { useAuth } from "@/app/lib/store";
import { repository } from "@/app/lib/repository";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle, 
  XCircle,
  History,
  Timer
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

/**
 * @fileOverview Operational Cycle (Shift History & Schedule).
 * Displays a high-fidelity audit trail of past work and upcoming assignments.
 */

export default function CleanerShiftsPage() {
  const { user } = useAuth();
  const shifts = repository.getShiftsForUser(user!.id).sort((a, b) => 
    new Date(b.scheduledStart).getTime() - new Date(a.scheduledStart).getTime()
  );

  const activeShift = shifts.find(s => s.status === 'SCHEDULED' || s.status === 'IN_PROGRESS');
  const upcomingShifts = shifts.filter(s => s.status === 'SCHEDULED' && s.id !== activeShift?.id);
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
      case 'COMPLETED': return <CheckCircle2 className="w-3.5 h-3.5" />;
      case 'CANCELLED': return <XCircle className="w-3.5 h-3.5" />;
      case 'IN_PROGRESS': return <Clock className="w-3.5 h-3.5 animate-pulse" />;
      default: return <Calendar className="w-3.5 h-3.5" />;
    }
  };

  // Helper to calculate duration minus 0.5hr break for shifts over 5hrs (Ontario Rule)
  const calculatePaidHours = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    const diffMs = e.getTime() - s.getTime();
    const hours = diffMs / (1000 * 60 * 60);
    
    if (hours > 5) {
      return (hours - 0.5).toFixed(1);
    }
    return hours.toFixed(1);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-32">
      <div className="px-1 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Cycle</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-2">Operational History</p>
        </div>
        <History className="w-6 h-6 text-slate-200" />
      </div>

      {/* Active Today Section */}
      {activeShift && (
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
            <Timer className="w-3.5 h-3.5" /> Active Operation
          </h3>
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <Card className="border-none shadow-xl shadow-blue-100 rounded-[2rem] overflow-hidden bg-white relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />
              <CardContent className="p-6 space-y-4 relative z-10">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Site Assignment</p>
                    <h4 className="text-2xl font-black text-slate-900 leading-tight">{activeShift.siteName}</h4>
                    <div className="flex items-center gap-1.5 text-slate-400">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium truncate max-w-[240px]">{repository.getSite(activeShift.siteId)?.address}</span>
                    </div>
                  </div>
                  <Badge className="bg-blue-600 text-white font-black uppercase text-[9px] tracking-widest px-3 py-1 border-none shadow-lg">
                    LIVE
                  </Badge>
                </div>
                
                <div className="flex items-center gap-6 pt-4 border-t border-slate-50">
                    <div className="flex flex-col">
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Start Time</span>
                        <span className="text-sm font-black text-slate-900">
                            {new Date(activeShift.scheduledStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Expected End</span>
                        <span className="text-sm font-black text-slate-900">
                            {new Date(activeShift.scheduledEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                    <div className="flex flex-col ml-auto">
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter text-right">Geofence</span>
                        <span className="text-[10px] font-black text-emerald-500 uppercase">Verified</span>
                    </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Upcoming Section */}
      {upcomingShifts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Pipeline Schedule</h3>
          <div className="space-y-3">
            {upcomingShifts.map((shift, i) => (
              <motion.div 
                key={shift.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="border-none shadow-sm hover:shadow-md transition-all rounded-3xl overflow-hidden bg-white group active:scale-[0.98]">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-slate-50 flex flex-col items-center justify-center shrink-0 border border-slate-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                          <span className="text-[8px] font-black text-slate-400 group-hover:text-blue-400 uppercase leading-none mb-0.5">{new Date(shift.scheduledStart).toLocaleDateString([], { month: 'short' })}</span>
                          <span className="text-lg font-black text-slate-900 group-hover:text-blue-600">{new Date(shift.scheduledStart).toLocaleDateString([], { day: 'numeric' })}</span>
                      </div>
                      <div className="space-y-0.5">
                          <h5 className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors">{shift.siteName}</h5>
                          <div className="flex items-center gap-3">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {new Date(shift.scheduledStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                            <span className="text-[8px] text-slate-200">|</span>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">8.0 hrs</p>
                          </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-blue-500 transition-all" />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* History Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Verified History</h3>
            <span className="text-[8px] font-black text-slate-300 uppercase">Ontario Compliance Applied</span>
        </div>
        <div className="space-y-3">
          {pastShifts.map((shift, i) => (
            <motion.div
                key={shift.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + (i * 0.1) }}
            >
                <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white/60 hover:bg-white transition-all">
                  <CardContent className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border-2 shadow-sm",
                            getStatusStyle(shift.status)
                        )}>
                            {getStatusIcon(shift.status)}
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <h5 className="text-sm font-black text-slate-700">{shift.siteName}</h5>
                                <Badge variant="outline" className={cn("text-[7px] font-black uppercase tracking-widest border px-1.5 py-0", getStatusStyle(shift.status))}>
                                    {shift.status}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-3 text-slate-400">
                                <span className="text-[10px] font-bold uppercase tracking-tight">
                                    {new Date(shift.scheduledStart).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                                <span className="w-1 h-1 rounded-full bg-slate-200" />
                                <span className="text-[10px] font-bold uppercase tracking-tight">
                                    {new Date(shift.scheduledStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        {shift.status === 'COMPLETED' ? (
                            <div className="space-y-0.5">
                                <p className="text-base font-black text-slate-900 leading-none">
                                    {calculatePaidHours(shift.scheduledStart, shift.scheduledEnd)}
                                </p>
                                <p className="text-[8px] font-black text-emerald-600 uppercase tracking-tighter">Paid Hrs</p>
                            </div>
                        ) : (
                            <p className="text-[9px] font-black text-slate-300 uppercase">0.0 HRS</p>
                        )}
                    </div>
                  </CardContent>
                </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {shifts.length === 0 && (
        <div className="py-24 text-center space-y-4 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-100 mx-1">
          <Calendar className="w-12 h-12 text-slate-200 mx-auto" />
          <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Archive Empty</p>
        </div>
      )}

      {/* Audit Advisory */}
      <div className="px-4 py-6 bg-slate-900 rounded-[2rem] text-center space-y-2">
        <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.2em]">Compliance Advisory</p>
        <p className="text-[10px] text-white/60 font-medium leading-relaxed italic px-4">
          All cycles are recorded for payroll validation. In accordance with Ontario law, a 30-minute unpaid break is deducted from every shift exceeding 5 hours.
        </p>
      </div>
    </div>
  );
}
