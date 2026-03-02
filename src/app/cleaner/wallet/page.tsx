"use client";

import { useAuth } from "@/app/lib/store";
import { repository } from "@/app/lib/repository";
import { Button } from "@/components/ui/button";
import { Wallet, ArrowUpRight, Zap, Star, Trophy, ArrowRight, History } from "lucide-react";
import { motion } from "framer-motion";

export default function CleanerWalletPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-10 pb-12 animate-in fade-in duration-700">
      {/* High-Contrast Balance Card */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="premium-card bg-[#0F172A] border-none relative overflow-hidden text-white"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full -mr-32 -mt-32 blur-[100px] pointer-events-none"></div>
        
        <div className="p-8 space-y-10">
          <div className="flex justify-between items-start">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
              <Wallet className="w-7 h-7 text-white" />
            </div>
            <div className="text-right">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Points Balance</span>
              <motion.h2 
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="text-6xl font-black text-white tracking-tighter mt-1"
              >
                {user?.points}
              </motion.h2>
            </div>
          </div>
          
          <div className="flex gap-4">
             <Button className="flex-1 h-14 btn-premium rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 border-none shadow-xl active:scale-95">
               <ArrowUpRight className="w-5 h-5 mr-2" /> Redeem Rewards
             </Button>
             <Button variant="outline" className="w-14 h-14 rounded-2xl border-white/10 bg-white/5 flex items-center justify-center p-0 hover:bg-white/10 transition-all">
               <History className="w-5 h-5 text-white" />
             </Button>
          </div>
        </div>
      </motion.div>

      {/* Performance Tracks */}
      <div className="space-y-6">
        <h3 className="text-xl font-black text-[#0F172A] px-2 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-blue-600" />
            Earning Potential
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <motion.div whileTap={{ scale: 0.98 }} className="premium-card p-6 bg-white hover:shadow-lg transition-all border border-slate-100 group">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0 transition-colors group-hover:bg-blue-100">
                <Zap className="w-7 h-7 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-black text-[#0F172A] uppercase tracking-tight">On-Time Master</p>
                <p className="text-xs text-[#475569] font-semibold mt-1">Earn 200 pts for 5 perfect site arrivals</p>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 transition-all" />
            </div>
          </motion.div>
          
          <motion.div whileTap={{ scale: 0.98 }} className="premium-card p-6 bg-white hover:shadow-lg transition-all border border-slate-100 group">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0 transition-colors group-hover:bg-amber-100">
                <Star className="w-7 h-7 text-amber-500 fill-amber-500/10" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-black text-[#0F172A] uppercase tracking-tight">Review Champion</p>
                <p className="text-xs text-[#475569] font-semibold mt-1">Earn 500 pts for 5-star feedback</p>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-amber-500 transition-all" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
