"use client";

import { useState } from "react";
import { useAuth } from "@/app/lib/store";
import { repository } from "@/app/lib/repository";
import { Button } from "@/components/ui/button";
import { 
  Wallet, 
  Zap, 
  Trophy, 
  History, 
  TrendingUp, 
  Sparkles, 
  ChevronRight, 
  Gift, 
  ShoppingBag, 
  CheckCircle2,
  AlertCircle
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
 * @fileOverview Streamlined Vault (Wallet) page.
 * Features a high-fidelity Points Dashboard and a mock Marketplace.
 */

const MOCK_MARKETPLACE = [
  { id: 'm1', name: '$10 Starbucks Card', cost: 1000, icon: Gift, color: 'text-emerald-500' },
  { id: 'm2', name: '$50 Amazon Credit', cost: 5000, icon: ShoppingBag, color: 'text-orange-500' },
  { id: 'm3', name: 'Branded Winter Parka', cost: 2500, icon: Trophy, color: 'text-blue-500' },
  { id: 'm4', name: 'Direct Deposit $25', cost: 2500, icon: Wallet, color: 'text-indigo-500' },
];

export default function CleanerWalletPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isRedeeming, setIsRedeeming] = useState(false);
  const transactions = repository.getRewardsForUser(user?.id || "");

  const handleRedeemItem = (item: typeof MOCK_MARKETPLACE[0]) => {
    if ((user?.points || 0) < item.cost) {
      toast({
        variant: "destructive",
        title: "Insufficient Points",
        description: `You need ${item.cost - (user?.points || 0)} more points for this reward.`
      });
      return;
    }
    
    setIsRedeeming(true);
    // Simulation
    setTimeout(() => {
      setIsRedeeming(false);
      toast({
        title: "Redemption Successful! ✨",
        description: `Your ${item.name} is being processed by the HR portal.`
      });
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-700">
      <div className="px-1">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Vault</h2>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Operational Equity</p>
      </div>

      {/* Balance Hero Card */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="premium-card bg-slate-900 border-none relative overflow-hidden text-white shadow-2xl shadow-slate-900/40"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -mr-32 -mt-32 blur-[100px] pointer-events-none"></div>
        
        <div className="p-8 space-y-8">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em]">Available Balance</span>
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
          
          <div className="flex gap-3">
             <Dialog>
               <DialogTrigger asChild>
                  <Button className="flex-1 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl border-none shadow-xl shadow-blue-900/40 font-black uppercase text-[11px] tracking-widest active:scale-95 transition-all">
                    Marketplace <Sparkles className="w-4 h-4 ml-2" />
                  </Button>
               </DialogTrigger>
               <DialogContent className="max-w-[400px] rounded-[2rem] border-none shadow-2xl bg-white p-0 overflow-hidden">
                 <div className="p-6 bg-slate-900 text-white relative">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
                   <DialogHeader className="relative z-10">
                     <DialogTitle className="text-2xl font-black tracking-tight text-white">Redeem Rewards</DialogTitle>
                     <DialogDescription className="text-slate-400 font-bold uppercase text-[9px] tracking-widest">
                       Your Balance: {user?.points} PTS
                     </DialogDescription>
                   </DialogHeader>
                 </div>
                 <div className="p-6 space-y-3 bg-slate-50/50">
                    {MOCK_MARKETPLACE.map((item) => (
                      <button 
                        key={item.id}
                        onClick={() => handleRedeemItem(item)}
                        disabled={isRedeeming}
                        className="w-full bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-blue-200 transition-all active:scale-95 group"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                            <item.icon className="w-5 h-5" />
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-black text-slate-800">{item.name}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.cost} PTS</p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-200 group-hover:text-blue-500" />
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

      {/* Activity Ledger */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <History className="w-4 h-4 text-blue-500" />
                Ledger
            </h3>
            <Badge variant="outline" className="text-[9px] font-black border-slate-200 text-slate-400 px-2 py-0">LIVE HISTORY</Badge>
        </div>
        
        <div className="space-y-2">
            {transactions.slice(0, 8).map((t, i) => (
                <motion.div 
                    key={t.id}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                >
                    <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden group hover:bg-slate-50 transition-colors">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-white transition-colors border border-transparent group-hover:border-blue-100">
                                    <Trophy className="w-4 h-4 text-blue-500" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-xs font-bold text-slate-800 leading-tight">{t.reason}</p>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
                                        {new Date(t.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-black text-emerald-600">+{t.pointsDelta}</span>
                                <Badge className="bg-emerald-50 text-emerald-600 border-none p-1 rounded-full">
                                  <CheckCircle2 className="w-3 h-3" />
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
      </div>

      {/* Growth Progress Card */}
      <Card className="border-none bg-gradient-to-r from-blue-50 to-indigo-50 rounded-[2.5rem] overflow-hidden border border-blue-100/30">
        <CardContent className="p-6">
          <div className="flex items-center gap-5 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-md shrink-0 border border-blue-50">
              <TrendingUp className="w-6 h-6 text-indigo-500" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Next Achievement</p>
              <p className="text-sm font-black text-slate-700 leading-tight mt-0.5">Elite Performance Tier</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <span>Progress</span>
              <span>85%</span>
            </div>
            <div className="h-2 w-full bg-white rounded-full overflow-hidden shadow-inner border border-blue-100/20">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "85%" }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
              />
            </div>
            <p className="text-[10px] text-slate-500 font-medium leading-relaxed italic text-center pt-1">
              Complete 2 more shifts with 5-star ratings to unlock.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
