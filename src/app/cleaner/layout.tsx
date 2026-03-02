
"use client";

import { useAuth } from "../lib/store";
import { CleanerBottomNav } from "../components/cleaner/bottom-nav";
import { Bell, User } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";

export default function CleanerLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (!user || user.role !== 'CLEANER') return null;

  return (
    <div className="flex flex-col flex-1 pb-32">
      <header className="flex justify-between items-center p-6 sticky top-0 bg-transparent z-40">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12 border-2 border-white/20 shadow-2xl ring-2 ring-primary/20 transition-transform active:scale-90">
            <AvatarImage src={user.avatarUrl} />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
          <div className="space-y-0.5">
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">Affinity Integrated</p>
            <h2 className="text-lg font-black text-white leading-none">{user.name.split(' ')[0]}</h2>
          </div>
        </div>
        <div className="flex gap-3">
          <Link href="/cleaner/notifications" className="w-12 h-12 rounded-2xl glass flex items-center justify-center relative transition-all active:scale-95">
            <Bell className="w-5 h-5 text-white" />
            <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-primary rounded-full border-2 border-card shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
          </Link>
          <Link href="/cleaner/settings" className="w-12 h-12 rounded-2xl glass flex items-center justify-center transition-all active:scale-95">
            <User className="w-5 h-5 text-white" />
          </Link>
        </div>
      </header>

      <main className="flex-1 p-6 overflow-x-hidden">
        {children}
      </main>

      <CleanerBottomNav />
    </div>
  );
}
