
"use client";

import { useAuth } from "../lib/store";
import { repository } from "../lib/repository";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MapPin, Clock, Calendar, CheckCircle2, ChevronRight, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 10, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export default function CleanerDashboard() {
  const { user } = useAuth();
  
  if (!user) return null;

  const userShifts = repository.getShiftsForUser(user.id);
  
  // Scenario A: Active or Scheduled Shift Today
  const todayShift = userShifts.find(
    s => (s.status === 'SCHEDULED' || s.status === 'IN_PROGRESS') && 
    new Date(s.scheduledStart).toDateString() === new Date().toDateString()
  );

  // Scenario B: Completed Shift Today
  const completedToday = userShifts.find(
    s => s.status === 'COMPLETED' && 
    new Date(s.scheduledStart).toDateString() === new Date().toDateString()
  );

  const isOnShift = todayShift?.status === 'IN_PROGRESS';

  const shortcuts = [
    { label: "Shift", icon: Clock, href: "/cleaner/clock" },
    { label: "Tasks", icon: CheckCircle2, href: "/cleaner/log" },
    { label: "Schedule", icon: Calendar, href: "/cleaner/shifts" },
  ];

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-20 max-w-md mx-auto"
    >
      {/* 3 Action Shortcuts - Simple, Large, Soft Blue */}
      <motion.div variants={item} className="grid grid-cols-3 gap-4 px-1">
        {shortcuts.map((s) => (
          <Link 
            key={s.label} 
            href={s.href} 
            className="flex flex-col items-center justify-center p-5 bg-white rounded-[2rem] border border-slate-100 shadow-sm active:scale-95 transition-all space-y-3 group"
          >
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
              <s.icon className="w-6 h-6 text-blue-500" />
            </div>
            <span className="text-sm font-bold text-slate-600">{s.label}</span>
          </Link>
        ))}
      </motion.div>

      {/* Main Action Card */}
      <motion.div variants={item} className="px-1">
        {todayShift ? (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-blue-500/5 overflow-hidden">
            <div className="p-8 space-y-8">
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                  {isOnShift ? "You’re on shift." : "Ready to start your shift?"}
                </h2>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  {isOnShift 
                    ? "Your time is being tracked." 
                    : "We’ll clock you in when you arrive on site."}
                </p>
              </div>

              <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                  <MapPin className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Site Name</p>
                  <p className="text-sm font-bold text-slate-700">{todayShift.siteName}</p>
                </div>
              </div>

              <div className="space-y-3">
                {isOnShift ? (
                  <div className="grid grid-cols-2 gap-3">
                    <Button asChild variant="outline" className="h-16 rounded-2xl border-2 border-slate-100 font-bold text-slate-600 hover:bg-slate-50">
                      <Link href="/cleaner/clock">Take Break</Link>
                    </Button>
                    <Button asChild className="h-16 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all active:scale-95">
                      <Link href="/cleaner/clock">End Shift</Link>
                    </Button>
                  </div>
                ) : (
                  <Button asChild className="w-full h-16 rounded-2xl bg-blue-600 text-white text-lg font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 border-none">
                    <Link href="/cleaner/clock" className="flex items-center justify-center gap-2">
                      Start Shift <ChevronRight className="w-5 h-5" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        ) : completedToday ? (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-10 text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900">Shift completed.</h2>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                Great work today! Your time has been recorded and sent for review.
              </p>
            </div>
            <Button asChild variant="outline" className="h-12 rounded-xl border-slate-200 font-bold text-slate-600">
               <Link href="/cleaner/shifts">View Details</Link>
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100 p-12 text-center space-y-6">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
              <Sun className="w-8 h-8 text-slate-300" />
            </div>
            <div className="space-y-1">
              <p className="text-lg font-bold text-slate-700">No shift scheduled today</p>
              <p className="text-sm text-slate-400 font-medium">Enjoy your time off!</p>
            </div>
            <Button asChild variant="ghost" className="text-blue-500 font-bold hover:bg-blue-50 rounded-xl">
               <Link href="/cleaner/shifts">Check Schedule</Link>
            </Button>
          </div>
        )}
      </motion.div>

      {/* Helpful Hint Section - Calm/Friendly */}
      <motion.div variants={item} className="px-6">
        <div className="bg-blue-50/30 p-5 rounded-2xl border border-blue-100/50 flex items-start gap-4">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-sm">
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Good to know</p>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              In Ontario, a 30-minute break is automatically added to shifts longer than 5 hours.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
