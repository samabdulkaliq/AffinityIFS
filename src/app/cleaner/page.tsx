
"use client";

import { useAuth } from "../lib/store";
import { repository } from "../lib/repository";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MapPin, Clock, Shield, Zap, ChevronRight, LayoutGrid, Camera } from "lucide-react";
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
      className="space-y-8 pb-20"
    >
      {/* Operational Summary Section */}
      <motion.div variants={item} className="grid grid-cols-2 gap-4">
        <div className="stat-card">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
            <Shield className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-muted-label">Compliance</p>
          <p className="text-3xl font-black text-[#0F172A] mt-1">100%</p>
        </div>
        <div className="stat-card">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center mb-4">
            <Camera className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-muted-label">Documentation</p>
          <p className="text-3xl font-black text-[#0F172A] mt-1">4/5</p>
        </div>
      </motion.div>

      {/* Hero Shift Card - PRD 4.2 Focus */}
      <motion.div variants={item} className="space-y-4">
        <div className="flex justify-between items-end px-2">
          <h3 className="text-2xl font-black text-[#0F172A] tracking-tight">Deployment</h3>
          <Link href="/cleaner/shifts" className="text-xs font-bold text-blue-600 flex items-center gap-1 group">
            History <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {todayShift ? (
          <div className="premium-card bg-white overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 blur-3xl opacity-60"></div>
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-muted-label text-blue-600">Active Site</span>
                  <h4 className="text-3xl font-black text-[#0F172A] leading-none">{todayShift.siteName}</h4>
                </div>
                <div className="px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest">
                   {todayShift.status}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                    <MapPin className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Proximity</p>
                    <p className="text-xs text-[#475569] font-black">0.12 KM</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                    <Clock className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">EOD</p>
                    <p className="text-xs text-[#475569] font-black">
                      {new Date(todayShift.scheduledEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>

              <Button asChild className="w-full h-14 btn-premium hover:shadow-blue-200">
                <Link href="/cleaner/clock" className="flex items-center justify-center gap-2">
                  Launch SmartClock™ <ChevronRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="premium-card py-16 px-6 text-center border-dashed bg-slate-50/50">
            <LayoutGrid className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium italic">No active deployment scheduled</p>
          </div>
        )}
      </motion.div>

      {/* PRD 9.2: Compliance / Training Quick Access */}
      <motion.div variants={item} className="space-y-4">
        <h3 className="text-lg font-bold text-[#0F172A] px-2">Operational Protocol</h3>
        <Link href="/cleaner/log" className="block">
          <div className="premium-card bg-white border-l-4 border-indigo-500 hover:shadow-lg transition-all active:scale-[0.98]">
            <div className="p-6 flex gap-4">
              <div className="w-14 h-14 rounded-[1.25rem] bg-indigo-50 flex items-center justify-center shrink-0">
                <Shield className="w-7 h-7 text-indigo-500" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-black text-[#0F172A] uppercase tracking-tight">Archive Field Log</p>
                <p className="text-xs text-[#475569] leading-relaxed font-medium">
                  Submit hourly documentation and inventory photos to ensure compliance.
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 ml-auto self-center" />
            </div>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}
