
"use client";

import { useState } from "react";
import { useAuth } from "@/app/lib/store";
import { repository } from "@/app/lib/repository";
import { Button } from "@/components/ui/button";
import { 
  Zap, 
  Trophy, 
  History, 
  TrendingUp, 
  Sparkles, 
  ChevronRight, 
  Gift, 
  ShoppingBag, 
  CheckCircle2,
  Clock,
  Camera,
  ShieldCheck,
  Star,
  Flame,
  Diamond,
  CalendarCheck,
  AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogTrigger 
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

/**
 * @fileOverview Redesigned Rewards 🏆 Page.
 * High-fidelity performance dashboard with achievements, earning rules, and marketplace.
 */

const EARNING_RULES = [
  { label: "Arrived on time", icon: Clock, color: "text-blue-500", pts: "+100" },
  { label: "Uploaded all photos", icon: Camera, color: "text-emerald-500", pts: "+150" },
  { label: "Completed all tasks", icon: CheckCircle2, color: "text-indigo-500", pts: "+200" },
  { label: "5-Star rating", icon: Star, color: "text-amber-500", pts: "+500" },
  { label: "Zero safety issues", icon: ShieldCheck, color: "text-purple-500", pts: "+300" },
  { label: "Full week completed", icon: CalendarCheck, color: "text-pink-500", pts: "+1000" },
];

const ACHIEVEMENTS = [
  { title: "Reliable Starter", icon: Star, progress: 80, goal: "10 on-time shifts", current: 8 },
  { title: "Photo Pro", icon: Camera, progress: 40, goal: "50 verify photos", current: 20 },
  { title: "7-Day Streak", icon: Flame, progress: 100, goal: "7 consecutive days", current: 7, completed: true },
];

const MARKETPLACE = [
  { id: 'm1', name: '$10 Starbucks Card', cost: 1000, icon: Gift, color: 'text-emerald-500' },
  { id: 'm2', name: '$50 Amazon Credit', cost: 5000, icon: ShoppingBag, color: 'text-orange-500' },
  { id: 'm3', name: 'Branded Winter Parka', cost: 2500, icon: Trophy, color: 'text-blue-500' },
  { id: 'm4', name: 'Performance Bonus $25', cost: 2500, icon: Diamond, color: 'text-indigo-500' },
];

export default function CleanerRewardsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isRedeeming, setIsRedeeming] = useState(false);
  const transactions = repository.getRewardsForUser(user?.id || "");

  const handleRedeemItem = (item: typeof MARKETPLACE[0]) => {
    if ((user?.points || 0) < item.cost) {
      toast({
        variant: "destructive",
        title: "Insufficient Points",
        description: `You need ${item.cost - (user?.points || 0)} more points for this reward.`
      });
      return;
    }
    
    setIsRedeeming(true);
    setTimeout(() => {
      setIsRedeeming(false);
      toast({
        title: "Redemption Successful! ✨",
        description: `Your ${item.name} is being processed.`
      });
    }, 1500);
  };

  return (
    <div className="space-y-8 pb-32 animate-in fade-in duration-700">
      <div className="px-1">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Rewards 🏆</h2>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Personal Performance Dashboard</p>
      </div>

      {/* 1. Points Hero */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="premium-card bg-slate-900 border-none relative overflow-hidden text-white shadow-2xl shadow-blue-900/20"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -mr-32 -mt-32 blur-[100px] pointer-events-none"></div>
        
        <div className="p-8 space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em]">Current Balance</span>
              <div className="flex items-baseline gap-2">
                <motion.h2 
                  key={user?.points}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-6xl font-black text-white tracking-tighter"
                >
                  {user?.points?.toLocaleString()}
                </motion.h2>
                <span className="text-blue-400 text-xs font-black uppercase tracking-widest">PTS</span>
              </div>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/5 backdrop-blur-sm">
              <Zap className="w-7 h-7 text-blue-400 fill-blue-400/20" />
            </div>
          </div>
          
          <p className="text-xs text-white/50 font-medium">Earn points by completing shifts and tasks.</p>

          <div className="flex gap-3">
             <Dialog>
               <DialogTrigger asChild>
                  <Button className="flex-1 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl border-none shadow-xl shadow-blue-900/40 font-black uppercase text-[11px] tracking-widest active:scale-95 transition-all">
                    Redeem Points <Sparkles className="w-4 h-4 ml-2" />
                  </Button>
               </DialogTrigger>
               <DialogContent className="max-w-[400px] rounded-[2.5rem] border-none shadow-2xl bg-white p-0 overflow-hidden">
                 <div className="p-8 bg-slate-900 text-white relative">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
                   <DialogHeader className="relative z-10 text-left">
                     <DialogTitle className="text-2xl font-black tracking-tight text-white">Marketplace</DialogTitle>
                     <DialogDescription className="text-slate-400 font-bold uppercase text-[9px] tracking-widest mt-1">
                       Available: {user?.points} PTS
                     </DialogDescription>
                   </DialogHeader>
                 </div>
                 <div className="p-6 space-y-3 bg-slate-50/50 max-h-[60vh] overflow-y-auto scrollbar-hide">
                    {MARKETPLACE.map((item) => (
                      <button 
                        key={item.id}
                        onClick={() => handleRedeemItem(item)}
                        disabled={isRedeeming}
                        className="w-full bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-blue-200 transition-all active:scale-95 group"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                            <item.icon className="w-6 h-6" />
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-black text-slate-800">{item.name}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.cost} PTS</p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-blue-500" />
                      </button>
                    ))}
                 </div>
               </DialogContent>
             </Dialog>

             <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
               <TrendingUp className="w-6 h-6 text-emerald-400" />
             </div>
          </div>
        </div>
      </motion.div>

      {/* 2. How You Earn */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            How You Earn Points
        </h3>
        <div className="grid grid-cols-2 gap-3 px-1">
            {EARNING_RULES.map((rule, i) => (
              <div key={i} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center text-center space-y-2">
                <div className={cn("w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center", rule.color)}>
                  <rule.icon className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{rule.label}</p>
                  <p className="text-sm font-black text-emerald-600">{rule.pts}</p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* 3. Achievements */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-blue-500" />
            Milestones
        </h3>
        <div className="space-y-3 px-1">
          {ACHIEVEMENTS.map((ach, i) => (
            <Card key={i} className="border-none shadow-sm rounded-3xl overflow-hidden bg-white group">
              <CardContent className="p-5 flex items-center gap-5">
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border",
                  ach.completed ? "bg-amber-50 border-amber-100 text-amber-500" : "bg-slate-50 border-slate-50 text-slate-300"
                )}>
                  <ach.icon className="w-6 h-6" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-black text-slate-800">{ach.title}</h4>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{ach.current}/{ach.goal}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${ach.progress}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className={cn(
                        "h-full rounded-full",
                        ach.completed ? "bg-amber-500" : "bg-blue-500"
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 4. History Ledger */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <History className="w-4 h-4 text-slate-300" />
                Ledger
            </h3>
            <Badge variant="outline" className="text-[8px] font-black border-slate-200 text-slate-300">LIVE HISTORY</Badge>
        </div>
        
        <div className="space-y-2 px-1">
            {transactions.slice(0, 5).map((t, i) => (
                <motion.div 
                    key={t.id}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                >
                    <Card className="border-none shadow-sm rounded-2xl bg-white/80 group hover:bg-white transition-colors">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-50/50 flex items-center justify-center text-blue-500">
                                    <Star className="w-4 h-4" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-xs font-bold text-slate-800 leading-tight">{t.reason}</p>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
                                        {new Date(t.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                            <span className="text-sm font-black text-emerald-600">+{t.pointsDelta}</span>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
      </div>
    </div>
  );
}

const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");
