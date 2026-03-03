
"use client";

import { useState, useEffect, useMemo } from "react";
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
  Sparkles,
  Flame,
  Coffee,
  AlertTriangle,
  Camera,
  MessageSquare,
  Phone,
  HelpCircle,
  Navigation,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

  // Mocking some operational state for the prototype
  const [photoCount] = useState(2);
  const totalRequiredPhotos = 5;
  const [isInventoryDone] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  const userShifts = useMemo(() => user ? repository.getShiftsForUser(user.id) : [], [user]);
  const activeShift = userShifts.find(s => s.status === 'IN_PROGRESS');
  const upcomingShift = userShifts.find(s => s.status === 'SCHEDULED');
  const todayShift = activeShift || upcomingShift;
  const site = todayShift ? repository.getSite(todayShift.siteId) : null;
  const isOnShift = activeShift !== undefined;

  const tasks = activeShift?.tasks || [];
  const completedTasksCount = tasks.filter(t => t.completed).length;
  const isTasksComplete = tasks.length > 0 && completedTasksCount === tasks.length;
  const isPhotosComplete = photoCount === totalRequiredPhotos;

  // 2) Dynamic Smart Assistant Messaging
  const aiMessage = useMemo(() => {
    if (!isOnShift) return "Ready for your next work day? Being on time earns extra points! ⏰";
    if (!isTasksComplete) return `You have ${tasks.length - completedTasksCount} things left to do. Keep going! 💪`;
    if (!isPhotosComplete) return "Don't forget to take your final photos of the site. 📸";
    if (!isInventoryDone) return "Almost done! Please check the supplies. 🧾";
    return "Great job today! You're doing a perfect job. ⭐";
  }, [isOnShift, isTasksComplete, isPhotosComplete, isInventoryDone, tasks.length, completedTasksCount]);

  // 4) Needs Attention Logic
  const needsAttentionItems = useMemo(() => {
    const items = [];
    if (isOnShift) {
      if (!isTasksComplete) items.push({ label: "Tasks not finished", icon: CheckCircle2, color: "text-blue-500", href: "/cleaner/clock" });
      if (!isPhotosComplete) items.push({ label: "Photos missing", icon: Camera, color: "text-amber-500", href: "/cleaner/log" });
      if (!isInventoryDone) items.push({ label: "Supplies not checked", icon: Info, color: "text-red-500", href: "/cleaner/log" });
      if (todayShift?.managerNote) items.push({ label: "New note from manager", icon: MessageSquare, color: "text-purple-500", href: "/cleaner/shifts/" + todayShift.id });
    }
    return items;
  }, [isOnShift, isTasksComplete, isPhotosComplete, isInventoryDone, todayShift]);

  if (!user) return null;

  const shortcuts = [
    { label: "Clock", icon: Clock, href: "/cleaner/clock", color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Photos", icon: Camera, href: "/cleaner/log", color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "History", icon: Calendar, href: "/cleaner/shifts", color: "text-amber-500", bg: "bg-amber-50" },
  ];

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-32 max-w-md mx-auto"
    >
      {/* Dynamic Header Greeting */}
      <motion.div variants={item} className="px-1 space-y-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
              {greeting}, {user.name.split(' ')[0]}!
            </h1>
            <div className="flex items-center gap-2">
               <Badge variant="outline" className="bg-slate-900 text-white border-none font-black text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1">
                 <Flame className="w-2.5 h-2.5 text-orange-400 fill-orange-400" /> {user.points > 1500 ? 'STAR CLEANER' : 'LEVEL 1'}
               </Badge>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.points} points 🏆</p>
            </div>
          </div>
        </div>

        {/* 1) Mini Status Strip */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <Badge variant="outline" className={cn(
            "whitespace-nowrap font-black text-[8px] uppercase tracking-widest py-1 px-3",
            isOnShift ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-400 border-slate-100"
          )}>
            {isOnShift ? "● Working Now" : "○ Not Working"}
          </Badge>
          {isOnShift && (
            <>
              <Badge variant="outline" className="whitespace-nowrap bg-blue-50 text-blue-600 border-blue-100 font-black text-[8px] uppercase tracking-widest py-1 px-3">
                {completedTasksCount}/{tasks.length} Done
              </Badge>
              <Badge variant="outline" className="whitespace-nowrap bg-amber-50 text-amber-600 border-amber-100 font-black text-[8px] uppercase tracking-widest py-1 px-3">
                {photoCount}/{totalRequiredPhotos} Photos
              </Badge>
            </>
          )}
        </div>
      </motion.div>

      {/* 2) Dynamic Smart Assistant Card */}
      <motion.div variants={item} className="px-1">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] p-6 shadow-xl shadow-blue-200 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-110 transition-transform" />
          <div className="flex items-start gap-4 relative z-10">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-blue-100" />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest">Helpful Tip 🧠</p>
              <p className="text-sm font-bold text-white leading-relaxed">
                "{aiMessage}"
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 4) Needs Attention Section (Conditional) */}
      <AnimatePresence>
        {needsAttentionItems.length > 0 && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-1 space-y-3"
          >
            <h3 className="text-[10px] font-black text-red-500 uppercase tracking-widest px-1 flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5" /> Needs Attention
            </h3>
            <div className="grid gap-2">
              {needsAttentionItems.map((attn, i) => (
                <Link key={i} href={attn.href}>
                  <div className="bg-white p-4 rounded-2xl border border-red-50 shadow-sm flex items-center justify-between group active:scale-[0.98] transition-all">
                    <div className="flex items-center gap-3">
                      <attn.icon className={cn("w-5 h-5", attn.color)} />
                      <span className="text-sm font-bold text-slate-700">{attn.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-red-500 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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

      {/* 3) Today's Mission Card */}
      <motion.div variants={item} className="px-1">
        {todayShift && site ? (
          <div className="premium-card overflow-hidden">
            <div className="p-8 space-y-8">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-[#3A6FF7] uppercase tracking-widest">Today&apos;s Work 📍</p>
                   <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">{site.name}</h2>
                </div>
                <Badge className={cn(
                  "border-none font-black text-[9px] uppercase tracking-widest px-3 py-1",
                  isOnShift ? "bg-blue-600 text-white animate-pulse" : "bg-emerald-50 text-emerald-600"
                )}>
                  {isOnShift ? "Working Now" : "Ready"}
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase">Work Hours</p>
                    <p className="text-xs font-bold text-slate-700">{formatTime(todayShift.scheduledStart)} - {formatTime(todayShift.scheduledEnd)}</p>
                  </div>
                  <div className="space-y-1 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase">My Time</p>
                    <p className="text-xs font-bold text-slate-700">{isOnShift ? formatTime(todayShift.scheduledStart) : "--:--"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-black text-slate-700 leading-snug">{site.address}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight mt-1">
                      {isOnShift ? "Verified at site ✅" : "Almost there 📍"}
                    </p>
                  </div>
                </div>

                {!isOnShift && (
                  <Button variant="outline" className="w-full h-12 rounded-xl border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50">
                    <Navigation className="w-4 h-4 mr-2" /> Show on Maps
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
                      ? "Keep it up! Take some photos of your progress." 
                      : `Go to ${site.name}. We’ll start your clock when you get there.`}
                  </p>
                </div>

                <Button asChild className="w-full h-16 rounded-[2rem] btn-gradient text-lg font-black border-none">
                  <Link href="/cleaner/clock">{isOnShift ? "Check My Shift" : "Go to My Shift"}</Link>
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
               <Link href="/cleaner/shifts">See Schedule</Link>
            </Button>
          </div>
        )}
      </motion.div>

      {/* 5) Support Access Section */}
      <motion.div variants={item} className="px-1 space-y-4">
        <div className="flex items-center gap-2 px-1">
          <HelpCircle className="w-4 h-4 text-slate-400" />
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Need help?</h3>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Link href="/cleaner/help" className="bg-white p-4 rounded-3xl border border-slate-100 flex flex-col items-center gap-2 text-center active:scale-95 transition-all shadow-sm">
            <MessageSquare className="w-5 h-5 text-blue-500" />
            <span className="text-[9px] font-black text-slate-600 uppercase">Chat</span>
          </Link>
          <a href="tel:4165550101" className="bg-white p-4 rounded-3xl border border-slate-100 flex flex-col items-center gap-2 text-center active:scale-95 transition-all shadow-sm">
            <Phone className="w-5 h-5 text-emerald-500" />
            <span className="text-[9px] font-black text-slate-600 uppercase">Call</span>
          </a>
          <Link href="/cleaner/help" className="bg-white p-4 rounded-3xl border border-slate-100 flex flex-col items-center gap-2 text-center active:scale-95 transition-all shadow-sm">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <span className="text-[9px] font-black text-slate-600 uppercase">Report</span>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
