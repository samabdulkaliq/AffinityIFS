"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "@/app/lib/store";
import { repository } from "@/app/lib/repository";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Coffee, 
  Navigation, 
  ShieldCheck, 
  Loader2, 
  Zap, 
  AlertCircle, 
  Info, 
  LogOut, 
  ClipboardCheck, 
  Camera, 
  Activity,
  ChevronRight,
  CheckCircle2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Shift, ShiftTask } from "@/app/lib/models";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

/**
 * @fileOverview Enhanced SmartClock™ Interface for Affinity.
 * Integrates PRD requirements: Geofencing, Task Documentation, and Manager Oversight.
 */

export default function TimeClockPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [activeShift, setActiveShift] = useState<Shift | null>(null);
  const [status, setStatus] = useState<'IDLE' | 'SCANNING' | 'ON_SITE' | 'CLOCKED_IN' | 'ON_BREAK'>('IDLE');
  const [timer, setTimer] = useState(0);
  const [autoClockProgress, setAutoClockProgress] = useState(0);
  const [distance, setDistance] = useState(0.85);
  const [tasks, setTasks] = useState<ShiftTask[]>([]);

  // Load initial shift state
  useEffect(() => {
    if (!user) return;
    const shifts = repository.getShiftsForUser(user.id);
    const current = shifts.find(s => s.status === 'SCHEDULED' || s.status === 'IN_PROGRESS');
    
    if (current) {
        setActiveShift(current);
        setTasks(current.tasks || []);
        if (current.status === 'IN_PROGRESS') {
          setStatus('CLOCKED_IN');
          setTimer(14400); // Demo: 4 hours elapsed
        } else {
          setStatus('SCANNING');
        }
    }
  }, [user]);

  // Timer logic
  useEffect(() => {
    let interval: any;
    if (status === 'CLOCKED_IN') {
      interval = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [status]);

  // Simulation: Proximity tracking
  useEffect(() => {
    if (status === 'SCANNING') {
      const interval = setInterval(() => {
        setDistance(prev => {
          const next = prev - 0.05;
          if (next <= 0.15) {
            clearInterval(interval);
            setStatus('ON_SITE');
            return 0.12;
          }
          return next;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [status]);

  // Simulation: Auto-Clock Progress
  useEffect(() => {
    if (status === 'ON_SITE') {
      const interval = setInterval(() => {
        setAutoClockProgress(p => (p >= 100 ? 100 : p + 4));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [status]);

  // Trigger Clock-In
  useEffect(() => {
    if (status === 'ON_SITE' && autoClockProgress >= 100) {
      handleAutoClockIn();
    }
  }, [autoClockProgress, status]);

  const handleAutoClockIn = useCallback(() => {
    if (!activeShift || !user) return;
    setStatus('CLOCKED_IN');
    repository.createTimeEvent({
        userId: user.id,
        shiftId: activeShift.id,
        type: 'CLOCK_IN',
        timestamp: new Date().toISOString(),
        source: 'AUTO'
    });
    toast({ title: "SmartClock™ Verified", description: `Clocked into ${activeShift.siteName}.` });
  }, [activeShift, user, toast]);

  const handleTaskToggle = (taskId: string) => {
    if (!activeShift) return;
    repository.updateShiftTasks(activeShift.id, taskId);
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
    toast({ title: "Task Updated", description: "Progress synced with management portal." });
  };

  const handleBreak = () => {
    const isBreaking = status === 'CLOCKED_IN';
    setStatus(isBreaking ? 'ON_BREAK' : 'CLOCKED_IN');
    repository.createTimeEvent({
        userId: user!.id,
        shiftId: activeShift!.id,
        type: isBreaking ? 'BREAK_START' : 'BREAK_END',
        timestamp: new Date().toISOString(),
        source: 'MANUAL'
    });
    toast({ title: isBreaking ? "Break Started" : "Shift Resumed" });
  };

  const handleClockOut = () => {
    setStatus('IDLE');
    setActiveShift(null);
    repository.createTimeEvent({
        userId: user!.id,
        shiftId: activeShift!.id,
        type: 'CLOCK_OUT',
        timestamp: new Date().toISOString(),
        source: 'AUTO'
    });
    toast({ title: "Shift Completed", description: "Operational logs archived." });
  };

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  if (!activeShift) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-6 px-10">
        <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
            <AlertCircle className="w-8 h-8 text-slate-300" />
        </div>
        <div className="space-y-2">
            <h3 className="text-xl font-black text-slate-900">Off Duty</h3>
            <p className="text-sm text-slate-500 font-medium">Scanning for upcoming geofences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-500">
      <div className="text-center px-6">
        <div className="flex justify-center mb-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-100 font-black px-3">ACTIVE DEPLOYMENT</Badge>
        </div>
        <h2 className="text-2xl font-black text-slate-900 leading-tight">{activeShift.siteName}</h2>
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1 flex items-center justify-center gap-1">
            <MapPin className="w-3 h-3" /> {repository.getSite(activeShift.siteId)?.address}
        </p>
      </div>

      {/* Geofence Visualization */}
      <div className="px-4">
        <div className="bg-white rounded-[2rem] aspect-[16/10] relative overflow-hidden shadow-xl border border-slate-100">
            <div className="absolute inset-0 bg-slate-50 opacity-40" style={{ backgroundImage: 'radial-gradient(circle, #0F172A 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <motion.div 
                    animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="w-48 h-48 rounded-full border-2 border-blue-500/20 bg-blue-500/5"
                />
            </div>

            <motion.div 
                animate={status === 'SCANNING' ? { top: '30%', left: '30%' } : { top: '50%', left: '50%' }}
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
            >
                <div className="relative">
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-2xl border-2 border-white overflow-hidden ring-4 ring-blue-500/10">
                        <img src={user?.avatarUrl} className="w-full h-full object-cover" />
                    </div>
                    <Badge className="absolute -top-3 -right-3 bg-slate-900 text-[8px] font-black border-none shadow-lg">
                        {distance.toFixed(2)} KM
                    </Badge>
                </div>
            </motion.div>

            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                <div className="bg-white/90 backdrop-blur-md p-2 px-3 rounded-xl border border-white shadow-lg flex items-center gap-2">
                    <Activity className="w-3 h-3 text-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-black text-slate-700 uppercase tracking-tight">Active Motion Detected</span>
                </div>
                <div className={cn(
                    "px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg border",
                    status === 'SCANNING' ? "bg-amber-50 border-amber-100 text-amber-600" : "bg-emerald-50 border-emerald-100 text-emerald-600"
                )}>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span className="text-[8px] font-black uppercase tracking-widest">{status === 'SCANNING' ? 'Scanning' : 'Verified'}</span>
                </div>
            </div>
        </div>
      </div>

      {/* Main Clock / Interaction */}
      <div className="px-6 space-y-6">
        <div className="flex flex-col items-center">
            <div className="relative w-56 h-56 flex items-center justify-center bg-white rounded-full shadow-2xl border-4 border-slate-50">
                {status === 'ON_SITE' && (
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                        <motion.circle 
                            cx="112" cy="112" r="104" 
                            fill="transparent" stroke="#2563EB" strokeWidth="6" strokeLinecap="round"
                            strokeDasharray="653"
                            strokeDashoffset={653 - (autoClockProgress / 100) * 653}
                        />
                    </svg>
                )}
                <div className="text-center z-10">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Shift Timer</p>
                    <h3 className={cn("text-4xl font-black tabular-nums tracking-tighter", status === 'ON_BREAK' ? "text-amber-500" : "text-slate-900")}>
                        {status === 'ON_SITE' ? `${autoClockProgress}%` : formatTime(timer)}
                    </h3>
                    <div className="flex items-center justify-center gap-1.5 mt-2">
                        <div className={cn("w-1.5 h-1.5 rounded-full", status === 'CLOCKED_IN' ? "bg-emerald-500" : "bg-slate-300")} />
                        <span className="text-[9px] font-black text-slate-500 uppercase">{status.replace('_', ' ')}</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Manager Note Section */}
        {activeShift.managerNote && (
            <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100 flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                    <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Manager's Note</p>
                    <p className="text-xs font-medium text-amber-900/80 leading-relaxed italic">"{activeShift.managerNote}"</p>
                </div>
            </div>
        )}

        {/* Task Verification Checklist (PRD 6.2) */}
        {(status === 'CLOCKED_IN' || status === 'ON_BREAK') && (
            <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <ClipboardCheck className="w-4 h-4 text-blue-500" />
                        Task Protocols
                    </h3>
                    <Badge variant="outline" className="text-[8px] font-black border-slate-200">
                        {tasks.filter(t => t.completed).length}/{tasks.length} DONE
                    </Badge>
                </div>
                <div className="grid gap-2">
                    {tasks.map((task) => (
                        <div 
                            key={task.id} 
                            onClick={() => handleTaskToggle(task.id)}
                            className={cn(
                                "p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer active:scale-[0.98]",
                                task.completed ? "bg-slate-50 border-slate-100 opacity-60" : "bg-white border-slate-100 shadow-sm"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors",
                                    task.completed ? "bg-emerald-500 border-emerald-500" : "border-slate-200"
                                )}>
                                    {task.completed && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                                </div>
                                <span className={cn("text-xs font-bold", task.completed ? "text-slate-400 line-through" : "text-slate-700")}>
                                    {task.label}
                                </span>
                            </div>
                            {!task.completed && <ChevronRight className="w-4 h-4 text-slate-300" />}
                        </div>
                    ))}
                </div>

                {/* Documentation Progress (PRD 6.1) */}
                <Card className="border-none bg-blue-600 text-white rounded-[1.5rem] overflow-hidden shadow-lg shadow-blue-200">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                                <Camera className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-white/70 uppercase">Visual Evidence</p>
                                <p className="text-sm font-black">3 of 5 Photos Logged</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full">
                            <ChevronRight className="w-5 h-5" />
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )}

        {/* Operational Actions */}
        <div className="space-y-3">
            {(status === 'CLOCKED_IN' || status === 'ON_BREAK') && (
                <div className="grid grid-cols-2 gap-3">
                    <Button onClick={handleBreak} variant="outline" className="h-14 rounded-2xl border-2 font-black uppercase text-[10px] tracking-widest shadow-sm">
                        <Coffee className="w-4 h-4 mr-2" /> {status === 'ON_BREAK' ? 'Resume' : 'Take Break'}
                    </Button>
                    <Button onClick={handleClockOut} className="h-14 rounded-2xl bg-red-50 text-red-600 border-2 border-red-100 hover:bg-red-100 font-black uppercase text-[10px] tracking-widest shadow-sm">
                        <LogOut className="w-4 h-4 mr-2" /> End Duty
                    </Button>
                </div>
            )}
            <div className="flex justify-center">
                <button className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-1.5 hover:text-blue-600 transition-colors py-2">
                    <Info className="w-3.5 h-3.5" /> Operational Dispute? Contact Support
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
