"use client";

import { useAuth } from "@/app/lib/store";
import { repository } from "@/app/lib/repository";
import { Button } from "@/components/ui/button";
import { Wallet, Zap, Trophy, History, TrendingUp, Sparkles, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/**
 * @fileOverview Streamlined Vault (Wallet) page.
 * Merges rewards and marketplace into a single, compact "Points Dashboard".
 */

export default function CleanerWalletPage() {
  const { user } = useAuth();
  const transactions = repository.getRewardsForUser(user?.id || "");

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-700">
      <div className="px-1">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Vault</h2>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Earnings & Growth</p>
      </div>

      {/* Simplified High-Contrast Balance Card */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="premium-card bg-[#0F172A] border-none relative overflow-hidden text-white"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full -mr-24 -mt-24 blur-[80px] pointer-events-none"></div>
        
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[9px] font-black text-blue-400 uppercase tracking-[0.4em]">Available Balance</span>
              <motion.h2 
                key={user?.points}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-5xl font-black text-white tracking-tighter"
              >
                {user?.points}
              </motion.h2>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/5">
              <Zap className="w-6 h-6 text-blue-400 fill-blue-400/20" />
            </div>
          </div>
          
          <div className="flex gap-3">
             <Button className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl border-none shadow-xl shadow-blue-900/40 font-black uppercase text-[10px] tracking-widest active:scale-95 transition-all">
               Redeem <Sparkles className="w-3.5 h-3.5 ml-2" />
             </Button>
             <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
               <TrendingUp className="w-5 h-5 text-emerald-400" />
             </div>
          </div>
        </div>
      </motion.div>

      {/* Combined Activity & Rewards Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <History className="w-4 h-4 text-blue-500" />
                Ledger
            </h3>
            <Badge variant="outline" className="text-[8px] font-black border-slate-200 text-slate-400">RECENT</Badge>
        </div>
        
        <div className="space-y-2">
            {transactions.slice(0, 5).map((t, i) => (
                <motion.div 
                    key={t.id}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                >
                    <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden group hover:bg-slate-50 transition-colors">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-white transition-colors">
                                    <Trophy className="w-4 h-4 text-blue-500" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-xs font-bold text-slate-800">{t.reason}</p>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
                                        {new Date(t.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-black text-emerald-600">+{t.pointsDelta}</span>
                                <ChevronRight className="w-3.5 h-3.5 text-slate-200" />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
      </div>

      {/* Simplified Growth Track */}
      <Card className="border-none bg-gradient-to-r from-blue-50 to-indigo-50 rounded-[2rem] overflow-hidden">
        <CardContent className="p-6 flex items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm shrink-0">
            <TrendingUp className="w-6 h-6 text-indigo-500" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Next Milestone</p>
            <p className="text-xs font-bold text-slate-700 leading-tight mt-1">
              Complete 2 more shifts with 5-star ratings to unlock <span className="text-indigo-600 font-black">Elite Status</span>.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
