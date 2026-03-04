
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
  AlertTriangle, 
  HelpCircle,
  FileText,
  User,
  Activity,
  ShieldCheck,
  Camera,
  ClipboardCheck,
  MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

/**
 * @fileOverview Time Audit Detail.
 * Managers review clock-in data, exceptions, and evidence before final approval.
 */

export default function TimeAuditDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { toast } = useToast();
  const shift = repository.getShift(id);
  
  if (!shift) return <div className="p-12 text-center font-bold text-slate-400">Shift not found</div>;

  const user = repository.getUser(shift.userId);
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

  const handleApprove = () => {
    repository.updateShiftStatus(shift.id, 'COMPLETED'); // Keep status
    shift.reviewStatus = 'APPROVED';
    toast({ title: "Hours Approved ✅", description: "Record is ready for payroll." });
    router.back();
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
          <ChevronLeft className="w-6 h-6 text-slate-400" />
        </Button>
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Audit Record</h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Shift Reference #{shift.id.split('-')[1]}</p>
        </div>
      </div>

      <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-slate-100 overflow-hidden">
                <img src={user?.avatarUrl} alt={user?.name} className="w-full h-full object-cover" />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-xl font-black text-slate-900 leading-none">{user?.name}</CardTitle>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <MapPin className="w-3 h-3" />
                  <span className="text-[10px] font-bold uppercase tracking-tight">{shift.siteName}</span>
                </div>
              </div>
            </div>
            <Badge className={cn(
              "px-3 py-1 font-black uppercase text-[10px] tracking-widest",
              shift.reviewStatus === 'APPROVED' ? "bg-emerald-500" :
              shift.reviewStatus === 'FLAGGED' ? "bg-red-500" : "bg-amber-500"
            )}>
              {shift.reviewStatus}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-8">
          {/* Time & GPS Status */}
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

          <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-black text-emerald-900 uppercase tracking-tight">Geofence Verified</span>
            </div>
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          </div>

          {/* Operational evidence */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Work Evidence</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-white border border-slate-100 rounded-2xl flex flex-col items-center text-center gap-2">
                <Camera className={cn("w-6 h-6", shift.photosUploaded === shift.photosRequired ? "text-emerald-500" : "text-amber-500")} />
                <div>
                  <p className="text-lg font-black text-slate-900 leading-none">{shift.photosUploaded}/{shift.photosRequired}</p>
                  <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">Photos Taken</p>
                </div>
              </div>
              <div className="p-4 bg-white border border-slate-100 rounded-2xl flex flex-col items-center text-center gap-2">
                <ClipboardCheck className={cn("w-6 h-6", shift.tasks?.every(t => t.completed) ? "text-emerald-500" : "text-amber-500")} />
                <div>
                  <p className="text-lg font-black text-slate-900 leading-none">{shift.tasks?.filter(t => t.completed).length}/{shift.tasks?.length}</p>
                  <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">Tasks Done</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payroll Breakdown */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Payroll Breakdown</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-4 bg-white border border-slate-100 rounded-2xl">
                <span className="text-sm font-bold text-slate-600">Actual Duration</span>
                <span className="text-sm font-black text-slate-900">{totalHours} hrs</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-white border border-slate-100 rounded-2xl">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-600">Break Deduction</span>
                  <HelpCircle className="w-3.5 h-3.5 text-slate-300" />
                </div>
                <span className="text-sm font-black text-red-500">-{breakDeducted.toFixed(1)} hrs</span>
              </div>
              <div className="flex justify-between items-center p-6 bg-slate-900 text-white rounded-[1.5rem] shadow-xl">
                <span className="text-base font-black uppercase tracking-widest">Paid Hours</span>
                <span className="text-2xl font-black">{paidHours} hrs</span>
              </div>
            </div>
          </div>

          {/* Exceptions/Flags */}
          {shift.issues && shift.issues.length > 0 && (
            <div className="bg-red-50 p-5 rounded-2xl border border-red-100 space-y-3">
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-widest">Shift Exceptions</span>
              </div>
              <ul className="space-y-2">
                {shift.issues.map((issue, i) => (
                  <li key={i} className="flex items-center gap-2 text-red-900/70 text-xs font-bold">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                    {issue.replace('_', ' ')}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col gap-3">
            <Button 
              onClick={handleApprove}
              className="w-full h-16 rounded-[2rem] bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-200 transition-all active:scale-95"
            >
              Approve for Payroll
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-14 rounded-2xl border-2 font-black uppercase text-[10px] tracking-widest">
                <MessageSquare className="w-4 h-4 mr-2" /> Note
              </Button>
              <Button variant="outline" className="h-14 rounded-2xl border-2 font-black uppercase text-[10px] tracking-widest text-red-500 border-red-100 hover:bg-red-50">
                <AlertTriangle className="w-4 h-4 mr-2" /> Flag
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
