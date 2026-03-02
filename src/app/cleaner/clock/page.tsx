"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/app/lib/store";
import { repository } from "@/app/lib/repository";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, ArrowRight, ArrowLeft, Coffee, Info, Navigation, ShieldCheck, AlertCircle, User, Loader2, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Shift } from "@/app/lib/models";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default function TimeClockPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeShift, setActiveShift] = useState<Shift | null>(null);
  const [status, setStatus] = useState<'IDLE' | 'SCANNING' | 'ON_SITE' | 'CLOCKED_IN' | 'ON_BREAK'>('IDLE');
  const [locationIssue, setLocationIssue] = useState(false);
  const [timer, setTimer] = useState(0);
  const [autoClockProgress, setAutoClockProgress] = useState(0);

  // Initialize shift data
  useEffect(() => {
    const shift = repository.getShiftsForUser(user!.id).find(s => s.status === 'SCHEDULED' || s.status === 'IN_PROGRESS');
    if (shift) {
        setActiveShift(shift);
        if (shift.status === 'IN_PROGRESS') {
          setStatus('CLOCKED_IN');
          // Estimate timer based on clock-in event if possible, but for demo just start at 0 or a fixed value
          setTimer(120); 
        } else {
          // Start the scanning process automatically when the page loads
          setStatus('SCANNING');
        }
    }
  }, [user]);

  // Main Shift Timer
  useEffect(() => {
    let interval: any;
    if (status === 'CLOCKED_IN') {
      interval = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [status]);

  const handleClockInAction = useCallback(() => {
    if (!activeShift || !user) return;
    
    setStatus('CLOCKED_IN');
    repository.createTimeEvent({
        userId: user.id,
        shiftId: activeShift.id,
        type: 'CLOCK_IN',
        timestamp: new Date().toISOString(),
        source: 'AUTO'
    });
    
    toast({ 
      title: "Auto Clock-In Successful! ✨", 
      description: `Shift started at ${activeShift.siteName}.` 
    });
  }, [activeShift, user, toast]);

  // Simulated Geofence Logic: Scanning -> On Site -> Auto Clock
  useEffect(() => {
    if (status === 'SCANNING') {
      const scanTimer = setTimeout(() => {
        setStatus('ON_SITE');
        toast({ title: "Site Detected 📍", description: "Geofence verified. Preparing auto-clock..." });
      }, 3000);
      return () => clearTimeout(scanTimer);
    }

    if (status === 'ON_SITE') {
      // Show progress bar for "Hands-free" clock in
      const progressInterval = setInterval(() => {
        setAutoClockProgress(p => {
          if (p >= 100) {
            clearInterval(progressInterval);
            handleClockInAction();
            return 100;
          }
          return p + 5;
        });
      }, 100);
      return () => clearInterval(progressInterval);
    }
  }, [status, handleClockInAction, toast]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
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
    toast({ title: "Clocked Out ✅", description: "Shift summary sent to admin." });
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
          <div className="absolute inset-0 opacity-20" 
               style={{ backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
          </div>
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border-2 border-dashed border-secondary/40 bg-secondary/5 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-secondary/10 animate-pulse flex items-center justify-center">
                <div className="relative z-10">
                    <MapPin className="w-8 h-8 text-secondary fill-secondary/20" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full border-2 border-secondary"></div>
                </div>
            </div>
          </div>

          <div className={cn(
            "absolute transition-all duration-[3000ms] ease-in-out",
            status === 'SCANNING' ? "top-1/4 left-1/4" : "top-[55%] left-[52%]"
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

          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
            <div className="bg-white/90 backdrop-blur-sm p-2 rounded-2xl shadow-lg border border-white/50 space-y-1">
                <div className="flex items-center gap-1.5">
                    <Navigation className="w-3 h-3 text-secondary" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Status</span>
                </div>
                <p className="text-sm font-black text-primary">
                    {status === 'SCANNING' ? 'Approaching...' : 'Inside Zone'}
                </p>
            </div>

            <div className={cn(
                "p-2 rounded-2xl shadow-lg border backdrop-blur-sm flex items-center gap-2",
                status === 'SCANNING' ? "bg-blue-50 border-blue-100" : "bg-green-50 border-green-100"
            )}>
                {status === 'SCANNING' ? (
                    <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                ) : (
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                )}
                <span className={cn(
                    "text-[10px] font-bold uppercase",
                    status === 'SCANNING' ? "text-blue-600" : "text-green-600"
                )}>
                    {status === 'SCANNING' ? "Verifying..." : "Secure Geofence"}
                </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Auto Clock Progress / Main Timer */}
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className={cn(
          "w-48 h-48 rounded-full border-[8px] flex flex-col items-center justify-center transition-all duration-700 shadow-lg relative",
          status === 'CLOCKED_IN' ? "border-secondary bg-white" : "border-slate-50 bg-white"
        )}>
          {status === 'ON_SITE' && (
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle 
                cx="96" cy="96" r="88" 
                fill="transparent" 
                stroke="hsl(var(--secondary))" 
                strokeWidth="8" 
                strokeDasharray={`${(autoClockProgress / 100) * 553} 553`}
                className="transition-all duration-100"
              />
            </svg>
          )}

          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest z-10">
            {status === 'ON_SITE' ? 'Auto-Clocking' : 'Shift Time'}
          </span>
          <span className="text-3xl font-mono font-bold text-primary mt-1 z-10">
            {status === 'ON_SITE' ? `${autoClockProgress}%` : formatTime(timer)}
          </span>
          <div className="mt-2 flex items-center text-[10px] font-bold text-muted-foreground uppercase z-10">
             <span className={cn("w-1.5 h-1.5 rounded-full mr-2", status === 'CLOCKED_IN' ? "bg-green-500 animate-pulse" : "bg-slate-300")}></span>
             {status.replace('_', ' ')}
          </div>
        </div>

        <div className="bg-blue-50/50 p-4 rounded-2xl flex items-start gap-3 mx-4 max-w-[340px] border border-blue-100">
          <Zap className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-[10px] leading-relaxed text-blue-700 font-bold uppercase tracking-widest">Hands-Free Mode Active</p>
            <p className="text-[10px] leading-relaxed text-slate-500">
              Affinity SmartClock™ will automatically log your start and end times based on your proximity to the site. Please keep the app running in the background.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 px-4">
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

        {status === 'SCANNING' && (
          <div className="text-center p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-xs text-muted-foreground animate-pulse">Waiting for GPS entry signal...</p>
          </div>
        )}
      </div>
    </div>
  );
}
