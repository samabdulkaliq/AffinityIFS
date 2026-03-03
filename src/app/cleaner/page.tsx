
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
  Info,
  BookOpen,
  Loader2,
  Star
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { appTutorialAssistant, AppTutorialOutput } from "@/ai/flows/app-tutorial-flow";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

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
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialLoading, setTutorialLoading] = useState(false);
  const [tutorialResponse, setTutorialResponse] = useState<AppTutorialOutput | null>(null);

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

  const aiMessage = useMemo(() => {
    if (!isOnShift) return "Ready for work today? Being early helps everyone! ⏰";
    if (!isTasksComplete) return `You have ${tasks.length - completedTasksCount} things left to do. You're doing great! 💪`;
    if (!isPhotosComplete) return "Don't forget to take your photos. 📸";
    if (!isInventoryDone) return "Almost done! Please check the supplies. 🧾";
    return "Excellent work today! You're a star. ⭐";
  }, [isOnShift, isTasksComplete, isPhotosComplete, isInventoryDone, tasks.length, completedTasksCount]);

  const needsAttentionItems = useMemo(() => {
    const items = [];
    if (isOnShift) {
      if (!isTasksComplete) items.push({ label: "Things not finished", icon: CheckCircle2, color: "text-blue-500", href: "/cleaner/clock" });
      if (!isPhotosComplete) items.push({ label: "Photos missing", icon: Camera, color: "text-amber-500", href: "/cleaner/log" });
      if (!isInventoryDone) items.push({ label: "Supplies not checked", icon: Info, color: "text-red-500", href: "/cleaner/log" });
    }
    return items;
  }, [isOnShift, isTasksComplete, isPhotosComplete, isInventoryDone]);

  const handleAskGuide = async (q: string) => {
    setShowTutorial(true);
    setTutorialLoading(true);
    try {
      const res = await appTutorialAssistant({
        cleanerName: user?.name || "Cleaner",
        question: q
      });
      setTutorialResponse(res);
    } catch (e) {
      console.error(e);
    } finally {
      setTutorialLoading(false);
    }
  };

  if (!user) return null;

  const shortcuts = [
    { label: "My Work", icon: Clock, href: "/cleaner/clock", color: "text-blue-500", bg: "bg-blue-50" },
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
      <motion.div variants={item} className="px-1 space-y-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
              {greeting}, {user.name.split(' ')[0]}! 👋
            </h1>
            <div className="flex items-center gap-2">
               <Badge variant="outline" className="bg-slate-900 text-white border-none font-black text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1">
                 <Flame className="w-2.5 h-2.5 text-orange-400 fill-orange-400" /> {user.points > 1500 ? 'GOLD STAR CLEANER' : 'NEW HELPER'}
               </Badge>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.points} points 🏆</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <Badge variant="outline" className={cn(
            "whitespace-nowrap font-black text-[8px] uppercase tracking-widest py-1 px-3 rounded-full",
            isOnShift ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-400 border-slate-100"
          )}>
            {isOnShift ? "● Working Now" : "○ Not Working"}
          </Badge>
        </div>
      </motion.div>

      <motion.div variants={item} className="px-1">
        <div 
          onClick={() => handleAskGuide("How do I use this app?")}
          className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-6 shadow-2xl shadow-blue-200 relative overflow-hidden group cursor-pointer active:scale-95 transition-all"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-110 transition-transform" />
          <div className="flex items-start gap-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-blue-100" />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest">Your AI Guide 🧠</p>
              <p className="text-sm font-bold text-white leading-relaxed">
                "{aiMessage}"
              </p>
              <p className="text-[10px] text-white/50 font-black uppercase tracking-widest pt-1 flex items-center gap-1">
                Tap here for help <ChevronRight className="w-3 h-3" />
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {needsAttentionItems.length > 0 && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-1 space-y-3"
          >
            <h3 className="text-[10px] font-black text-red-500 uppercase tracking-widest px-1 flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5" /> Things to Finish
            </h3>
            <div className="grid gap-2">
              {needsAttentionItems.map((attn, i) => (
                <Link key={i} href={attn.href}>
                  <div className="bg-white p-5 rounded-3xl border border-red-50 shadow-sm flex items-center justify-between group active:scale-[0.98] transition-all">
                    <div className="flex items-center gap-4">
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center bg-slate-50", attn.color)}>
                        <attn.icon className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-black text-slate-700">{attn.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-red-500 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={item} className="grid grid-cols-3 gap-4 px-1">
        {shortcuts.map((s) => (
          <Link 
            key={s.label} href={s.href} 
            className="flex flex-col items-center justify-center p-6 premium-card space-y-3 group active:scale-95 transition-all"
          >
            <div className={cn("w-14 h-14 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner", s.bg)}>
              <s.icon className={cn("w-7 h-7", s.color)} />
            </div>
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{s.label}</span>
          </Link>
        ))}
      </motion.div>

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
                  "border-none font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-full",
                  isOnShift ? "bg-blue-600 text-white animate-pulse" : "bg-emerald-50 text-emerald-600"
                )}>
                  {isOnShift ? "Working" : "Ready"}
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 bg-slate-50 p-4 rounded-3xl border border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Start Time</p>
                    <p className="text-sm font-black text-slate-700">{formatTime(todayShift.scheduledStart)}</p>
                  </div>
                  <div className="space-y-1 bg-slate-50 p-4 rounded-3xl border border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">At Site?</p>
                    <p className="text-sm font-black text-slate-700">{isOnShift ? "Yes" : "Nearby"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-3xl">
                  <MapPin className="w-5 h-5 text-blue-500 shrink-0 mt-1" />
                  <p className="text-sm font-black text-slate-700 leading-snug">{site.address}</p>
                </div>

                {!isOnShift && (
                  <Button variant="outline" className="w-full h-14 rounded-2xl border-slate-200 text-slate-600 font-black uppercase text-[10px] tracking-widest hover:bg-slate-50">
                    <Navigation className="w-4 h-4 mr-2" /> Open Maps
                  </Button>
                )}
              </div>

              <div className="pt-6 border-t border-slate-50 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                    {isOnShift ? "You're at work! 💪" : "Ready to start? 🚀"}
                  </h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">
                    {isOnShift 
                      ? "Great work! Remember to check off your tasks." 
                      : `Go to ${site.name}. We will start your work time when you arrive.`}
                  </p>
                </div>

                <Button asChild className="w-full h-18 rounded-[2.5rem] btn-gradient text-xl font-black border-none shadow-2xl">
                  <Link href="/cleaner/clock">{isOnShift ? "See My Tasks" : "Start Work"}</Link>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="premium-card border-dashed border-2 p-12 text-center space-y-6 flex flex-col items-center bg-slate-50/30">
            <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center">
              <Coffee className="w-10 h-10 text-amber-500" />
            </div>
            <div className="space-y-2">
              <p className="text-xl font-black text-slate-700">Rest & Recharge ☕</p>
              <p className="text-sm text-slate-400 font-medium">No work scheduled for the rest of today.</p>
            </div>
            <Button asChild variant="outline" className="rounded-2xl font-black uppercase text-[10px] tracking-widest px-8 h-12 border-slate-200">
               <Link href="/cleaner/shifts">See Schedule</Link>
            </Button>
          </div>
        )}
      </motion.div>

      <motion.div variants={item} className="px-1 space-y-4">
        <div className="flex items-center gap-2 px-1">
          <BookOpen className="w-4 h-4 text-slate-400" />
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Help & Support</h3>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <button 
            onClick={() => handleAskGuide("How do I take photos?")}
            className="bg-white p-5 rounded-[2rem] border border-slate-100 flex flex-col items-center gap-2 text-center active:scale-95 transition-all shadow-sm"
          >
            <Camera className="w-5 h-5 text-blue-500" />
            <span className="text-[9px] font-black text-slate-600 uppercase">Photos</span>
          </button>
          <a href="tel:4165550101" className="bg-white p-5 rounded-[2rem] border border-slate-100 flex flex-col items-center gap-2 text-center active:scale-95 transition-all shadow-sm">
            <Phone className="w-5 h-5 text-emerald-500" />
            <span className="text-[9px] font-black text-slate-600 uppercase">Call</span>
          </a>
          <button 
            onClick={() => handleAskGuide("How does the clock work?")}
            className="bg-white p-5 rounded-[2rem] border border-slate-100 flex flex-col items-center gap-2 text-center active:scale-95 transition-all shadow-sm"
          >
            <Clock className="w-5 h-5 text-amber-500" />
            <span className="text-[9px] font-black text-slate-600 uppercase">Work Time</span>
          </button>
        </div>
      </motion.div>

      {/* AI SMART GUIDE DIALOG */}
      <Dialog open={showTutorial} onOpenChange={setShowTutorial}>
        <DialogContent className="max-w-[400px] rounded-[3rem] p-0 overflow-hidden border-none shadow-3xl">
          <div className="p-8 bg-blue-600 text-white">
            <DialogHeader className="text-left space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <DialogTitle className="text-2xl font-black text-white">Smart Guide</DialogTitle>
              </div>
              <DialogDescription className="text-blue-100 font-medium text-sm">
                Your personal assistant for the Affinity app.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-10 space-y-8 bg-white min-h-[300px] flex flex-col justify-center">
            {tutorialLoading ? (
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Thinking...</p>
              </div>
            ) : tutorialResponse ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="text-5xl text-center mb-4">{tutorialResponse.emoji}</div>
                <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
                  <p className="text-lg font-bold text-slate-800 leading-relaxed">
                    {tutorialResponse.answer}
                  </p>
                </div>
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
                    <ChevronRight className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-xs font-black text-slate-500 uppercase tracking-tight">
                    {tutorialResponse.actionStep}
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="text-center space-y-4">
                <p className="text-slate-500 font-medium">How can I help you today?</p>
                <div className="grid gap-2">
                  <Button onClick={() => handleAskGuide("How do I start work?")} variant="outline" className="rounded-xl h-12 text-xs font-bold">How do I start work?</Button>
                  <Button onClick={() => handleAskGuide("How do I take photos?")} variant="outline" className="rounded-xl h-12 text-xs font-bold">How do I take photos?</Button>
                  <Button onClick={() => handleAskGuide("How do I earn points?")} variant="outline" className="rounded-xl h-12 text-xs font-bold">How do I earn points?</Button>
                </div>
              </div>
            )}
          </div>

          <div className="p-8 bg-slate-50 border-t border-slate-100">
            <Button 
              onClick={() => setShowTutorial(false)}
              className="w-full h-16 rounded-[2rem] bg-slate-900 text-white font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all"
            >
              Got it, thanks!
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
