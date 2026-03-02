
"use client";

import { useAuth } from "../lib/store";
import { repository } from "../lib/repository";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MapPin, Clock, Star, Zap, ChevronRight, LayoutGrid } from "lucide-react";
import { motion } from "framer-motion";

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
  const todayShift = repository.getShiftsForUser(user!.id).find(s => s.status === 'SCHEDULED' || s.status === 'IN_PROGRESS');

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-10"
    >
      {/* Premium Header Stats */}
      <motion.div variants={item} className="grid grid-cols-2 gap-4">
        <div className="premium-card p-6 flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-full -mr-8 -mt-8 blur-2xl"></div>
          <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center mb-3">
            <Zap className="w-6 h-6 text-primary" />
          </div>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Total Points</p>
          <p className="text-3xl font-black mt-1 text-white">{user?.points}</p>
        </div>
        <div className="premium-card p-6 flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-500/10 rounded-full -mr-8 -mt-8 blur-2xl"></div>
          <div className="w-12 h-12 rounded-2xl bg-yellow-500/20 flex items-center justify-center mb-3">
            <Star className="w-6 h-6 text-yellow-500" />
          </div>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">User Rating</p>
          <p className="text-3xl font-black mt-1 text-white">4.9</p>
        </div>
      </motion.div>

      {/* Hero Shift Component */}
      <motion.div variants={item} className="space-y-4">
        <div className="flex justify-between items-end px-2">
          <h3 className="text-2xl font-black text-white tracking-tight">Active Duty</h3>
          <Link href="/cleaner/shifts" className="text-xs font-bold text-primary flex items-center gap-1 group">
            Schedule <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {todayShift ? (
          <div className="premium-card bg-gradient-to-br from-card to-primary/10 overflow-hidden relative border-t border-white/10">
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full -mr-20 -mt-20 blur-[80px]"></div>
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Next Location</span>
                  <h4 className="text-3xl font-black text-white leading-none">{todayShift.siteName}</h4>
                </div>
                <div className="px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-[10px] font-black uppercase tracking-widest">
                  Live Status
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Address</p>
                    <p className="text-xs text-white font-medium truncate max-w-[120px]">
                      {repository.getSite(todayShift.siteId)?.address}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Time</p>
                    <p className="text-xs text-white font-medium">
                      {new Date(todayShift.scheduledStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>

              <Button asChild className="w-full h-14 btn-premium rounded-2xl shadow-xl">
                <Link href="/cleaner/clock" className="flex items-center justify-center gap-2">
                  Launch SmartClock™ <ChevronRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="premium-card py-16 px-6 text-center border-dashed border-white/10 bg-transparent">
            <LayoutGrid className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground font-medium italic">No operations scheduled for today</p>
          </div>
        )}
      </motion.div>

      {/* Daily Performance Insight */}
      <motion.div variants={item} className="space-y-4">
        <h3 className="text-lg font-bold text-white px-2">Growth Center</h3>
        <div className="premium-card bg-gradient-to-r from-indigo-500/20 to-blue-500/20 border-l-4 border-indigo-500">
          <div className="p-6 flex gap-4">
            <div className="w-14 h-14 rounded-[1.25rem] bg-indigo-500 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/30">
              <Star className="w-7 h-7 text-white fill-white/20" />
            </div>
            <div className="space-y-1">
              <p className="font-black text-white text-sm uppercase tracking-tight">Elite Streak</p>
              <p className="text-xs text-white/60 leading-relaxed font-medium">
                Finish today's shift without any location disputes to reach <span className="text-indigo-400 font-bold">Gold Tier</span> status.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
