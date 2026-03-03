"use client";

import { useAuth } from "@/app/lib/store";
import { repository } from "@/app/lib/repository";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Crown, Star, Medal } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function LeaderboardPage() {
  const { user } = useAuth();
  const allCleaners = [...repository.users]
    .filter(u => u.role === 'CLEANER')
    .sort((a, b) => b.points - a.points);
  
  const leaders = allCleaners.slice(0, 10);
  const myRank = allCleaners.findIndex(u => u.id === user?.id) + 1;

  return (
    <div className="space-y-12 pb-24 animate-in fade-in duration-1000">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-black text-[#0F172A] tracking-tighter">Arena</h2>
        <p className="text-[10px] font-black text-[#94A3B8] uppercase tracking-[0.4em]">Global Operations Rankings</p>
      </div>

      {/* Premium Podium Component */}
      <div className="flex items-end justify-center gap-4 px-4 h-64 mb-4 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
        
        {/* 2nd Place */}
        {leaders[1] && (
            <div className="flex flex-col items-center gap-3">
                <div className="relative">
                    <Avatar className="h-16 w-16 border-2 border-slate-200 shadow-xl">
                        <AvatarImage src={leaders[1].avatarUrl} />
                        <AvatarFallback>2</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shadow-lg border-2 border-white">
                        <span className="text-[10px] font-black text-slate-600">#2</span>
                    </div>
                </div>
                <div className="w-20 h-24 premium-card border-slate-100 bg-white/50 flex flex-col items-center justify-center rounded-t-3xl">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Silver</span>
                    <span className="text-xs font-black text-slate-800 mt-1">{leaders[1].points}</span>
                </div>
            </div>
        )}

        {/* 1st Place - The Hero */}
        {leaders[0] && (
            <div className="flex flex-col items-center gap-4 z-10 scale-110">
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="relative"
                >
                    <div className="absolute -inset-4 bg-primary/10 rounded-full blur-2xl animate-pulse"></div>
                    <Avatar className="h-24 w-24 border-4 border-white shadow-[0_15px_35px_rgba(37,99,235,0.2)] relative z-10">
                        <AvatarImage src={leaders[0].avatarUrl} />
                        <AvatarFallback>1</AvatarFallback>
                    </Avatar>
                    <div className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-xl border-4 border-white z-20">
                        <Crown className="w-5 h-5 text-white fill-white/20" />
                    </div>
                </motion.div>
                <div className="w-24 h-32 premium-card border-primary/20 bg-white flex flex-col items-center justify-center rounded-t-[2.5rem] shadow-[0_10px_40px_rgba(37,99,235,0.1)]">
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">Champion</span>
                    <span className="text-sm font-black text-slate-900 mt-2">{leaders[0].points}</span>
                </div>
            </div>
        )}

        {/* 3rd Place */}
        {leaders[2] && (
            <div className="flex flex-col items-center gap-3">
                <div className="relative">
                    <Avatar className="h-14 w-14 border-2 border-amber-100 shadow-xl">
                        <AvatarImage src={leaders[2].avatarUrl} />
                        <AvatarFallback>3</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center shadow-lg border-2 border-white">
                        <span className="text-[9px] font-black text-white">#3</span>
                    </div>
                </div>
                <div className="w-18 h-20 premium-card border-amber-50 bg-white/50 flex flex-col items-center justify-center rounded-t-2xl">
                    <span className="text-[8px] font-black text-amber-600/70 uppercase tracking-widest">Bronze</span>
                    <span className="text-[10px] font-black text-slate-800 mt-1">{leaders[2].points}</span>
                </div>
            </div>
        )}
      </div>

      {/* Current User Stats */}
      <div className="px-4">
          <div className="premium-card bg-slate-900 text-white p-6 flex items-center justify-between shadow-2xl shadow-slate-900/20">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Your Ranking</p>
                    <p className="text-lg font-black tracking-tight">Top {Math.round((myRank / allCleaners.length) * 100)}% of Staff</p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-2xl font-black text-white leading-none">#{myRank}</p>
                <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">Position</p>
            </div>
          </div>
      </div>

      {/* Ranking Rows */}
      <div className="space-y-3 px-2">
        {leaders.map((leader, index) => {
            const isMe = leader.id === user?.id;
            return (
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  key={leader.id} 
                  className={cn(
                    "premium-card overflow-hidden transition-all",
                    isMe ? "bg-blue-600 border-blue-500 shadow-xl shadow-blue-500/20 scale-[1.02] z-10" : "bg-white"
                  )}
                >
                    <div className="p-5 flex items-center gap-5">
                        <span className={cn("text-sm font-black w-6 text-center", isMe ? "text-white" : "text-slate-400")}>
                            {index + 1}
                        </span>
                        <Avatar className="h-12 w-12 border-2 border-white/50 shrink-0 shadow-sm">
                            <AvatarImage src={leader.avatarUrl} />
                            <AvatarFallback>{leader.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <p className={cn("text-sm font-black leading-none", isMe ? "text-white" : "text-slate-900")}>{leader.name}</p>
                            <p className={cn("text-[9px] mt-1 font-bold uppercase tracking-[0.2em]", isMe ? "text-white/70" : "text-slate-400")}>
                                {leader.workerType} Operation
                            </p>
                        </div>
                        <div className="text-right">
                            <p className={cn("text-base font-black", isMe ? "text-white" : "text-slate-900")}>{leader.points}</p>
                            <p className={cn("text-[8px] font-bold uppercase tracking-widest", isMe ? "text-white/70" : "text-slate-400")}>PTS</p>
                        </div>
                    </div>
                </motion.div>
            );
        })}
      </div>
    </div>
  );
}
