
"use client";

import { useAuth } from "../lib/store";
import { repository } from "../lib/repository";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MapPin, Clock, Calendar, CheckCircle2, ChevronRight } from "lucide-react";
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
  const todayShift = repository.getShiftsForUser(user!.id).find(
    s => s.status === 'SCHEDULED' || s.status === 'IN_PROGRESS'
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
      className="space-y-8 pb-20"
    >
      {/* Simplified Top Shortcuts */}
      <motion.div variants={item} className="grid grid-cols-3 gap-4">
        {shortcuts.map((s) => (
          <Link 
            key={s.label} 
            href={s.href} 
            className="flex flex-col items-center justify-center p-4 bg-white rounded-3xl border border-slate-100 shadow-sm active:scale-95 transition-all space-y-2 group"
          >
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
              <s.icon className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xs font-bold text-slate-600">{s.label}</span>
          </Link>
        ))}
      </motion.div>

      {/* Action-Focused Shift Card */}
      <motion.div variants={item}>
        {todayShift ? (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
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
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Location</p>
                  <p className="text-sm font-bold text-slate-700">{todayShift.siteName}</p>
                </div>
              </div>

              <div className="space-y-3">
                {isOnShift ? (
                  <div className="grid grid-cols-2 gap-3">
                    <Button asChild variant="outline" className="h-16 rounded-2xl border-2 border-slate-100 font-bold text-slate-600 hover:bg-slate-50">
                      <Link href="/cleaner/clock">Take Break</Link>
                    </Button>
                    <Button asChild className="h-16 rounded-2xl bg-slate-900 text-white font-bold hover:bg-red-600">
                      <Link href="/cleaner/clock">End Shift</Link>
                    </Button>
                  </div>
                ) : (
                  <Button asChild className="w-full h-16 rounded-2xl bg-blue-600 text-white text-lg font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95">
                    <Link href="/cleaner/clock" className="flex items-center justify-center gap-2">
                      Start Shift <ChevronRight className="w-5 h-5" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="py-16 px-6 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
            <Calendar className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-medium italic">No shift scheduled for today</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
