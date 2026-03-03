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
  CalendarCheck
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

/**
 * @fileOverview Redesigned Rewards 🏆 Page.
 * High-fidelity performance dashboard with warm brand accent (#F4B860).
 */

const EARNING_RULES = [
  { label: "Arrived on time", icon: Clock, color: "text-[#3A6FF7]", pts: "+100" },
  { label: "Uploaded all photos", icon: Camera, color: "text-emerald-500", pts: "+150" },
  { label: "Completed all tasks", icon: CheckCircle2, color: "text-indigo-500", pts: "+200" },
  { label: "5-Star rating", icon: Star, color: "text-[#F4B860]", pts: "+500" },
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
  { id: 'm3', name: 'Branded Winter Parka', cost: 2500, icon: Trophy, color: 'text-[#3A6FF7]' },
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
        description: `You need ${item.cost - (user?.points || 0)} more points.`
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
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Personal Performance</p>
      </div>

      {/* Points Hero */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="premium-card bg-[#0F172A] relative overflow-hidden text-white shadow-2xl border-none"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F4B860]/10 rounded-full -mr-32 -mt-32 blur-[100px]" />
        
        <div className="p-8 space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-[#F4B860] uppercase tracking-[0.4em]">Current Balance</span>
              <div className="flex items-baseline gap-2">
                <h2 className="text-6xl font-black text-white tracking-tighter">{user?.points?.toLocaleString()}</h2>
                <span className="text-[#F4B860] text-xs font-black uppercase tracking-widest">PTS</span>
              </div>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/5">
              <Zap className="w-7 h-7 text-[#F4B860] fill-[#F4B860]/20" />
            </div>
          </div>
          
          <div className="flex gap-3">
             <Dialog>
               <DialogTrigger asChild>
                  <Button className="flex-1 h-14 bg-[#F4B860] hover:bg-[#F4B860]/90 text-[#0F172A] rounded-2xl border-none font-black uppercase text-[11px] tracking-widest active:scale-95 transition-all">
                    Redeem Points <Sparkles className="w-4 h-4 ml-2" />
                  </Button>
               </DialogTrigger>
               <DialogContent className="max-w-[400px] rounded-[2.5rem] border-none shadow-2xl bg-white p-0 overflow-hidden">
                 <div className="p-8 bg-[#0F172A] text-white">
                   <DialogHeader className="text-left">
                     <DialogTitle className="text-2xl font-black text-white">Marketplace</DialogTitle>
                     <DialogDescription className="text-[#F4B860] font-black uppercase text-[9px] mt-1">
                       Available: {user?.points} PTS
                     </DialogDescription>
                   </DialogHeader>
                 </div>
                 <div className="p-6 space-y-3 bg-slate-50/50">
                    {MARKETPLACE.map((item) => (
                      <button 
                        key={item.id}
                        onClick={() => handleRedeemItem(item)}
                        className="w-full bg-white p-5 rounded-2xl border border-slate-100 flex items-center justify-between hover:border-[#3A6FF7] group"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center ${item.color}`}>
                            <item.icon className="w-6 h-6" />
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-black text-slate-800">{item.name}</p>
                            <p className="text-[10px] font-black text-slate-400">{item.cost} PTS</p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-primary" />
                      </button>
                    ))}
                 </div>
               </DialogContent>
             </Dialog>
          </div>
        </div>
      </motion.div>

      {/* Earning Rules */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#F4B860]" />
            How You Earn Points
        </h3>
        <div className="grid grid-cols-2 gap-3 px-1">
            {EARNING_RULES.map((rule, i) => (
              <div key={i} className="premium-card p-4 flex flex-col items-center text-center space-y-2">
                <div className={cn("w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center", rule.color)}>
                  <rule.icon className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[9px] font-black text-slate-400 uppercase">{rule.label}</p>
                  <p className="text-sm font-black text-emerald-600">{rule.pts}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
