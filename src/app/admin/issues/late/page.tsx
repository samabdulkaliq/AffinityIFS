
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { repository } from "@/app/lib/repository";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  MessageSquare, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function LateArrivalsQueue() {
  const router = useRouter();
  const { toast } = useToast();
  const [lateShifts, setLateShifts] = useState(repository.getLateShifts());

  const handleResolve = (id: string, action: 'EXCUSED' | 'FLAGGED') => {
    const shift = repository.getShift(id);
    if (shift) {
      repository.updateShift(id, { issues: shift.issues?.filter(i => i !== 'LATE_ARRIVAL') });
      setLateShifts(repository.getLateShifts());
      toast({ title: "Issue Resolved", description: `Late arrival marked as ${action.toLowerCase()}.` });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-24">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
          <ArrowLeft className="w-6 h-6 text-slate-400" />
        </Button>
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Late Arrivals</h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Attendance Exceptions</p>
        </div>
      </div>

      <div className="space-y-4">
        {lateShifts.length > 0 ? lateShifts.map((shift) => {
          const worker = repository.getUser(shift.userId);
          const arrivalTime = new Date(shift.scheduledStart);
          arrivalTime.setMinutes(arrivalTime.getMinutes() + 45); // Mock arrival time

          return (
            <Card key={shift.id} className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden group">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={worker?.avatarUrl} />
                      <AvatarFallback>{worker?.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-black text-slate-900 leading-none">{worker?.name}</h4>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{shift.siteName}</p>
                    </div>
                  </div>
                  <Badge className="bg-amber-50 text-amber-600 border-none font-black text-[10px] px-3">45 MIN LATE</Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase">Scheduled</p>
                    <p className="text-sm font-bold text-slate-700">{new Date(shift.scheduledStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 space-y-1">
                    <p className="text-[9px] font-black text-amber-600 uppercase">Actual Arrival</p>
                    <p className="text-sm font-bold text-amber-700">{arrivalTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-[10px] font-bold text-emerald-700 uppercase">Geofence Verified @ Site</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    onClick={() => handleResolve(shift.id, 'EXCUSED')}
                    variant="outline" 
                    className="h-14 rounded-2xl border-2 font-black uppercase text-[10px] tracking-widest hover:bg-emerald-50"
                  >
                    Mark Excused
                  </Button>
                  <Button 
                    onClick={() => handleResolve(shift.id, 'FLAGGED')}
                    className="h-14 rounded-2xl bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest shadow-xl shadow-slate-200"
                  >
                    Flag Shift
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        }) : (
          <div className="py-24 text-center space-y-4">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-emerald-200" />
            </div>
            <p className="text-slate-400 font-black text-xs uppercase tracking-widest">No Late Staff</p>
          </div>
        )}
      </div>
    </div>
  );
}
