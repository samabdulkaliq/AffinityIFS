"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../lib/store";
import { repository } from "../lib/repository";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MapPin, Clock, Calendar, CheckCircle2, ChevronRight, Sun, Navigation, Map as MapIcon } from "lucide-react";
import { motion } from "framer-motion";
import { OnboardingTooltip } from "../components/ui/onboarding-tooltip";
import { Badge } from "@/components/ui/badge";

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
  const [distance, setDistance] = useState("0.85 km");
  const [isAtSite, setIsAtSite] = useState(false);

  // Simulate proximity change for demo purposes
  useEffect(() => {
    const timer = setTimeout(() => {
      setDistance("0.12 km");
      setIsAtSite(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);
  
  if (!user) return null;

  const userShifts = repository.getShiftsForUser(user.id);
  
  const todayShift = userShifts.find(
    s => (s.status === 'SCHEDULED' || s.status === 'IN_PROGRESS') && 
    new Date(s.scheduledStart).toDateString() === new Date().toDateString()
  );

  const completedToday = userShifts.find(
    s => s.status === 'COMPLETED' && 
    new Date(s.scheduledStart).toDateString() === new Date().toDateString()
  );

  const site = todayShift ? repository.getSite(todayShift.siteId) : null;
  const isOnShift = todayShift?.status === 'IN_PROGRESS';

  const shortcuts = [
    { label: "Shift", icon: Clock, href: "/cleaner/clock" },
    { label: "Tasks", icon: CheckCircle2, href: "/cleaner/log" },
    { label: "Schedule", icon: Calendar, href: "/cleaner/shifts" },
  ];

  const formatTime = (iso: string) => {
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-20 max-w-md mx-auto"
    >
      {/* 1. Quick Actions */}
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

      {/* 2. Today's Job Card */}
      <motion.div variants={item} className="px-1">
        {todayShift && site ? (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-blue-500/5 overflow-hidden">
            <div className="p-8 space-y-8">
              
              {/* Job Header */}
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Today&apos;s Job</p>
                   <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">{site.name}</h2>
                </div>
                <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[9px] uppercase tracking-widest px-3 py-1">
                  On Schedule
                </Badge>
              </div>

              {/* Location Details */}
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-700 leading-snug">{site.address}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-1">
                      {distance} away
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700">Starts at {formatTime(todayShift.scheduledStart)}</p>
                  </div>
                </div>

                <Button variant="outline" className="w-full h-12 rounded-xl border-slate-200 text-slate-600 font-bold text-xs">
                  <Navigation className="w-4 h-4 mr-2" /> Open in Maps
                </Button>
              </div>

              {/* Instructions Section */}
              <div className="pt-6 border-t border-slate-50 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                    {isOnShift ? "You’re on shift." : "Ready to start your shift?"}
                  </h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">
                    {isOnShift 
                      ? "Your time is being tracked." 
                      : `Go to ${site.name}. We’ll start your time when you arrive.`}
                  </p>
                </div>

                {/* Geofence Status */}
                {!isOnShift && (
                  <div className={cn(
                    "p-4 rounded-2xl border flex items-center gap-3 transition-colors",
                    isAtSite ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-blue-50 border-blue-100 text-blue-700"
                  )}>
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center",
                      isAtSite ? "bg-emerald-500" : "bg-blue-500"
                    )}>
                      {isAtSite ? <CheckCircle2 className="w-4 h-4 text-white" /> : <MapIcon className="w-4 h-4 text-white" />}
                    </div>
                    <span className="text-xs font-black uppercase tracking-tight">
                      {isAtSite ? "You’re at the site ✅" : "You’re not at the site yet 📍"}
                    </span>
                  </div>
                )}

                {/* Primary Action Button */}
                <div className="relative">
                  {!isOnShift && (
                    <OnboardingTooltip 
                      text="Tap here to begin your shift ⏱" 
                      storageKey="affinity_tooltip_shift_seen" 
                      isVisible={true}
                    />
                  )}
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
                    <Button 
                      asChild 
                      className="w-full h-16 rounded-2xl bg-blue-600 text-white text-lg font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 border-none"
                      onClick={() => localStorage.setItem("affinity_tooltip_shift_seen", "true")}
                    >
                      <Link href="/cleaner/clock" className="flex items-center justify-center gap-2">
                        Start Shift <ChevronRight className="w-5 h-5" />
                      </Link>
                    </Button>
                  )}
                </div>
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

      {/* 3. Advisory Footer */}
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

const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");
