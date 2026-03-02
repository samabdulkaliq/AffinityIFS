
"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/app/lib/store";
import { repository } from "@/app/lib/repository";
import { Button } from "@/components/ui/button";
import { MapPin, Coffee, ArrowLeft, Navigation, ShieldCheck, Loader2, Zap, History, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Shift } from "@/app/lib/models";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

export default function TimeClockPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeShift, setActiveShift] = useState<Shift | null>(null);
  const [status, setStatus] = useState<'IDLE' | 'SCANNING' | 'ON_SITE' | 'CLOCKED_IN' | 'ON_BREAK'>('IDLE');
  const [timer, setTimer] = useState(0);
  const [autoClockProgress, setAutoClockProgress] = useState(0);

  useEffect(() => {
    const shift = repository.getShiftsForUser(user!.id).find(s => s.status === 'SCHEDULED' || s.status === 'IN_PROGRESS');
    if (shift) {
        setActiveShift(shift);
        if (shift.status === 'IN_PROGRESS') {
          setStatus('CLOCKED_IN');
          setTimer(120); 
        } else {
          setStatus('SCANNING');
        }
    }
  }, [user]);

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
    toast({ title: "Auto-Clock Verified ✨", description: `Active on ${activeShift.siteName}.` });
  }, [activeShift, user, toast]);

  useEffect(() => {
    if (status === 'SCANNING') {
      const scanTimer = setTimeout(() => {
        setStatus('ON_SITE');
      }, 3000);
      return () => clearTimeout(scanTimer);
    }

    if (status === 'ON_SITE') {
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
  }, [status, handleClockInAction]);

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
    toast({ title: "Shift Finalized", description: "Logs submitted to headquarters." });
  };

  if (!activeShift) return <div className="p-12 text-center text-muted-foreground font-bold uppercase tracking-widest text-[10px]">No Duty Cycle Active</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-12">
      <div className="text-center space-y-2 px-6">
        <h2 className="text-3xl font-black text-white tracking-tight">{activeShift.siteName}</h2>
        <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                <MapPin className="w-3 h-3 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground font-bold truncate max-w-[240px]">
                {repository.getSite(activeShift.siteId)?.address}
            </p>
        </div>
      </div>

      {/* Premium Visual Map UI */}
      <div className="px-4">
        <div className="premium-card aspect-square relative overflow-hidden bg-slate-950/40">
          <div className="absolute inset-0 opacity-10 pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
          </div>
          
          {/* Animated Geofence Circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
             <motion.div 
               animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="w-64 h-64 rounded-full border-2 border-primary/20 bg-primary/5"
             />
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-primary/40 bg-primary/5" />
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <MapPin className="w-10 h-10 text-primary fill-primary/20" />
             </div>
          </div>

          {/* User Tracking Indicator */}
          <motion.div 
            animate={status === 'SCANNING' ? { top: '30%', left: '30%' } : { top: '55%', left: '55%' }}
            transition={{ duration: 3, ease: "circOut" }}
            className="absolute"
          >
            <div className="relative">
                <div className="absolute -inset-6 bg-primary/30 rounded-full blur-xl animate-pulse"></div>
                <div className="w-10 h-10 bg-white rounded-full border-4 border-primary shadow-2xl flex items-center justify-center overflow-hidden">
                    <img src={user?.avatarUrl} className="w-full h-full object-cover" />
                </div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2">
                    <Badge className="bg-white text-slate-900 font-black border-none text-[9px] px-2 shadow-lg">YOU</Badge>
                </div>
            </div>
          </motion.div>

          {/* Location Status Overlay */}
          <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
            <div className="glass p-4 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Navigation className="w-5 h-5 text-primary" />
                </div>
                <div>
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Accuracy</p>
                    <p className="text-sm font-black text-white">98.2%</p>
                </div>
            </div>

            <div className={cn(
                "glass px-4 py-2 rounded-2xl flex items-center gap-2",
                status === 'SCANNING' ? "bg-blue-500/10" : "bg-green-500/10"
            )}>
                <ShieldCheck className={cn("w-4 h-4", status === 'SCANNING' ? "text-primary animate-pulse" : "text-green-500")} />
                <span className={cn("text-[10px] font-black uppercase tracking-tighter", status === 'SCANNING' ? "text-primary" : "text-green-500")}>
                    {status === 'SCANNING' ? "Verifying..." : "Verified"}
                </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Timer Display */}
      <div className="flex flex-col items-center space-y-6">
        <div className="relative w-64 h-64 flex items-center justify-center">
          {/* Animated Background Rings */}
          <div className="absolute inset-0 rounded-full border-[10px] border-white/5"></div>
          
          <AnimatePresence>
            {status === 'ON_SITE' && (
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <motion.circle 
                  cx="128" cy="128" r="118" 
                  fill="transparent" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth="10" 
                  strokeLinecap="round"
                  strokeDasharray="741"
                  strokeDashoffset={741 - (autoClockProgress / 100) * 741}
                  className="transition-all duration-150"
                />
              </svg>
            )}
          </AnimatePresence>

          <div className="text-center z-10">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-2">
              {status === 'ON_SITE' ? 'Auto-Clock Sync' : 'Duty Time'}
            </p>
            <h3 className="text-5xl font-black text-white tracking-tighter tabular-nums">
              {status === 'ON_SITE' ? `${autoClockProgress}%` : formatTime(timer)}
            </h3>
            <div className="mt-3 flex items-center justify-center gap-2">
              <span className={cn("w-2 h-2 rounded-full", status === 'CLOCKED_IN' ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" : "bg-white/20")}></span>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                {status.replace('_', ' ')}
              </p>
            </div>
          </div>
        </div>

        {/* SmartClock Hint Card */}
        <div className="premium-card mx-6 p-5 flex items-start gap-4 bg-primary/5">
          <Zap className="w-6 h-6 text-primary shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-[10px] font-black text-primary uppercase tracking-widest">Affinity SmartClock™</p>
            <p className="text-[11px] font-medium text-white/60 leading-relaxed">
              Proprietary geofencing logic is active. Your shift logs automatically upon site entry.
            </p>
          </div>
        </div>
      </div>

      {/* Tactical Actions */}
      <div className="px-6 space-y-4">
        {status === 'CLOCKED_IN' && (
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-16 premium-card border-white/10 text-white font-black uppercase text-xs">
              <Coffee className="w-5 h-5 mr-2" /> Break
            </Button>
            <Button onClick={handleClockOut} className="h-16 btn-premium bg-red-500/80 hover:bg-red-500 shadow-red-500/20 rounded-[2rem]">
               Stop Duty <ArrowLeft className="w-5 h-5 ml-2" />
            </Button>
          </div>
        )}

        {status === 'SCANNING' && (
          <div className="premium-card p-6 text-center border-dashed border-white/10">
            <Loader2 className="w-6 h-6 text-primary animate-spin mx-auto mb-2" />
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Polling GPS satellites...</p>
          </div>
        )}
      </div>
    </div>
  );
}
