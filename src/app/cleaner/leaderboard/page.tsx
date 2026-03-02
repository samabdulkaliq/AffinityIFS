
"use client";

import { useAuth } from "@/app/lib/store";
import { repository } from "@/app/lib/repository";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Crown, Star, Medal } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function LeaderboardPage() {
  const { user } = useAuth();
  const leaders = [...repository.users]
    .filter(u => u.role === 'CLEANER')
    .sort((a, b) => b.points - a.points)
    .slice(0, 10);

  return (
    <div className="space-y-12 pb-12 animate-in fade-in duration-1000">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-black text-white tracking-tighter">Elite Rankings</h2>
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em]">Global Operations Leaderboard</p>
      </div>

      {/* Premium Podium Component */}
      <div className="flex items-end justify-center gap-4 px-4 h-64 mb-4 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
        
        {/* 2nd Place */}
        <div className="flex flex-col items-center gap-3">
            <div className="relative">
                <Avatar className="h-16 w-16 border-2 border-slate-400 shadow-xl">
                    <AvatarImage src={leaders[1].avatarUrl} />
                    <AvatarFallback>2</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center shadow-lg border-2 border-background">
                    <span className="text-[10px] font-black text-slate-800">#2</span>
                </div>
            </div>
            <div className="w-20 h-24 premium-card border-slate-400/20 bg-slate-400/10 flex flex-col items-center justify-center rounded-t-3xl">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Silver</span>
            </div>
        </div>

        {/* 1st Place - The Hero */}
        <div className="flex flex-col items-center gap-4 z-10 scale-110">
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
                <div className="absolute -inset-4 bg-primary/40 rounded-full blur-2xl animate-pulse"></div>
                <Avatar className="h-24 w-24 border-4 border-primary shadow-[0_0_30px_rgba(59,130,246,0.5)] relative z-10">
                    <AvatarImage src={leaders[0].avatarUrl} />
                    <AvatarFallback>1</AvatarFallback>
                </Avatar>
                <div className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-xl border-4 border-background z-20">
                    <Crown className="w-5 h-5 text-white fill-white/20" />
                </div>
            </div>
            <div className="w-24 h-32 premium-card border-primary/40 bg-primary/10 flex flex-col items-center justify-center rounded-t-[2.5rem] shadow-[0_10px_40px_rgba(59,130,246,0.2)]">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">Champion</span>
            </div>
        </div>

        {/* 3rd Place */}
        <div className="flex flex-col items-center gap-3">
            <div className="relative">
                <Avatar className="h-14 w-14 border-2 border-amber-600/50 shadow-xl">
                    <AvatarImage src={leaders[2].avatarUrl} />
                    <AvatarFallback>3</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-amber-600 flex items-center justify-center shadow-lg border-2 border-background">
                    <span className="text-[9px] font-black text-white">#3</span>
                </div>
            </div>
            <div className="w-18 h-20 premium-card border-amber-600/20 bg-amber-600/10 flex flex-col items-center justify-center rounded-t-2xl">
                <span className="text-[8px] font-black text-amber-600/70 uppercase tracking-widest">Bronze</span>
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
                    "premium-card overflow-hidden",
                    isMe ? "bg-primary border-primary/20 shadow-primary/20 scale-[1.02] z-10" : "bg-white/5 border-white/5"
                  )}
                >
                    <div className="p-5 flex items-center gap-5">
                        <span className={cn("text-sm font-black w-6 text-center", isMe ? "text-white" : "text-muted-foreground")}>
                            {index + 1}
                        </span>
                        <Avatar className="h-12 w-12 border-2 border-white/10 shrink-0">
                            <AvatarImage src={leader.avatarUrl} />
                            <AvatarFallback>{leader.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <p className="text-sm font-black text-white leading-none">{leader.name}</p>
                            <p className={cn("text-[9px] mt-1 font-bold uppercase tracking-[0.2em]", isMe ? "text-white/70" : "text-muted-foreground")}>
                                {leader.workerType} Operation
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-base font-black text-white">{leader.points}</p>
                            <p className={cn("text-[8px] font-bold uppercase tracking-widest", isMe ? "text-white/70" : "text-muted-foreground")}>PTS</p>
                        </div>
                    </div>
                </motion.div>
            );
        })}
      </div>
    </div>
  );
}
