"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { repository } from "@/app/lib/repository";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  MapPin, 
  Clock, 
  Info, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle,
  FileText,
  CalendarDays
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

/**
 * @fileOverview Shift Details.
 * Full breakdown of time, breaks, and adjustments for a specific shift.
 */

export default function ShiftDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { toast } = useToast();
  const shift = repository.getShift(id);
  
  if (!shift) return <div className="p-12 text-center font-bold text-slate-400">Shift not found</div>;

  const site = repository.getSite(shift.siteId);

  const calculateHours = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    const diffMs = e.getTime() - s.getTime();
    return (diffMs / (1000 * 60 * 60)).toFixed(1);
  };

  const totalHours = parseFloat(calculateHours(shift.scheduledStart, shift.scheduledEnd));
  const breakDeducted = totalHours > 5 ? 0.5 : 0;
  const paidHours = (totalHours - breakDeducted).toFixed(1);

  const handleReviewRequest = () => {
    toast({
      title: "Review Requested",
      description: "A manager will audit your time for this shift."
    });
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
          <ChevronLeft className="w-6 h-6 text-slate-400" />
        </Button>
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Shift Details</h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Archive Reference</p>
        </div>
      </div>

      <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <CardTitle className="text-xl font-black text-slate-900">{shift.siteName}</CardTitle>
              <div className="flex items-center gap-1.5 text-slate-400">
                <MapPin className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-tight">{site?.address}</span>
              </div>
            </div>
            <Badge className={cn(
              "px-3 py-1 font-black uppercase text-[10px] tracking-widest",
              shift.status === 'COMPLETED' ? "bg-emerald-500" :
              shift.status === 'IN_PROGRESS' ? "bg-blue-600" :
              "bg-red-500"
            )}>
              {shift.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-8">
          {/* Time Breakdown */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Clock In</p>
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <Clock className="w-4 h-4 text-blue-500" />
                {formatTime(shift.scheduledStart)}
              </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Clock Out</p>
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <Clock className="w-4 h-4 text-blue-500" />
                {formatTime(shift.scheduledEnd)}
              </div>
            </div>
          </div>

          {/* Payroll Breakdown */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest px-1">Hours Breakdown</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-4 bg-white border border-slate-100 rounded-2xl">
                <span className="text-sm font-bold text-slate-600">Total Duration</span>
                <span className="text-sm font-black text-slate-900">{totalHours} hrs</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-white border border-slate-100 rounded-2xl">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-600">Break Deduction</span>
                  <div className="group relative">
                    <HelpCircle className="w-3.5 h-3.5 text-slate-300" />
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 bg-slate-900 text-white text-[9px] p-3 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl z-50">
                      Ontario Law: A 30-min unpaid break is added to shifts over 5 hours.
                    </div>
                  </div>
                </div>
                <span className="text-sm font-black text-red-500">-{breakDeducted.toFixed(1)} hrs</span>
              </div>
              <div className="flex justify-between items-center p-6 bg-blue-600 text-white rounded-[1.5rem] shadow-lg shadow-blue-100">
                <span className="text-base font-black uppercase tracking-widest">Paid Total</span>
                <span className="text-2xl font-black">{paidHours} hrs</span>
              </div>
            </div>
          </div>

          {/* Manager Notes / Adjustments */}
          {shift.managerNote && (
            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Manager Note</p>
                <p className="text-sm font-medium text-amber-900/80 leading-relaxed italic">"{shift.managerNote}"</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 space-y-3">
            <Button 
              onClick={handleReviewRequest}
              variant="outline" 
              className="w-full h-14 rounded-2xl border-2 border-slate-100 text-slate-600 font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
            >
              <HelpCircle className="w-4 h-4" /> Request Time Review
            </Button>
            <p className="text-[9px] text-center text-slate-400 font-medium px-8">
              Issues with GPS, late arrival, or early leave? Request a review and a manager will check the audit logs.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
