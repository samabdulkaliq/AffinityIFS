"use client";

import { useAuth } from "@/app/lib/store";
import { repository } from "@/app/lib/repository";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Medal, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LeaderboardPage() {
  const { user } = useAuth();
  // Sort users by points for the leaderboard demo
  const leaders = [...repository.users]
    .filter(u => u.role === 'CLEANER')
    .sort((a, b) => b.points - a.points)
    .slice(0, 10);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-primary">Leaderboard</h2>
        <p className="text-sm text-muted-foreground font-medium">Top Performers this Month 🏆</p>
      </div>

      <div className="flex items-end justify-center gap-2 px-4 h-48 mb-8">
        {/* Podium Simulation */}
        <div className="flex flex-col items-center gap-2">
            <Avatar className="h-12 w-12 border-2 border-slate-300">
                <AvatarImage src={leaders[2].avatarUrl} />
                <AvatarFallback>3</AvatarFallback>
            </Avatar>
            <div className="w-16 h-16 bg-slate-200 rounded-t-xl flex items-center justify-center shadow-inner">
                <span className="font-bold text-slate-500">3rd</span>
            </div>
        </div>

        <div className="flex flex-col items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500 mb-1" />
            <Avatar className="h-16 w-16 border-4 border-yellow-400">
                <AvatarImage src={leaders[0].avatarUrl} />
                <AvatarFallback>1</AvatarFallback>
            </Avatar>
            <div className="w-20 h-24 bg-yellow-400 rounded-t-xl flex items-center justify-center shadow-lg shadow-yellow-200">
                <span className="font-bold text-yellow-900">1st</span>
            </div>
        </div>

        <div className="flex flex-col items-center gap-2">
            <Avatar className="h-14 w-14 border-2 border-slate-400">
                <AvatarImage src={leaders[1].avatarUrl} />
                <AvatarFallback>2</AvatarFallback>
            </Avatar>
            <div className="w-18 h-20 bg-slate-300 rounded-t-xl flex items-center justify-center shadow-inner">
                <span className="font-bold text-slate-600">2nd</span>
            </div>
        </div>
      </div>

      <div className="space-y-2">
        {leaders.map((leader, index) => {
            const isMe = leader.id === user?.id;
            return (
                <Card key={leader.id} className={cn(
                    "border-none shadow-sm transition-all",
                    isMe ? "bg-secondary text-white scale-[1.02] shadow-secondary/20 z-10" : "bg-white"
                )}>
                    <CardContent className="p-4 flex items-center gap-4">
                        <span className={cn("text-sm font-bold w-6 text-center", isMe ? "text-white" : "text-slate-400")}>
                            {index + 1}
                        </span>
                        <Avatar className="h-10 w-10 border-2 border-white/50">
                            <AvatarImage src={leader.avatarUrl} />
                            <AvatarFallback>{leader.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <p className="text-sm font-bold leading-none">{leader.name}</p>
                            <p className={cn("text-[10px] mt-1 font-medium uppercase tracking-widest", isMe ? "text-white/80" : "text-muted-foreground")}>
                                {leader.workerType}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-bold">{leader.points}</p>
                            <p className={cn("text-[10px] font-medium uppercase", isMe ? "text-white/80" : "text-muted-foreground")}>pts</p>
                        </div>
                    </CardContent>
                </Card>
            );
        })}
      </div>
    </div>
  );
}
