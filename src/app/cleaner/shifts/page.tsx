"use client";

import { useAuth } from "@/app/lib/store";
import { repository } from "@/app/lib/repository";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, ChevronRight, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="px-1">
        <h2 className="text-3xl font-black text-[#0F172A] tracking-tight">Cycle</h2>
        <p className="text-[10px] font-black text-[#94A3B8] uppercase tracking-[0.4em] mt-1">Operational History</p>
      </div>

      {/* Active Section */}
      {activeShift && (
        <div className="space-y-4">
          <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest px-1">Today's Operation</h3>
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <Card className="border-none shadow-xl shadow-blue-100 rounded-[2rem] overflow-hidden bg-white border-l-8 border-blue-500">
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h4 className="text-xl font-black text-[#0F172A]">{activeShift.siteName}</h4>
                    <div className="flex items-center gap-1.5 text-slate-400">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium truncate max-w-[200px]">{repository.getSite(activeShift.siteId)?.address}</span>
                    </div>
                  </div>
                  <Badge className="bg-blue-600 text-white font-black uppercase text-[9px] tracking-widest px-3 py-1">
                    Active
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 pt-2 border-t border-slate-50">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
                            <Clock className="w-4 h-4 text-slate-400" />
                        </div>
                        <span className="text-xs font-black text-[#475569]">
                            {new Date(activeShift.scheduledStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-slate-200" />
                    <span className="text-xs font-bold text-slate-400">8h Duration</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Upcoming Section */}
      <div className="space-y-4">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Next Schedules</h3>
        <div className="space-y-3">
          {upcomingShifts.map((shift, i) => (
            <motion.div 
              key={shift.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-none shadow-sm hover:shadow-md transition-all rounded-2xl overflow-hidden bg-white group">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex flex-col items-center justify-center shrink-0 border border-slate-100">
                        <span className="text-[9px] font-black text-slate-400 uppercase leading-none">{new Date(shift.scheduledStart).toLocaleDateString([], { month: 'short' })}</span>
                        <span className="text-base font-black text-[#0F172A]">{new Date(shift.scheduledStart).toLocaleDateString([], { day: 'numeric' })}</span>
                    </div>
                    <div className="space-y-0.5">
                        <h5 className="text-sm font-black text-[#0F172A] group-hover:text-blue-600 transition-colors">{shift.siteName}</h5>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                            {new Date(shift.scheduledStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} Start
                        </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-all" />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* History Section */}
      <div className="space-y-4">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Past Operations</h3>
        <div className="space-y-3">
          {pastShifts.map((shift, i) => (
            <Card key={shift.id} className="border-none shadow-sm rounded-2xl overflow-hidden bg-white/50">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border", getStatusStyle(shift.status))}>
                        {getStatusIcon(shift.status)}
                    </div>
                    <div className="space-y-0.5">
                        <h5 className="text-sm font-bold text-[#475569]">{shift.siteName}</h5>
                        <p className="text-[10px] font-medium text-slate-400">
                            {new Date(shift.scheduledStart).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className={cn("text-[8px] font-black uppercase tracking-widest border-2 px-2 py-0", getStatusStyle(shift.status))}>
                        {shift.status}
                    </Badge>
                    {shift.status === 'COMPLETED' && (
                        <p className="text-[9px] font-bold text-emerald-600 mt-1 uppercase">8.0 hrs</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {shifts.length === 0 && (
        <div className="py-20 text-center space-y-4 bg-slate-100/50 rounded-[2rem] border-2 border-dashed border-slate-200 mx-1">
          <Calendar className="w-12 h-12 text-slate-200 mx-auto" />
          <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">No history found</p>
        </div>
      )}
    </div>
  );
}
