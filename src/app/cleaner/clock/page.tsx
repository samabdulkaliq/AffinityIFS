
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "@/app/lib/store";
import { repository } from "@/app/lib/repository";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Coffee, 
  ShieldCheck, 
  AlertCircle, 
  Info, 
  LogOut, 
  ClipboardCheck, 
  Camera, 
  Activity,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Clock as ClockIcon,
  ChevronLeft,
  Zap,
  Star,
  Trophy
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Shift, ShiftTask } from "@/app/lib/models";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

/**
 * @fileOverview Redesigned Duty Screen.
 * High-fidelity SmartClock™ with operational validation and status tracking.
 * Includes a multi-step Shift Completion flow.
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
  
  // Shift Completion States
  const [showReview, setShowReview] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Mocked state for validation scenarios
  const [photoCount] = useState(2);
  const totalRequiredPhotos = 5;
  const isInventoryDone = false; 
  const isBreakTaken = false;

  useEffect(() => {
    if (!user) return;
    const shifts = repository.getShiftsForUser(user.id);
    const current = shifts.find(s => s.status === 'SCHEDULED' || s.status === 'IN_PROGRESS');
    
    if (current) {
        setActiveShift(current);
        setTasks(current.tasks || []);
        if (current.status === 'IN_PROGRESS') {
          setStatus('CLOCKED_IN');
          setTimer(14400); // Mocking 4 hours in
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

  useEffect(() => {
    if (status === 'ON_SITE') {
      const interval = setInterval(() => {
        setAutoClockProgress(p => (p >= 100 ? 100 : p + 4));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [status]);

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
    toast({ title: "Task Updated", description: "Progress synced." });
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

  const completedTasksCount = tasks.filter(t => t.completed).length;
  const isTasksComplete = completedTasksCount === tasks.length;
  const isPhotosComplete = photoCount === totalRequiredPhotos;
  const isEverythingComplete = isTasksComplete && isPhotosComplete && isInventoryDone;

  const handleEndDutyClick = () => {
    setShowReview(true);
  };

  const handleFinalClockOut = (isForced = false) => {
    if (!isEverythingComplete && !isForced) {
      return; // Handled by UI feedback in the review screen
    }

    // Logic for ending shift
    setStatus('IDLE');
    setShowReview(false);
    
    if (isEverythingComplete) {
      setShowSuccess(true);
    } else {
      // Direct finish for forced exit
      setActiveShift(null);
      repository.createTimeEvent({
          userId: user!.id,
          shiftId: activeShift!.id,
          type: 'CLOCK_OUT',
          timestamp: new Date().toISOString(),
          source: 'AUTO'
      });
      toast({ title: "Shift Completed", description: "Operational logs archived." });
    }
  };

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const paidHours = useMemo(() => {
    const hours = timer / 3600;
    const breakDeduction = hours > 5 ? 0.5 : 0;
    return Math.max(0, hours - breakDeduction).toFixed(2);
  }, [timer]);

  if (!activeShift && !showSuccess) {
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

  // SUCCESS SCREEN
  if (showSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[80vh] px-8 text-center space-y-10 py-12"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full" />
          <div className="w-24 h-24 bg-blue-600 rounded-[2rem] flex items-center justify-center relative z-10 shadow-2xl shadow-blue-200">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute -top-2 -right-2"
          >
            <Star className="w-8 h-8 text-[#F4B860] fill-[#F4B860]" />
          </motion.div>
        </div>

        <div className="space-y-3">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Shift Completed 🎉</h2>
          <p className="text-lg font-medium text-slate-500">Great work today, {user?.name.split(' ')[0]}!</p>
        </div>

        <div className="w-full grid grid-cols-2 gap-3">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tasks</p>
            <p className="text-lg font-black text-slate-900">✔ Done</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Photos</p>
            <p className="text-lg font-black text-slate-900">✔ Done</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inventory</p>
            <p className="text-lg font-black text-slate-900">✔ Done</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Break</p>
            <p className="text-lg font-black text-slate-900">✔ Done</p>
          </div>
        </div>

        <div className="w-full bg-blue-50 p-6 rounded-[2rem] border border-blue-100 flex items-center justify-between">
           <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                <Zap className="w-6 h-6 text-[#F4B860] fill-[#F4B860]" />
             </div>
             <div className="text-left">
               <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Points Earned</p>
               <p className="text-2xl font-black text-slate-900">+450 PTS</p>
             </div>
           </div>
           <Trophy className="w-8 h-8 text-blue-200" />
        </div>

        <Button 
          onClick={() => {
            setShowSuccess(false);
            setActiveShift(null);
          }}
          className="w-full h-16 rounded-[2rem] bg-slate-900 text-white font-black uppercase text-xs tracking-widest shadow-xl shadow-slate-200"
        >
          Return Home
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-500">
      {/* Dynamic Status Strip */}
      <AnimatePresence>
        {(status === 'CLOCKED_IN' || status === 'ON_BREAK') && (
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="px-6 grid grid-cols-2 gap-2"
          >
            <div className={cn(
              "p-2 rounded-xl flex items-center gap-2 border text-[10px] font-black uppercase tracking-tight",
              isTasksComplete ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-blue-50 border-blue-100 text-blue-600"
            )}>
              {isTasksComplete ? <CheckCircle2 className="w-3.5 h-3.5" /> : <ClipboardCheck className="w-3.5 h-3.5" />}
              {completedTasksCount}/{tasks.length} Tasks
            </div>
            <div className={cn(
              "p-2 rounded-xl flex items-center gap-2 border text-[10px] font-black uppercase tracking-tight",
              isPhotosComplete ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-amber-50 border-amber-100 text-amber-600"
            )}>
              {isPhotosComplete ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Camera className="w-3.5 h-3.5" />}
              {photoCount}/{totalRequiredPhotos} Photos
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center px-6">
        <div className="flex justify-center mb-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-100 font-black px-3">ACTIVE DEPLOYMENT</Badge>
        </div>
        <h2 className="text-2xl font-black text-slate-900 leading-tight">{activeShift!.siteName}</h2>
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1 flex items-center justify-center gap-1">
            <MapPin className="w-3 h-3" /> {repository.getSite(activeShift!.siteId)?.address}
        </p>
      </div>

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
                    <span className="text-[9px] font-black text-slate-700 uppercase tracking-tight">Active Motion</span>
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

      <div className="px-6 space-y-6">
        <div className="flex flex-col items-center">
            <div className="relative w-56 h-56 flex items-center justify-center bg-white rounded-full shadow-2xl border-4 border-slate-50">
                {status === 'ON_SITE' && (
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                        <motion.circle 
                            cx="112" cy="112" r="104" 
                            fill="transparent" stroke="#3A6FF7" strokeWidth="6" strokeLinecap="round"
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

        {(status === 'CLOCKED_IN' || status === 'ON_BREAK') && (
            <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <ClipboardCheck className="w-4 h-4 text-blue-500" />
                        Task Protocols
                    </h3>
                    <Badge variant="outline" className="text-[8px] font-black border-slate-200">
                        {completedTasksCount}/{tasks.length} DONE
                    </Badge>
                </div>
                <div className="grid gap-2 relative">
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
                                <div className="flex flex-col">
                                    <span className={cn("text-xs font-bold", task.completed ? "text-slate-400 line-through" : "text-slate-700")}>
                                        {task.label}
                                    </span>
                                    {task.completed && <span className="text-[8px] font-black uppercase text-emerald-600 mt-0.5">Verified</span>}
                                </div>
                            </div>
                            {!task.completed && <ChevronRight className="w-4 h-4 text-slate-300" />}
                        </div>
                    ))}
                </div>
            </div>
        )}

        <div className="space-y-3">
            {(status === 'CLOCKED_IN' || status === 'ON_BREAK') && (
                <div className="grid grid-cols-2 gap-3">
                    <Button onClick={handleBreak} variant="outline" className="h-14 rounded-2xl border-2 font-black uppercase text-[10px] tracking-widest shadow-sm">
                        <Coffee className="w-4 h-4 mr-2" /> {status === 'ON_BREAK' ? 'Resume' : 'Take Break'}
                    </Button>
                    <Button onClick={handleEndDutyClick} className="h-14 rounded-2xl bg-red-50 text-red-600 border-2 border-red-100 hover:bg-red-100 font-black uppercase text-[10px] tracking-widest shadow-sm">
                        <LogOut className="w-4 h-4 mr-2" /> End Duty
                    </Button>
                </div>
            )}
            <div className="flex justify-center">
                <button className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-1.5 hover:text-blue-600 transition-colors py-2">
                    <Info className="w-3.5 h-3.5" /> Support
                </button>
            </div>
        </div>
      </div>

      {/* SHIFT COMPLETION REVIEW DIALOG */}
      <Dialog open={showReview} onOpenChange={setShowReview}>
        <DialogContent className="max-w-[440px] rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
          <div className="p-8 bg-slate-50 border-b border-slate-100">
            <DialogHeader className="text-left space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-100">
                  <ClipboardCheck className="w-5 h-5 text-white" />
                </div>
                <DialogTitle className="text-2xl font-black text-slate-900">Review Your Shift</DialogTitle>
              </div>
              <DialogDescription className="text-slate-500 font-medium text-sm">
                Operational verification check before departure.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto scrollbar-hide">
            {/* Task Summary */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Task Summary</p>
                <Badge className={cn("text-[9px] font-black uppercase", isTasksComplete ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600")}>
                  {completedTasksCount} / {tasks.length} DONE
                </Badge>
              </div>
              {!isTasksComplete && (
                <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <p className="text-xs font-bold text-amber-700">You have {tasks.length - completedTasksCount} tasks remaining.</p>
                </div>
              )}
            </div>

            {/* Photo Summary */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Photo Verification</p>
                <Badge className={cn("text-[9px] font-black uppercase", isPhotosComplete ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600")}>
                  {photoCount} / {totalRequiredPhotos} DONE
                </Badge>
              </div>
              {!isPhotosComplete && (
                <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                  <Camera className="w-5 h-5 text-amber-500" />
                  <p className="text-xs font-bold text-amber-700">Missing {totalRequiredPhotos - photoCount} required photos.</p>
                </div>
              )}
            </div>

            {/* Inventory Status */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inventory Log</p>
                <Badge className={cn("text-[9px] font-black uppercase", isInventoryDone ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600")}>
                  {isInventoryDone ? "SUBMITTED" : "MISSING"}
                </Badge>
              </div>
              {!isInventoryDone && (
                <Button 
                  variant="outline" 
                  className="w-full h-12 rounded-xl border-dashed border-red-200 text-red-500 font-black uppercase text-[10px]"
                  onClick={() => {
                    setShowReview(false);
                    // Navigate to log page usually, but here we just simulate
                    toast({ title: "Navigation", description: "Heading to Work Log..." });
                  }}
                >
                  Complete Inventory Now
                </Button>
              )}
            </div>

            {/* Break Status */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Break Compliance</p>
                <Badge className={cn("text-[9px] font-black uppercase", isBreakTaken ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600")}>
                  {isBreakTaken ? "TAKEN" : "PENDING"}
                </Badge>
              </div>
              {!isBreakTaken && timer > 18000 && (
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                  <Info className="w-5 h-5 text-blue-500" />
                  <p className="text-xs font-medium text-blue-700 leading-relaxed">Ontario Rule: Shifts over 5 hours require a 30min unpaid break.</p>
                </div>
              )}
            </div>

            {/* Shift Breakdown */}
            <div className="space-y-4 pt-4 border-t border-slate-50">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Shift Totals</p>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase">Duration</p>
                    <p className="text-lg font-black text-slate-900">{(timer/3600).toFixed(1)} hrs</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase">Paid Total</p>
                    <p className="text-lg font-black text-blue-600">{paidHours} hrs</p>
                  </div>
               </div>
            </div>
          </div>

          <div className="p-8 bg-white border-t border-slate-50 flex flex-col gap-3">
            {!isEverythingComplete ? (
              <>
                <Button 
                  onClick={() => handleFinalClockOut(true)} 
                  variant="outline"
                  className="w-full h-14 rounded-2xl border-2 border-slate-100 text-slate-400 font-black uppercase text-[10px] tracking-widest"
                >
                  End Anyway (Manager Review Required)
                </Button>
                <Button 
                  onClick={() => setShowReview(false)}
                  className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-[10px] tracking-widest shadow-xl shadow-blue-200"
                >
                  Return to Shift
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => handleFinalClockOut(false)}
                className="w-full h-16 rounded-2xl bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest shadow-xl shadow-slate-200"
              >
                Confirm Completion
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
