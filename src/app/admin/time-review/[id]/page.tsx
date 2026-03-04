
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
  Camera,
  ClipboardCheck,
  MessageSquare,
  ShieldCheck,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function TimeAuditDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { toast } = useToast();
  const shift = repository.getShift(id);
  
  if (!shift) return <div className="p-12 text-center font-bold text-slate-400">Shift not found</div>;

  const user = repository.getUser(shift.userId);

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
    repository.updateShiftStatus(shift.id, 'COMPLETED');
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
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Reference #{shift.id.split('-')[1]}</p>
        </div>
      </div>

      <Card className="border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-[1.5rem] bg-white flex items-center justify-center shadow-sm border border-slate-100 overflow-hidden">
                <img src={user?.avatarUrl} alt={user?.name} className="w-full h-full object-cover" />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-2xl font-black text-slate-900 leading-none">{user?.name}</CardTitle>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-tight">{shift.siteName}</span>
                </div>
              </div>
            </div>
            <Badge className={cn(
              "px-3 py-1 font-black uppercase text-[10px] tracking-widest",
              shift.reviewStatus === 'APPROVED' ? "bg-emerald-500" :
              shift.reviewStatus === 'FLAGGED' ? "bg-red-500" : "bg-amber-500"
            )}>
              {shift.reviewStatus?.replace('_', ' ')}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="p-8 space-y-8">
          {/* Times Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Clock In</p>
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <Clock className="w-4 h-4 text-blue-500" />
                {formatTime(shift.scheduledStart)}
              </div>
            </div>
            <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Clock Out</p>
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <Clock className="w-4 h-4 text-blue-500" />
                {formatTime(shift.scheduledEnd)}
              </div>
            </div>
          </div>

          {/* Operational Verification */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Verification Status</h3>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center justify-between p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm font-bold text-emerald-900">Geofence Verified</span>
                </div>
                <Badge className="bg-emerald-500 text-white text-[8px] font-black border-none">VALID</Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-blue-50/50 border border-blue-100 rounded-2xl">
                <div className="flex items-center gap-3">
                  <Camera className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-bold text-blue-900">Photos Documented</span>
                </div>
                <span className="text-xs font-black text-blue-600">{shift.photosUploaded}/{shift.photosRequired}</span>
              </div>
            </div>
          </div>

          {/* Payroll Breakdown */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Payroll Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-5 bg-white border border-slate-100 rounded-3xl shadow-sm">
                <span className="text-sm font-bold text-slate-600">Actual Duration</span>
                <span className="text-sm font-black text-slate-900">{totalHours} hrs</span>
              </div>
              <div className="flex justify-between items-center p-5 bg-white border border-slate-100 rounded-3xl shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-600">Break Deduction</span>
                  <HelpCircle className="w-3.5 h-3.5 text-slate-300" />
                </div>
                <span className="text-sm font-black text-red-500">-{breakDeducted.toFixed(1)} hrs</span>
              </div>
              <div className="flex justify-between items-center p-7 bg-slate-900 text-white rounded-[2rem] shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -mr-16 -mt-16" />
                <span className="text-base font-black uppercase tracking-widest relative z-10">Paid Hours</span>
                <span className="text-3xl font-black relative z-10">{paidHours} hrs</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col gap-3">
            <Button 
              onClick={handleApprove}
              className="w-full h-18 rounded-[2.5rem] bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-xs tracking-widest shadow-2xl shadow-blue-200 transition-all active:scale-95"
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
