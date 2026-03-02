"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/lib/store";
import { repository } from "@/app/lib/repository";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, ArrowRight, ArrowLeft, Coffee, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Shift, TimeEventType } from "@/app/lib/models";
import { cn } from "@/lib/utils";

export default function TimeClockPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeShift, setActiveShift] = useState<Shift | null>(null);
  const [status, setStatus] = useState<'IDLE' | 'ON_SITE' | 'CLOCKED_IN' | 'ON_BREAK'>('IDLE');
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const shift = repository.getShiftsForUser(user!.id).find(s => s.status === 'SCHEDULED' || s.status === 'IN_PROGRESS');
    if (shift) {
        setActiveShift(shift);
        if (shift.status === 'IN_PROGRESS') setStatus('CLOCKED_IN');
    }
  }, [user]);

  useEffect(() => {
    let interval: any;
    if (status === 'CLOCKED_IN') {
      interval = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [status]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleArrive = () => {
    setStatus('ON_SITE');
    toast({ title: "Arrived at site 📍", description: "You are within the geofence." });
  };

  const handleClockIn = () => {
    setStatus('CLOCKED_IN');
    repository.createTimeEvent({
        userId: user!.id,
        shiftId: activeShift!.id,
        type: 'CLOCK_IN',
        timestamp: new Date().toISOString(),
        source: 'AUTO'
    });
    toast({ title: "Clocked In! ✨", description: "Have a great shift." });
  };

  const handleClockOut = () => {
    setStatus('IDLE');
    repository.createTimeEvent({
        userId: user!.id,
        shiftId: activeShift!.id,
        type: 'CLOCK_OUT',
        timestamp: new Date().toISOString(),
        source: 'AUTO'
    });
    toast({ title: "Clocked Out ✅", description: "Shift summary will be available soon." });
  };

  if (!activeShift) return <div className="p-8 text-center text-muted-foreground">No shift active today.</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-primary">{activeShift.siteName}</h2>
        <p className="text-sm text-muted-foreground flex items-center justify-center">
          <MapPin className="w-4 h-4 mr-1 text-secondary" />
          {repository.getSite(activeShift.siteId)?.address}
        </p>
      </div>

      <div className="flex flex-col items-center justify-center space-y-4">
        <div className={cn(
          "w-64 h-64 rounded-full border-[12px] flex flex-col items-center justify-center transition-all duration-700 shadow-xl",
          status === 'CLOCKED_IN' ? "border-secondary scale-105 bg-white" : "border-slate-100 bg-white"
        )}>
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Active Time</span>
          <span className="text-4xl font-mono font-bold text-primary mt-1">{formatTime(timer)}</span>
          <div className="mt-4 flex items-center text-[10px] font-bold text-muted-foreground uppercase">
             <span className={cn("w-2 h-2 rounded-full mr-2 animate-pulse", status === 'CLOCKED_IN' ? "bg-green-500" : "bg-slate-300")}></span>
             {status.replace('_', ' ')}
          </div>
        </div>

        <div className="bg-blue-50 p-3 rounded-xl flex items-start gap-3 max-w-[320px]">
          <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-[10px] leading-relaxed text-blue-700">
            <span className="font-bold">Ontario Rule:</span> Shifts over 5 hours will automatically include a 30-minute unpaid break.
          </p>
        </div>
      </div>

      <div className="space-y-4 px-4">
        {status === 'IDLE' && (
          <Button onClick={handleArrive} className="w-full h-16 rounded-2xl bg-secondary text-lg font-bold shadow-lg shadow-secondary/20">
            Arrived at Site <ArrowRight className="ml-2 w-6 h-6" />
          </Button>
        )}

        {status === 'ON_SITE' && (
          <Button onClick={handleClockIn} className="w-full h-16 rounded-2xl bg-primary text-lg font-bold shadow-lg shadow-primary/20">
            Clock In Now 🚀
          </Button>
        )}

        {status === 'CLOCKED_IN' && (
          <div className="grid grid-cols-1 gap-4">
            <Button variant="outline" className="h-16 rounded-2xl border-2 border-secondary text-secondary font-bold">
              <Coffee className="mr-2 w-6 h-6" /> Start Break
            </Button>
            <Button onClick={handleClockOut} className="h-16 rounded-2xl bg-red-500 text-white font-bold hover:bg-red-600">
              Leave Site <ArrowLeft className="ml-2 w-6 h-6" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
