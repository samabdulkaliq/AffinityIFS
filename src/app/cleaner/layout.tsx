"use client";

import { useAuth } from "../lib/store";
import { CleanerBottomNav } from "../components/cleaner/bottom-nav";
import { Bell, Settings } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function CleanerLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (!user || user.role !== 'CLEANER') return null;

  return (
    <div className="flex flex-col flex-1 pb-16">
      <header className="flex justify-between items-center p-4 sticky top-0 bg-background/80 backdrop-blur-md z-40">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
            <AvatarImage src={user.avatarUrl} />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Good day 👋</p>
            <h2 className="text-sm font-bold text-primary">{user.name}</h2>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/cleaner/notifications" className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm relative">
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </Link>
          <Link href="/cleaner/settings" className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
            <Settings className="w-5 h-5 text-slate-600" />
          </Link>
        </div>
      </header>

      <main className="flex-1 p-4">
        {children}
      </main>

      <CleanerBottomNav />
    </div>
  );
}
