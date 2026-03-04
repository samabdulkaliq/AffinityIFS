
"use client";

import { useState, useMemo } from "react";
import { repository } from "@/app/lib/repository";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  ChevronRight, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Filter,
  Building2,
  Inbox,
  Camera,
  MapPin,
  ClipboardCheck
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type DateFilter = 'TODAY' | 'WEEK' | 'CUSTOM';
type StatusFilter = 'NEEDS_REVIEW' | 'FLAGGED' | 'APPROVED' | 'ALL';

export default function TimeReviewPage() {
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilter>('TODAY');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('NEEDS_REVIEW');

  const completedShifts = useMemo(() => {
    return repository.shifts.filter(s => s.status === 'COMPLETED');
  }, []);

  const filteredShifts = useMemo(() => {
    return completedShifts.filter(shift => {
      const user = repository.getUser(shift.userId);
      const matchesSearch = user?.name.toLowerCase().includes(search.toLowerCase()) || 
                            shift.siteName?.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = statusFilter === 'ALL' || shift.reviewStatus === statusFilter;

      // Date logic
      const shiftDate = new Date(shift.scheduledStart);
      const now = new Date();
      let matchesDate = true;
      if (dateFilter === 'TODAY') {
        matchesDate = shiftDate.toDateString() === now.toDateString();
      } else if (dateFilter === 'WEEK') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        matchesDate = shiftDate >= weekAgo;
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [completedShifts, search, statusFilter, dateFilter]);

  const stats = useMemo(() => ({
    needsReview: completedShifts.filter(s => s.reviewStatus === 'NEEDS_REVIEW').length,
    flagged: completedShifts.filter(s => s.reviewStatus === 'FLAGGED').length,
    approved: completedShifts.filter(s => s.reviewStatus === 'APPROVED').length,
    total: completedShifts.length
  }), [completedShifts]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-24">
      {/* HEADER */}
      <div className="px-1 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Time Review</h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Audit and approve hours</p>
        </div>
        <Badge variant="outline" className="bg-white border-slate-200 text-slate-400 font-black px-3 py-1">
          {filteredShifts.length} RECORDS
        </Badge>
      </div>

      {/* SUMMARY SECTION */}
      <div className="grid grid-cols-2 gap-3 px-1">
        {[
          { label: "Pending", value: stats.needsReview, color: "text-amber-500", bg: "bg-amber-50" },
          { label: "Flagged", value: stats.flagged, color: "text-red-500", bg: "bg-red-50" },
          { label: "Approved", value: stats.approved, color: "text-emerald-500", bg: "bg-emerald-50" },
          { label: "Total", value: stats.total, color: "text-slate-500", bg: "bg-slate-50" },
        ].map((s, i) => (
          <div key={i} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
              <p className={cn("text-2xl font-black", s.color)}>{s.value}</p>
            </div>
            <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", s.bg)}>
               <div className={cn("w-1.5 h-1.5 rounded-full", s.color.replace('text', 'bg'))} />
            </div>
          </div>
        ))}
      </div>

      {/* FILTERS */}
      <div className="space-y-4 px-1">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search staff or site..." 
            className="h-14 pl-12 rounded-2xl border-none shadow-sm bg-white font-medium focus-visible:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {(['NEEDS_REVIEW', 'FLAGGED', 'APPROVED', 'ALL'] as StatusFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={cn(
                "px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border-2",
                statusFilter === f 
                  ? "bg-slate-900 border-slate-900 text-white shadow-lg" 
                  : "bg-white border-slate-100 text-slate-400 hover:bg-slate-50"
              )}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          {(['TODAY', 'WEEK', 'CUSTOM'] as DateFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setDateFilter(f)}
              className={cn(
                "flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                dateFilter === f 
                  ? "bg-blue-50 border-blue-200 text-blue-600 shadow-sm" 
                  : "bg-white border-slate-100 text-slate-400 hover:bg-slate-50"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* SHIFT LIST */}
      <div className="space-y-3">
        {filteredShifts.map((shift) => {
          const user = repository.getUser(shift.userId);
          const isVerified = !shift.issues?.includes('GPS_MISMATCH');
          const isPhotosDone = shift.photosUploaded === shift.photosRequired;
          const isTasksDone = shift.tasks?.every(t => t.completed);

          return (
            <Link key={shift.id} href={`/admin/time-review/${shift.id}`}>
              <Card className="border-none shadow-sm hover:shadow-md transition-all rounded-[2rem] bg-white overflow-hidden group">
                <CardContent className="p-0">
                  <div className="flex items-stretch min-h-[100px]">
                    <div className={cn(
                      "w-1.5",
                      shift.reviewStatus === 'APPROVED' ? "bg-emerald-500" :
                      shift.reviewStatus === 'FLAGGED' ? "bg-red-500" : "bg-amber-400"
                    )} />
                    <div className="flex-1 p-6 flex items-center justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-slate-900 text-base leading-tight">{user?.name}</h4>
                          <Badge className={cn(
                            "text-[8px] font-black uppercase px-2 py-0 border-none",
                            shift.reviewStatus === 'APPROVED' ? "bg-emerald-100 text-emerald-700" :
                            shift.reviewStatus === 'FLAGGED' ? "bg-red-100 text-red-700" :
                            "bg-amber-100 text-amber-700"
                          )}>
                            {shift.reviewStatus?.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5" /> {shift.siteName}
                        </p>
                        <div className="flex items-center gap-4 pt-1">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-slate-300" />
                            <span className="text-[10px] font-black text-slate-500 tabular-nums">
                              {formatTime(shift.scheduledStart)} – {formatTime(shift.scheduledEnd)}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 border-l border-slate-100 pl-4">
                            <MapPin className={cn("w-3.5 h-3.5", isVerified ? "text-emerald-500" : "text-red-500")} />
                            <Camera className={cn("w-3.5 h-3.5", isPhotosDone ? "text-emerald-500" : "text-amber-500")} />
                            <ClipboardCheck className={cn("w-3.5 h-3.5", isTasksDone ? "text-emerald-500" : "text-amber-500")} />
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}

        {filteredShifts.length === 0 && (
          <div className="py-24 text-center space-y-4">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto border border-slate-100">
              <Inbox className="w-10 h-10 text-slate-200" />
            </div>
            <div className="space-y-1">
              <p className="text-slate-400 font-black text-xs uppercase tracking-widest">All hours reviewed</p>
              <p className="text-slate-300 text-[10px] font-medium px-12">No shifts need approval right now.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
