
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../lib/store";
import { repository } from "../lib/repository";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  MapPin, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  ChevronRight, 
  Sun, 
  Navigation, 
  Map as MapIcon,
  Sparkles,
  Zap,
  Flame,
  Star,
  Coffee
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
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
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export default function CleanerDashboard() {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState("Hello");
  const [aiTip, setAiTip] = useState("");

  const tips = [
    "Taking clear photos helps with point bonuses! 📸",
    "Arriving 5 mins early counts towards your Punctuality Badge! ⏰",
    "Don't forget to report low stock so we can restock for you! 🧾",
    "You're only 2 shifts away from a 5-day streak! 🔥",
    "Great job on your last shift at Metro Hub! ⭐"
  ];

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    setAiTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  if (!user) return null;

  const userShifts = repository.getShiftsForUser(user.id);
  const activeShift = userShifts.find(s => s.status === 'IN_PROGRESS');
  const upcomingShift = userShifts.find(s => s.status === 'SCHEDULED');
  const todayShift = activeShift || upcomingShift;
  
  const site = todayShift ? repository.getSite(todayShift.siteId) : null;
  const isOnShift = activeShift !== undefined;

  const shortcuts = [
    { label: "Duty", icon: Clock, href: "/cleaner/clock", color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Work Log", icon: CheckCircle2, href: "/cleaner/log", color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "History", icon: Calendar, href: "/cleaner/shifts", color: "text-amber-500", bg: "bg-amber-50" },
  ];

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-24 max-w-md mx-auto"
    >
      {/* Dynamic Header Greeting */}
      <motion.div variants={item} className="px-1 space-y-1">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
          {greeting}, {user.name.split(' ')[0]}! {new Date().getHours() < 12 ? '☀️' : '🌙'}
        </h1>
        <div className="flex items-center gap-2">
           <Badge variant="outline" className="bg-slate-900 text-white border-none font-black text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1">
             <Flame className="w-2.5 h-2.5 text-orange-400 fill-orange-400" /> {user.points > 1500 ? 'HOT STREAK' : 'LEVEL 1'}
           </Badge>
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">You have {user.points} points 🏆</p>
        </div>
      </motion.div>

      {/* AI Assistant Tip Card */}
      <motion.div variants={item} className="px-1">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] p-6 shadow-xl shadow-blue-200 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-110 transition-transform" />
          <div className="flex items-start gap-4 relative z-10">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-blue-100" />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest">Smart Assistant 🧠</p>
              <p className="text-sm font-bold text-white leading-relaxed">
                "{aiTip}"
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Action Hub */}
      <motion.div variants={item} className="grid grid-cols-3 gap-4 px-1">
        {shortcuts.map((s) => (
          <Link 
            key={s.label} href={s.href} 
            className="flex flex-col items-center justify-center p-5 premium-card space-y-3 group active:scale-95 transition-all"
          >
            <div className={cn("w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform", s.bg)}>
              <s.icon className={cn("w-6 h-6", s.color)} />
            </div>
            <span className="text-xs font-black text-slate-600 uppercase tracking-tighter">{s.label}</span>
          </Link>
        ))}
      </motion.div>

      {/* Today's Mission Card */}
      <motion.div variants={item} className="px-1">
        {todayShift && site ? (
          <div className="premium-card overflow-hidden">
            <div className="p-8 space-y-8">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-[#3A6FF7] uppercase tracking-widest">Today&apos;s Job 📍</p>
                   <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">{site.name}</h2>
                </div>
                <Badge className={cn(
                  "border-none font-black text-[9px] uppercase tracking-widest px-3 py-1",
                  isOnShift ? "bg-blue-600 text-white animate-pulse" : "bg-emerald-50 text-emerald-600"
                )}>
                  {isOnShift ? "Live Now" : "On Schedule"}
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-black text-slate-700 leading-snug">{site.address}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight mt-1">
                      {isOnShift ? "You are verified on-site" : "0.12 km away"}
                    </p>
                  </div>
                </div>

                {!isOnShift && (
                  <Button variant="outline" className="w-full h-12 rounded-xl border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50">
                    <Navigation className="w-4 h-4 mr-2" /> Open in Maps
                  </Button>
                )}
              </div>

              <div className="pt-6 border-t border-slate-50 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                    {isOnShift ? "Great work! 💪" : "Ready to start? 🚀"}
                  </h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">
                    {isOnShift 
                      ? "You've completed 1/2 of your tasks. Keep it up!" 
                      : `Head over to ${site.name}. We'll automatically start when you arrive.`}
                  </p>
                </div>

                <Button asChild className="w-full h-16 rounded-[2rem] btn-gradient text-lg font-black border-none">
                  <Link href="/cleaner/clock">{isOnShift ? "Manage Shift" : "View Deployment"}</Link>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="premium-card border-dashed border-2 p-12 text-center space-y-6 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center">
              <Coffee className="w-10 h-10 text-amber-500" />
            </div>
            <div className="space-y-2">
              <p className="text-xl font-black text-slate-700">Rest & Recharge ☕</p>
              <p className="text-sm text-slate-400 font-medium">No shifts scheduled for the rest of today. Enjoy your break!</p>
            </div>
            <Button asChild variant="outline" className="rounded-xl font-black uppercase text-[10px] tracking-widest px-8">
               <Link href="/cleaner/shifts">View Schedule</Link>
            </Button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
