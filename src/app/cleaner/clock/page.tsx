"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/app/lib/store";
import { repository } from "@/app/lib/repository";
import { Button } from "@/components/ui/button";
import { MapPin, Coffee, ArrowLeft, Navigation, ShieldCheck, Loader2, Zap, AlertCircle } from "lucide-react";
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

  if (!activeShift) return <div className="p-12 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">No Duty Cycle Active</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-12">
      <div className="text-center space-y-2 px-6">
        <h2 className="text-3xl font-black text-[#0F172A] tracking-tight">{activeShift.siteName}</h2>
        <div className="flex items-center justify-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            <p className="text-sm text-[#475569] font-medium truncate max-w-[240px]">
                {repository.getSite(activeShift.siteId)?.address}
            </p>
        </div>
      </div>

      {/* Visual Map Interface */}
      <div className="px-4">
        <div className="premium-card aspect-square relative overflow-hidden bg-slate-50 border-2 border-slate-100">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(circle, #0F172A 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          </div>
          
          {/* Animated Geofence pulse */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
             <motion.div 
               animate={{ scale: [1, 1.4, 1], opacity: [0.1, 0.2, 0.1] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="w-64 h-64 rounded-full border-2 border-blue-500 bg-blue-500/5"
             />
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-4 h-4 bg-blue-600 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.6)]" />
             </div>
          </div>

          {/* User Marker */}
          <motion.div 
            animate={status === 'SCANNING' ? { top: '25%', left: '25%' } : { top: '55%', left: '55%' }}
            transition={{ duration: 3, ease: "circOut" }}
            className="absolute z-20"
          >
            <div className="relative group">
                <div className="absolute -inset-4 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
                <div className="w-12 h-12 bg-white rounded-2xl border-2 border-white shadow-xl flex items-center justify-center overflow-hidden">
                    <img src={user?.avatarUrl} className="w-full h-full object-cover" />
                </div>
                <div className="absolute -top-3 -right-3">
                   <Badge className="bg-blue-600 text-white font-black border-none text-[8px] px-1.5 shadow-lg">YOU</Badge>
                </div>
            </div>
          </motion.div>

          {/* HUD Overlay */}
          <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
            <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-white shadow-xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Navigation className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                    <p className="text-muted-label">Proximity</p>
                    <p className="text-sm font-black text-[#0F172A]">0.12 km</p>
                </div>
            </div>

            <div className={cn(
                "px-4 py-2 rounded-full flex items-center gap-2 shadow-lg border-2",
                status === 'SCANNING' ? "bg-amber-50 border-amber-100" : "bg-emerald-50 border-emerald-100"
            )}>
                <ShieldCheck className={cn("w-4 h-4", status === 'SCANNING' ? "text-amber-500 animate-pulse" : "text-emerald-500")} />
                <span className={cn("text-[10px] font-black uppercase tracking-widest", status === 'SCANNING' ? "text-amber-600" : "text-emerald-600")}>
                    {status === 'SCANNING' ? "Scanning..." : "Verified"}
                </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Clock UI */}
      <div className="flex flex-col items-center space-y-6">
        <div className="relative w-64 h-64 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-[8px] border-slate-100 shadow-inner"></div>
          
          <AnimatePresence>
            {status === 'ON_SITE' && (
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <motion.circle 
                  cx="128" cy="128" r="120" 
                  fill="transparent" 
                  stroke="#2563EB" 
                  strokeWidth="8" 
                  strokeLinecap="round"
                  strokeDasharray="754"
                  strokeDashoffset={754 - (autoClockProgress / 100) * 754}
                  className="transition-all duration-150"
                />
              </svg>
            )}
          </AnimatePresence>

          <div className="text-center z-10">
            <p className="text-muted-label mb-2">
              {status === 'ON_SITE' ? 'Auto-Sync' : 'Duty Cycle'}
            </p>
            <h3 className="text-5xl font-black text-[#0F172A] tracking-tighter tabular-nums">
              {status === 'ON_SITE' ? `${autoClockProgress}%` : formatTime(timer)}
            </h3>
            <div className="mt-4 flex items-center justify-center gap-2">
              <span className={cn("w-2 h-2 rounded-full", status === 'CLOCKED_IN' ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "bg-slate-200")}></span>
              <p className="text-[10px] font-bold text-[#475569] uppercase tracking-widest">
                {status.replace('_', ' ')}
              </p>
            </div>
          </div>
        </div>

        {/* Affinity Insight */}
        <div className="premium-card mx-6 p-5 flex items-start gap-4 bg-blue-50/50 border-blue-100">
          <Zap className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Affinity SmartClock™</p>
            <p className="text-[11px] font-semibold text-[#475569] leading-relaxed">
              Geofence active. Your presence is verified within the site radius.
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 space-y-4">
        {status === 'CLOCKED_IN' && (
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-16 rounded-2xl border-2 border-slate-100 text-[#475569] font-black uppercase text-xs hover:bg-slate-50 transition-all">
              <Coffee className="w-5 h-5 mr-2" /> Break
            </Button>
            <Button onClick={handleClockOut} className="h-16 bg-red-50 text-red-600 border-2 border-red-100 hover:bg-red-100 rounded-2xl font-black uppercase text-xs transition-all">
               End Duty
            </Button>
          </div>
        )}

        {status === 'SCANNING' && (
          <div className="premium-card p-6 text-center bg-slate-50/50 border-dashed border-slate-200">
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin mx-auto mb-2" />
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Verifying proximity...</p>
          </div>
        )}
      </div>
    </div>
  );
}
