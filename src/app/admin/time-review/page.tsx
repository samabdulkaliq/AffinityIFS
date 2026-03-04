
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
  ArrowUpRight,
  Calendar,
  Building2,
  Inbox
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Shift } from "@/app/lib/models";

/**
 * @fileOverview Time Review Dashboard.
 * Managers audit work hours before payroll processing.
 */

type DateFilter = 'TODAY' | 'WEEK' | 'CUSTOM';
type StatusFilter = 'NEEDS_REVIEW' | 'APPROVED' | 'FLAGGED' | 'ALL';

export default function TimeReviewPage() {
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilter>('TODAY');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('NEEDS_REVIEW');
  const [siteFilter, setSiteFilter] = useState("ALL");

  const completedShifts = useMemo(() => {
    return repository.shifts.filter(s => s.status === 'COMPLETED');
  }, []);

  const filteredShifts = useMemo(() => {
    return completedShifts.filter(shift => {
      const user = repository.getUser(shift.userId);
      const matchesSearch = user?.name.toLowerCase().includes(search.toLowerCase()) || 
                            shift.siteName?.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = statusFilter === 'ALL' || shift.reviewStatus === statusFilter;
      const matchesSite = siteFilter === 'ALL' || shift.siteId === siteFilter;

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

      return matchesSearch && matchesStatus && matchesSite && matchesDate;
    });
  }, [completedShifts, search, statusFilter, siteFilter, dateFilter]);

  const calculateSummary = useMemo(() => {
    const totalHours = filteredShifts.reduce((acc, s) => {
      const hours = (new Date(s.scheduledEnd).getTime() - new Date(s.scheduledStart).getTime()) / 3600000;
      return acc + (hours > 5 ? hours - 0.5 : hours);
    }, 0);

    return {
      totalHours: totalHours.toFixed(1),
      pending: filteredShifts.filter(s => s.reviewStatus === 'NEEDS_REVIEW').length,
      flagged: filteredShifts.filter(s => s.reviewStatus === 'FLAGGED').length,
      deductions: filteredShifts.filter(s => {
        const hours = (new Date(s.scheduledEnd).getTime() - new Date(s.scheduledStart).getTime()) / 3600000;
        return hours > 5;
      }).length * 0.5
    };
  }, [filteredShifts]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-24">
      {/* HEADER */}
      <div className="px-1 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Time Review</h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Review and approve hours</p>
        </div>
        <Badge variant="outline" className="bg-white border-slate-200 text-slate-400 font-black px-3 py-1">
          {filteredShifts.length} RECORDS
        </Badge>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 gap-3 px-1">
        <Card className="border-none shadow-sm bg-blue-600 text-white rounded-3xl overflow-hidden">
          <CardContent className="p-5 space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-100">Paid Hours</p>
            <div className="flex items-baseline gap-1">
              <h3 className="text-3xl font-black">{calculateSummary.totalHours}</h3>
              <span className="text-xs font-bold text-blue-200">HRS</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden border border-slate-100">
          <CardContent className="p-5 space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Deductions</p>
            <div className="flex items-baseline gap-1">
              <h3 className="text-3xl font-black text-red-500">-{calculateSummary.deductions.toFixed(1)}</h3>
              <span className="text-xs font-bold text-slate-400">HRS</span>
            </div>
          </CardContent>
        </Card>
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
          const hours = (new Date(shift.scheduledEnd).getTime() - new Date(shift.scheduledStart).getTime()) / 3600000;
          const paidHours = hours > 5 ? (hours - 0.5).toFixed(1) : hours.toFixed(1);

          return (
            <Link key={shift.id} href={`/admin/time-review/${shift.id}`}>
              <Card className="border-none shadow-sm hover:shadow-md transition-all rounded-[1.8rem] bg-white overflow-hidden group">
                <CardContent className="p-0">
                  <div className="flex items-stretch min-h-[100px]">
                    <div className={cn(
                      "w-1.5",
                      shift.reviewStatus === 'APPROVED' ? "bg-emerald-500" :
                      shift.reviewStatus === 'FLAGGED' ? "bg-red-500" : "bg-amber-400"
                    )} />
                    <div className="flex-1 p-5 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-sm",
                          shift.reviewStatus === 'APPROVED' ? "bg-emerald-50 text-emerald-500 border-emerald-100" :
                          shift.reviewStatus === 'FLAGGED' ? "bg-red-50 text-red-500 border-red-100" :
                          "bg-amber-50 text-amber-500 border-amber-100"
                        )}>
                          {shift.reviewStatus === 'APPROVED' ? <CheckCircle2 className="w-6 h-6" /> : 
                           shift.reviewStatus === 'FLAGGED' ? <AlertTriangle className="w-6 h-6" /> : 
                           <Clock className="w-6 h-6" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-black text-slate-900 text-sm leading-tight">{user?.name}</h4>
                            <Badge className={cn(
                              "text-[8px] font-black uppercase px-2 py-0 border-none",
                              shift.reviewStatus === 'APPROVED' ? "bg-emerald-100 text-emerald-700" :
                              shift.reviewStatus === 'FLAGGED' ? "bg-red-100 text-red-700" :
                              "bg-amber-100 text-amber-700"
                            )}>
                              {shift.reviewStatus}
                            </Badge>
                          </div>
                          <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1 mt-1">
                            <Building2 className="w-3 h-3" /> {shift.siteName}
                          </p>
                          <p className="text-[9px] font-black text-slate-300 uppercase tracking-tighter mt-1">
                            {formatTime(shift.scheduledStart)} – {formatTime(shift.scheduledEnd)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-slate-900 leading-none">{paidHours}</p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">Paid Hrs</p>
                      </div>
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
              <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Inbox Zero</p>
              <p className="text-slate-300 text-[10px] font-medium px-12">Shifts will appear here once team members complete their work.</p>
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
