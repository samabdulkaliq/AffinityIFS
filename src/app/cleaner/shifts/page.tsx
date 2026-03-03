
"use client";

import { useState, useMemo } from "react";
import { useAuth } from "@/app/lib/store";
import { repository } from "@/app/lib/repository";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Clock, 
  ChevronRight, 
  CheckCircle2, 
  XCircle,
  Timer,
  LayoutGrid,
  Search,
  Filter,
  MapPin,
  Camera,
  ClipboardCheck,
  Package,
  AlertTriangle,
  Navigation
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

/**
 * @fileOverview Production-Ready Schedule Management.
 * Features state-aware filtering, live operational tracking, and historical issue auditing.
 */

type FilterStatus = 'ALL' | 'TODAY' | 'WEEK' | 'SITES';

export default function CleanerShiftsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState("");

  if (!user) return null;

  // 1. Data Retrieval & Preparation
  const allShifts = useMemo(() => {
    return repository.getShiftsForUser(user.id).sort((a, b) => 
      new Date(b.scheduledStart).getTime() - new Date(a.scheduledStart).getTime()
    );
  }, [user.id]);

  // 2. Filtering Logic
  const filteredShifts = useMemo(() => {
    return allShifts.filter(shift => {
      const matchesSearch = shift.siteName?.toLowerCase().includes(searchQuery.toLowerCase());
      const now = new Date();
      const shiftDate = new Date(shift.scheduledStart);
      
      let matchesFilter = true;
      if (activeFilter === 'TODAY') {
        matchesFilter = shiftDate.toDateString() === now.toDateString();
      } else if (activeFilter === 'WEEK') {
        const weekAway = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        matchesFilter = shiftDate >= now && shiftDate <= weekAway;
      }

      return matchesSearch && matchesFilter;
    });
  }, [allShifts, searchQuery, activeFilter]);

  // 3. Sectioning Logic
  const activeShift = allShifts.find(s => s.status === 'IN_PROGRESS');
  const upcomingShifts = filteredShifts.filter(s => s.status === 'SCHEDULED');
  const historyShifts = filteredShifts.filter(s => s.status === 'COMPLETED' || s.status === 'CANCELLED');

  const calculatePaidHours = (shift: any) => {
    const s = new Date(shift.scheduledStart);
    const e = new Date(shift.scheduledEnd);
    const hours = (e.getTime() - s.getTime()) / (1000 * 60 * 60);
    // Apply Ontario 30min deduction for shifts > 5 hours
    return hours > 5 ? (hours - 0.5).toFixed(1) : hours.toFixed(1);
  };

  return (
    <div className="space-y-8 pb-32 animate-in fade-in duration-700 max-w-lg mx-auto">
      {/* HEADER SECTION */}
      <div className="px-1 space-y-1">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Schedule 📅</h2>
        <p className="text-sm text-slate-500 font-medium">Manage your work and history.</p>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="space-y-4 px-1">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search site name..." 
            className="h-14 pl-12 rounded-2xl border-none shadow-sm bg-white font-medium focus-visible:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {(['ALL', 'TODAY', 'WEEK'] as FilterStatus[]).map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={cn(
                "px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border-2",
                activeFilter === f 
                  ? "bg-slate-900 border-slate-900 text-white shadow-lg" 
                  : "bg-white border-slate-100 text-slate-400 hover:bg-slate-50"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ACTIVE NOW SECTION */}
      {activeShift && (
        <section className="space-y-4">
          <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
            <Timer className="w-4 h-4 animate-pulse" /> Active Now
          </h3>
          <Card 
            onClick={() => router.push('/cleaner/clock')}
            className="border-none shadow-2xl shadow-blue-100 rounded-[2.5rem] bg-white overflow-hidden group active:scale-[0.98] transition-all relative cursor-pointer"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />
            <CardContent className="p-8 space-y-6">
              <div className="flex justify-between items-start relative z-10">
                <div className="space-y-1">
                  <h4 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">{activeShift.siteName}</h4>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{formatDate(activeShift.scheduledStart)}</p>
                </div>
                <Badge className="bg-blue-600 text-white font-black uppercase text-[10px] px-3 py-1 animate-pulse">Live</Badge>
              </div>

              <div className="grid grid-cols-3 gap-2 py-4 border-y border-slate-50 relative z-10">
                 <div className="text-center space-y-1">
                    <p className="text-[8px] font-black text-slate-400 uppercase">Tasks</p>
                    <p className="text-sm font-black text-slate-900">{activeShift.tasks?.filter(t => t.completed).length}/{activeShift.tasks?.length}</p>
                 </div>
                 <div className="text-center space-y-1 border-x border-slate-100">
                    <p className="text-[8px] font-black text-slate-400 uppercase">Photos</p>
                    <p className="text-sm font-black text-slate-900">{activeShift.photosUploaded}/{activeShift.photosRequired}</p>
                 </div>
                 <div className="text-center space-y-1">
                    <p className="text-[8px] font-black text-slate-400 uppercase">GPS</p>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto mt-0.5" />
                 </div>
              </div>

              <div className="flex gap-2 pt-2 relative z-10">
                 <Button asChild className="flex-1 h-14 rounded-2xl bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest shadow-xl shadow-slate-200">
                    <Link href="/cleaner/clock">View Shift</Link>
                 </Button>
                 <Button asChild variant="outline" className="h-14 w-14 rounded-2xl border-slate-100 hover:bg-slate-50" onClick={(e) => e.stopPropagation()}>
                    <Link href="/cleaner/log"><Camera className="w-5 h-5 text-slate-400" /></Link>
                 </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* UPCOMING SECTION */}
      <section className="space-y-4">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
            <Calendar className="w-4 h-4" /> Upcoming
        </h3>
        <div className="space-y-3">
          {upcomingShifts.map((shift) => (
            <Link key={shift.id} href={`/cleaner/shifts/${shift.id}`}>
              <Card className="border-none shadow-sm rounded-3xl bg-white hover:shadow-md transition-all active:scale-[0.98] group overflow-hidden">
                <CardContent className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex flex-col items-center justify-center border border-slate-100 group-hover:bg-blue-50 transition-colors">
                      <span className="text-[8px] font-black text-slate-400 uppercase">{new Date(shift.scheduledStart).toLocaleDateString([], { month: 'short' })}</span>
                      <span className="text-lg font-black text-slate-900">{new Date(shift.scheduledStart).getDate()}</span>
                    </div>
                    <div className="space-y-1">
                      <h5 className="text-sm font-black text-slate-800 leading-none">{shift.siteName}</h5>
                      <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {formatTime(shift.scheduledStart)} – {formatTime(shift.scheduledEnd)}
                      </p>
                      <div className="flex items-center gap-1.5 text-[9px] font-bold text-blue-600 bg-blue-50/50 py-0.5 px-2 rounded-full w-fit">
                        <MapPin className="w-2.5 h-2.5" /> {repository.getSite(shift.siteId)?.address.split(',')[0]}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl hover:bg-blue-50 text-blue-500" onClick={(e) => { e.preventDefault(); e.stopPropagation(); /* Open Maps */ }}>
                       <Navigation className="w-4 h-4" />
                    </Button>
                    <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-blue-500" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
          {upcomingShifts.length === 0 && (
            <div className="py-12 text-center bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-200">
               <Calendar className="w-8 h-8 text-slate-200 mx-auto mb-3" />
               <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No upcoming work</p>
               <p className="text-[10px] text-slate-400 mt-1">Check with your manager for updates.</p>
            </div>
          )}
        </div>
      </section>

      {/* HISTORY SECTION */}
      <section className="space-y-4">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
            <LayoutGrid className="w-4 h-4" /> Past Shifts
        </h3>
        <div className="space-y-3">
          {historyShifts.map((shift) => (
            <Link key={shift.id} href={`/cleaner/shifts/${shift.id}`}>
              <Card className="border-none shadow-sm rounded-3xl bg-white/70 hover:bg-white transition-all group active:scale-[0.98] border-l-4 border-transparent hover:border-emerald-400">
                <CardContent className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center border",
                      shift.status === 'COMPLETED' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"
                    )}>
                      {shift.status === 'COMPLETED' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                    </div>
                    <div className="space-y-1">
                      <h5 className="text-sm font-black text-slate-700 leading-none">{shift.siteName}</h5>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400">
                          {formatDateShort(shift.scheduledStart)}
                        </span>
                        <div className="flex gap-1">
                          <Camera className={cn("w-3 h-3", shift.photosUploaded === shift.photosRequired ? "text-emerald-500" : "text-slate-200")} />
                          <ClipboardCheck className={cn("w-3 h-3", shift.tasks?.every(t => t.completed) ? "text-emerald-500" : "text-slate-200")} />
                          <Package className={cn("w-3 h-3", shift.inventoryChecked ? "text-emerald-500" : "text-slate-200")} />
                        </div>
                      </div>
                      {shift.issues && shift.issues.length > 0 && (
                        <Badge className="bg-red-50 text-red-600 border-none text-[8px] font-black uppercase px-2 py-0">
                          <AlertTriangle className="w-2.5 h-2.5 mr-1" /> Missing documentation
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div className="space-y-0.5">
                      <p className="text-sm font-black text-slate-900">{shift.status === 'COMPLETED' ? calculatePaidHours(shift) : '0.0'}</p>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Paid Hrs</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-200 group-hover:text-blue-500" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
          {historyShifts.length === 0 && (
             <div className="py-12 text-center">
                <p className="text-xs font-black text-slate-300 uppercase tracking-widest italic">No history yet</p>
             </div>
          )}
        </div>
      </section>

      {allShifts.length === 0 && (
        <div className="py-32 text-center space-y-6 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 shadow-inner">
            <Calendar className="w-12 h-12 text-slate-200" />
          </div>
          <div className="space-y-2">
            <p className="text-xl font-black text-slate-700">Empty Schedule</p>
            <p className="text-sm text-slate-400 font-medium px-12">Your upcoming work and past shifts will appear here once assigned.</p>
          </div>
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
