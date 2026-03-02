
"use client";

import { useAuth } from "@/app/lib/store";
import { repository } from "@/app/lib/repository";
import { Button } from "@/components/ui/button";
import { Wallet, ArrowUpRight, ArrowDownLeft, Zap, Star, Trophy, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function CleanerWalletPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-10 pb-12 animate-in fade-in duration-700">
      {/* Dark Elevated Balance Card */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="premium-card bg-slate-950/60 border border-white/10 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full -mr-32 -mt-32 blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full -ml-24 -mb-24 blur-[80px] pointer-events-none"></div>
        
        <div className="p-8 space-y-10">
          <div className="flex justify-between items-start">
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
              <Wallet className="w-7 h-7 text-white" />
            </div>
            <div className="text-right">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em]">Available Rewards</span>
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
             <Button className="flex-1 h-14 btn-premium rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 border-none shadow-2xl">
               <ArrowUpRight className="w-5 h-5 mr-2" /> Redeem Points
             </Button>
             <Button variant="outline" className="w-14 h-14 premium-card border-white/10 flex items-center justify-center p-0">
               <ArrowRight className="w-5 h-5 text-white" />
             </Button>
          </div>
        </div>
      </motion.div>

      {/* Performance Ledger Section */}
      <div className="space-y-6">
        <h3 className="text-xl font-black text-white px-2 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-primary" />
            Growth Opportunities
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <motion.div whileTap={{ scale: 0.98 }} className="premium-card p-6 bg-primary/5 hover:bg-primary/10 border-primary/10">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center shrink-0">
                <Zap className="w-7 h-7 text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-black text-white uppercase tracking-tight">Clock-In streak</p>
                <p className="text-xs text-muted-foreground font-medium mt-1">Earn 200 pts for 5 perfect cycles</p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground/30" />
            </div>
          </motion.div>
          
          <motion.div whileTap={{ scale: 0.98 }} className="premium-card p-6 bg-yellow-500/5 hover:bg-yellow-500/10 border-yellow-500/10">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-yellow-500/20 flex items-center justify-center shrink-0">
                <Star className="w-7 h-7 text-yellow-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-black text-white uppercase tracking-tight">5-Star Feedback</p>
                <p className="text-xs text-muted-foreground font-medium mt-1">Earn 500 pts for excellence ratings</p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground/30" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
