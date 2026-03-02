"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/lib/store";
import { repository } from "@/app/lib/repository";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, ArrowRight, ArrowLeft, Coffee, Info, Navigation, ShieldCheck, AlertCircle, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Shift } from "@/app/lib/models";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default function TimeClockPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeShift, setActiveShift] = useState<Shift | null>(null);
  const [status, setStatus] = useState<'IDLE' | 'ON_SITE' | 'CLOCKED_IN' | 'ON_BREAK'>('IDLE');
  const [locationIssue, setLocationIssue] = useState(false);
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
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-primary">{activeShift.siteName}</h2>
        <p className="text-xs text-muted-foreground flex items-center justify-center">
          <MapPin className="w-3 h-3 mr-1 text-secondary" />
          {repository.getSite(activeShift.siteId)?.address}
        </p>
      </div>

      {/* Map Simulation UI */}
      <div className="px-4">
        <Card className="overflow-hidden border-none shadow-xl bg-slate-100 relative aspect-[4/3] rounded-[2rem]">
          {/* Map Grid Background */}
          <div className="absolute inset-0 opacity-20" 
               style={{ backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
          </div>
          
          {/* Geofence Visualization */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border-2 border-dashed border-secondary/40 bg-secondary/5 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-secondary/10 animate-pulse flex items-center justify-center">
                {/* Site Pin */}
                <div className="relative z-10">
                    <MapPin className="w-8 h-8 text-secondary fill-secondary/20" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full border-2 border-secondary"></div>
                </div>
            </div>
          </div>

          {/* Cleaner Location - Simulated movement if not clocked in */}
          <div className={cn(
            "absolute transition-all duration-1000 ease-in-out",
            status === 'IDLE' ? "top-1/4 left-1/4" : "top-[55%] left-[52%]"
          )}>
            <div className="relative">
                <div className="absolute -inset-4 bg-primary/20 rounded-full animate-ping"></div>
                <div className="w-8 h-8 bg-primary rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white">
                    <User className="w-4 h-4" />
                </div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap">
                    <Badge variant="secondary" className="text-[8px] px-1 py-0 bg-white text-primary font-bold shadow-sm">You</Badge>
                </div>
            </div>
          </div>

          {/* Location HUD Overlay */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
            <div className="bg-white/90 backdrop-blur-sm p-2 rounded-2xl shadow-lg border border-white/50 space-y-1">
                <div className="flex items-center gap-1.5">
                    <Navigation className="w-3 h-3 text-secondary" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Proximity</span>
                </div>
                <p className="text-sm font-black text-primary">
                    {status === 'IDLE' ? '32m Away' : 'On Site'}
                </p>
            </div>

            <div className={cn(
                "p-2 rounded-2xl shadow-lg border backdrop-blur-sm flex items-center gap-2",
                locationIssue ? "bg-red-50 border-red-100" : "bg-green-50 border-green-100"
            )}>
                {locationIssue ? (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                ) : (
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                )}
                <span className={cn(
                    "text-[10px] font-bold uppercase",
                    locationIssue ? "text-red-600" : "text-green-600"
                )}>
                    {locationIssue ? "GPS Error" : "Verified"}
                </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Timer / Progress */}
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className={cn(
          "w-48 h-48 rounded-full border-[8px] flex flex-col items-center justify-center transition-all duration-700 shadow-lg",
          status === 'CLOCKED_IN' ? "border-secondary bg-white" : "border-slate-50 bg-white"
        )}>
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Shift Time</span>
          <span className="text-3xl font-mono font-bold text-primary mt-1">{formatTime(timer)}</span>
          <div className="mt-2 flex items-center text-[10px] font-bold text-muted-foreground uppercase">
             <span className={cn("w-1.5 h-1.5 rounded-full mr-2", status === 'CLOCKED_IN' ? "bg-green-500 animate-pulse" : "bg-slate-300")}></span>
             {status.replace('_', ' ')}
          </div>
        </div>

        <div className="bg-blue-50/50 p-3 rounded-2xl flex items-start gap-3 mx-4 max-w-[320px] border border-blue-100">
          <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-[10px] leading-relaxed text-blue-700">
            <span className="font-bold">System Note:</span> Your location is periodically verified within a 100m geofence around {activeShift.siteName}.
          </p>
        </div>
      </div>

      <div className="space-y-4 px-4">
        {status === 'IDLE' && (
          <Button onClick={handleArrive} className="w-full h-16 rounded-2xl bg-secondary text-lg font-bold shadow-lg shadow-secondary/20">
            Verify Location <ArrowRight className="ml-2 w-6 h-6" />
          </Button>
        )}

        {status === 'ON_SITE' && (
          <Button onClick={handleClockIn} className="w-full h-16 rounded-2xl bg-primary text-lg font-bold shadow-lg shadow-primary/20">
            Clock In Now 🚀
          </Button>
        )}

        {status === 'CLOCKED_IN' && (
          <div className="grid grid-cols-1 gap-3">
            <Button variant="outline" className="h-14 rounded-2xl border-2 border-secondary text-secondary font-bold">
              <Coffee className="mr-2 w-5 h-5" /> Start Break
            </Button>
            <Button onClick={handleClockOut} className="h-14 rounded-2xl bg-red-500 text-white font-bold hover:bg-red-600">
              Clock Out & Leave <ArrowLeft className="ml-2 w-5 h-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
