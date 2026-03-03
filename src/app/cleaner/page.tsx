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
import { cn } from "@/lib/utils";

const item = {
  hidden: { y: 10, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export default function CleanerDashboard() {
  const { user } = useAuth();
  const [distance] = useState("0.12 km");
  const [isAtSite] = useState(true);

  if (!user) return null;

  const userShifts = repository.getShiftsForUser(user.id);
  const todayShift = userShifts.find(s => (s.status === 'SCHEDULED' || s.status === 'IN_PROGRESS'));
  const site = todayShift ? repository.getSite(todayShift.siteId) : null;
  const isOnShift = todayShift?.status === 'IN_PROGRESS';

  const shortcuts = [
    { label: "Shift", icon: Clock, href: "/cleaner/clock" },
    { label: "Tasks", icon: CheckCircle2, href: "/cleaner/log" },
    { label: "Schedule", icon: Calendar, href: "/cleaner/shifts" },
  ];

  return (
    <motion.div 
      initial="hidden" animate="show"
      className="space-y-8 pb-20 max-w-md mx-auto"
    >
      {/* Quick Actions */}
      <motion.div variants={item} className="grid grid-cols-3 gap-4 px-1">
        {shortcuts.map((s) => (
          <Link 
            key={s.label} href={s.href} 
            className="flex flex-col items-center justify-center p-5 premium-card space-y-3 group"
          >
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-[#3A6FF7]/10">
              <s.icon className="w-6 h-6 text-[#3A6FF7]" />
            </div>
            <span className="text-sm font-black text-slate-600">{s.label}</span>
          </Link>
        ))}
      </motion.div>

      {/* Today's Job */}
      <motion.div variants={item} className="px-1">
        {todayShift && site ? (
          <div className="premium-card overflow-hidden">
            <div className="p-8 space-y-8">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-[#3A6FF7] uppercase tracking-widest">Today's Job</p>
                   <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">{site.name}</h2>
                </div>
                <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[9px] uppercase tracking-widest px-3 py-1">
                  On Schedule
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-black text-slate-700 leading-snug">{site.address}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight mt-1">{distance} away</p>
                  </div>
                </div>

                <Button variant="outline" className="w-full h-12 rounded-xl border-slate-200 text-slate-600 font-bold text-xs">
                  <Navigation className="w-4 h-4 mr-2" /> Open in Maps
                </Button>
              </div>

              <div className="pt-6 border-t border-slate-50 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                    {isOnShift ? "You’re on shift." : "Ready to start?"}
                  </h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">
                    {isOnShift ? "Your time is being tracked." : `Go to ${site.name}. We'll start when you arrive.`}
                  </p>
                </div>

                <div className={cn(
                    "p-4 rounded-2xl border flex items-center gap-3",
                    isAtSite ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-blue-50 border-blue-100 text-[#3A6FF7]"
                )}>
                  <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", isAtSite ? "bg-emerald-500" : "bg-[#3A6FF7]")}>
                    {isAtSite ? <CheckCircle2 className="w-4 h-4 text-white" /> : <MapIcon className="w-4 h-4 text-white" />}
                  </div>
                  <span className="text-xs font-black uppercase tracking-tight">
                    {isAtSite ? "You're at the site ✅" : "You're not at the site yet 📍"}
                  </span>
                </div>

                <Button asChild className="w-full h-16 rounded-[2rem] btn-gradient text-lg font-black border-none">
                  <Link href="/cleaner/clock">{isOnShift ? "Manage Shift" : "Start Shift"}</Link>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="premium-card border-dashed p-12 text-center space-y-6">
            <Sun className="w-12 h-12 text-slate-200 mx-auto" />
            <p className="text-lg font-black text-slate-700">No shift scheduled today</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
