"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "@/app/lib/store";
import { repository } from "@/app/lib/repository";
import { Button } from "@/components/ui/button";
import { MapPin, Coffee, Navigation, ShieldCheck, Loader2, Zap, AlertCircle, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Shift } from "@/app/lib/models";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

/**
 * @fileOverview Premium Duty (Time Clock) page.
 * Implements "Hands-Free" Auto-Clock logic with simulated geofencing scenarios.
 */

export default function TimeClockPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Scenarios: IDLE -> SCANNING -> ON_SITE (Syncing) -> CLOCKED_IN -> ON_BREAK
  const [activeShift, setActiveShift] = useState<Shift | null>(null);
  const [status, setStatus] = useState<'IDLE' | 'SCANNING' | 'ON_SITE' | 'CLOCKED_IN' | 'ON_BREAK'>('IDLE');
  const [timer, setTimer] = useState(0);
  const [autoClockProgress, setAutoClockProgress] = useState(0);
  const [distance, setDistance] = useState(0.85); // Simulated distance in KM

  // Initialize shift data based on mock repository scenarios
  useEffect(() => {
    if (!user) return;
    const shifts = repository.getShiftsForUser(user.id);
    
    // Find a shift to work on
    const shift = shifts.find(s => s.status === 'SCHEDULED' || s.status === 'IN_PROGRESS');
    
    if (shift) {
        setActiveShift(shift);
        if (shift.status === 'IN_PROGRESS') {
          setStatus('CLOCKED_IN');
          // Mock timer start (e.g., 2 hours in)
          setTimer(7200); 
        } else {
          // If scheduled, we start in "Scanning" mode as they approach the site
          setStatus('SCANNING');
        }
    }
  }, [user]);

  // Timer logic for active shifts
  useEffect(() => {
    let interval: any;
    if (status === 'CLOCKED_IN') {
      interval = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [status]);

  // Mocking the distance change to trigger "ON_SITE" status
  useEffect(() => {
    if (status === 'SCANNING') {
      const distanceInterval = setInterval(() => {
        setDistance(prev => {
          const next = prev - 0.05;
          if (next <= 0.15) {
            clearInterval(distanceInterval);
            setStatus('ON_SITE');
            return 0.12;
          }
          return next;
        });
      }, 1000);
      return () => clearInterval(distanceInterval);
    }
  }, [status]);

  // Hand-free clock-in execution
  const executeAutoClockIn = useCallback(() => {
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
      title: "SmartClock™ Verified", 
      description: `You have been automatically clocked into ${activeShift.siteName}.` 
    });
  }, [activeShift, user, toast]);

  // Auto-Clock sync progress (Simulating 3 seconds of verification)
  useEffect(() => {
    if (status === 'ON_SITE') {
      const progressInterval = setInterval(() => {
        setAutoClockProgress(p => {
          if (p >= 100) {
            clearInterval(progressInterval);
            executeAutoClockIn();
            return 100;
          }
          return p + 4;
        });
      }, 100);
      return () => clearInterval(progressInterval);
    }
  }, [status, executeAutoClockIn]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleToggleBreak = () => {
    if (status === 'CLOCKED_IN') {
      setStatus('ON_BREAK');
      toast({ title: "Break Started", description: "Enjoy your rest." });
    } else {
      setStatus('CLOCKED_IN');
      toast({ title: "Welcome Back", description: "Break ended. Shift resumed." });
    }
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
    toast({ title: "Shift Finalized", description: "Duty cycle complete. Logs archived." });
  };

  if (!activeShift) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4 px-8">
        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-slate-300" />
        </div>
        <div>
            <h3 className="text-xl font-black text-slate-900">No Duty Cycle</h3>
            <p className="text-sm text-slate-500 font-medium mt-1">Check your schedule for upcoming shifts.</p>
        </div>
        <Button variant="outline" className="rounded-2xl border-2 font-bold px-8">View Schedule</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      {/* Header Info */}
      <div className="text-center space-y-2 px-6">
        <div className="flex items-center justify-center gap-2 mb-1">
            <Badge variant="outline" className="border-blue-100 text-blue-600 bg-blue-50/50 font-black text-[9px] px-2 py-0">
                ACTIVE DUTY
            </Badge>
        </div>
        <h2 className="text-3xl font-black text-[#0F172A] tracking-tight leading-tight">{activeShift.siteName}</h2>
        <div className="flex items-center justify-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <p className="text-xs text-[#475569] font-bold truncate max-w-[280px]">
                {repository.getSite(activeShift.siteId)?.address}
            </p>
        </div>
      </div>

      {/* Visual HUD Interface */}
      <div className="px-4">
        <div className="premium-card aspect-[4/3] relative overflow-hidden bg-white border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem]">
          {/* Map Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(circle, #0F172A 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
          </div>
          
          {/* Geofence Radar Pulse */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
             <motion.div 
               animate={{ scale: [1, 1.8, 1], opacity: [0.1, 0.2, 0.1] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="w-56 h-56 rounded-full border-2 border-blue-500/20 bg-blue-500/5"
             />
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-4 h-4 bg-blue-600 rounded-full shadow-[0_0_25px_rgba(37,99,235,0.8)] border-4 border-white" />
             </div>
          </div>

          {/* User Tracking Marker */}
          <motion.div 
            animate={status === 'SCANNING' ? { top: '30%', left: '30%' } : { top: '55%', left: '55%' }}
            transition={{ duration: 3, ease: "circOut" }}
            className="absolute z-20"
          >
            <div className="relative">
                <div className="absolute -inset-4 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
                <div className="w-14 h-14 bg-white rounded-2xl border-2 border-white shadow-2xl flex items-center justify-center overflow-hidden">
                    <img src={user?.avatarUrl} className="w-full h-full object-cover" alt="User" />
                </div>
                <div className="absolute -top-3 -right-3">
                   <Badge className="bg-slate-900 text-white font-black border-none text-[8px] px-2 shadow-lg">0.12 KM</Badge>
                </div>
            </div>
          </motion.div>

          {/* Status HUD Overlays */}
          <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
            <div className="bg-white/90 backdrop-blur-md p-4 rounded-3xl border border-white shadow-xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center">
                    <Navigation className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Proximity</p>
                    <p className="text-sm font-black text-[#0F172A] mt-1">{distance.toFixed(2)} km</p>
                </div>
            </div>

            <div className={cn(
                "px-5 py-2.5 rounded-full flex items-center gap-2 shadow-xl border-2 transition-all duration-500",
                status === 'SCANNING' ? "bg-amber-50 border-amber-100" : "bg-emerald-50 border-emerald-100"
            )}>
                <ShieldCheck className={cn("w-4 h-4", status === 'SCANNING' ? "text-amber-500 animate-pulse" : "text-emerald-500")} />
                <span className={cn("text-[11px] font-black uppercase tracking-widest", status === 'SCANNING' ? "text-amber-600" : "text-emerald-600")}>
                    {status === 'SCANNING' ? "Scanning" : "Verified"}
                </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Timer Display */}
      <div className="flex flex-col items-center space-y-6 pt-4">
        <div className="relative w-72 h-72 flex items-center justify-center">
          {/* Static Ring */}
          <div className="absolute inset-0 rounded-full border-[10px] border-white shadow-xl"></div>
          
          {/* Progress Ring (Auto-Clock Sync) */}
          <AnimatePresence>
            {status === 'ON_SITE' && (
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <motion.circle 
                  cx="144" cy="144" r="132" 
                  fill="transparent" 
                  stroke="#2563EB" 
                  strokeWidth="10" 
                  strokeLinecap="round"
                  strokeDasharray="830"
                  strokeDashoffset={830 - (autoClockProgress / 100) * 830}
                  className="transition-all duration-150"
                />
              </svg>
            )}
          </AnimatePresence>

          <div className="text-center z-10 px-4">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">
              {status === 'ON_SITE' ? 'Syncing...' : 'Shift Duration'}
            </p>
            <h3 className={cn(
                "text-5xl font-black text-[#0F172A] tracking-tighter tabular-nums",
                status === 'ON_BREAK' && "text-amber-500"
            )}>
              {status === 'ON_SITE' ? `${autoClockProgress}%` : formatTime(timer)}
            </h3>
            <div className="mt-4 flex items-center justify-center gap-2">
              <div className={cn(
                "w-2.5 h-2.5 rounded-full", 
                status === 'CLOCKED_IN' ? "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]" : 
                status === 'ON_BREAK' ? "bg-amber-500" : "bg-slate-200"
              )} />
              <p className="text-[10px] font-black text-[#475569] uppercase tracking-[0.2em]">
                {status.replace('_', ' ')}
              </p>
            </div>
          </div>
        </div>

        {/* Smart Insight Card */}
        <div className="mx-6 p-5 rounded-[2rem] bg-slate-900 text-white flex items-start gap-4 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/20 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-blue-500/30 transition-all"></div>
          <Zap className="w-6 h-6 text-blue-400 shrink-0 mt-0.5" />
          <div className="space-y-1 relative z-10">
            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Affinity SmartClock™</p>
            <p className="text-[12px] font-semibold text-slate-300 leading-relaxed">
              {status === 'CLOCKED_IN' ? "Active monitoring verified your presence. You're set for your 8-hour shift." : 
               status === 'ON_SITE' ? "Entering geofence... hold tight while we synchronize your arrival." :
               "GPS tracking active. Proximity detection will trigger automatically within 100m."}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 space-y-4">
        {status === 'CLOCKED_IN' || status === 'ON_BREAK' ? (
          <div className="grid grid-cols-2 gap-4">
            <Button 
                onClick={handleToggleBreak}
                variant="outline" 
                className={cn(
                    "h-16 rounded-[1.5rem] border-2 font-black uppercase text-[11px] tracking-widest transition-all active:scale-95",
                    status === 'ON_BREAK' ? "bg-amber-500 border-amber-500 text-white" : "border-slate-100 text-[#475569] hover:bg-slate-50"
                )}
            >
              <Coffee className="w-5 h-5 mr-2" /> {status === 'ON_BREAK' ? 'End Break' : 'Take Break'}
            </Button>
            <Button onClick={handleClockOut} className="h-16 bg-red-50 text-red-600 border-2 border-red-100 hover:bg-red-100 rounded-[1.5rem] font-black uppercase text-[11px] tracking-widest transition-all active:scale-95">
               End Duty
            </Button>
          </div>
        ) : status === 'SCANNING' ? (
            <div className="p-6 text-center bg-slate-100/50 rounded-[2rem] border-2 border-dashed border-slate-200">
                <Loader2 className="w-6 h-6 text-blue-600 animate-spin mx-auto mb-2" />
                <p className="text-[11px] text-slate-400 font-black uppercase tracking-widest">Approaching {activeShift.siteName}...</p>
            </div>
        ) : null}
        
        <div className="flex items-center justify-center gap-6 pt-2">
            <button className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 hover:text-blue-600">
                <Info className="w-4 h-4" /> Reporting Issue?
            </button>
        </div>
      </div>
    </div>
  );
}
