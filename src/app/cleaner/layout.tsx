
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../lib/store";
import { CleanerBottomNav } from "../components/cleaner/bottom-nav";
import { Bell, User } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { OnboardingWizard } from "../components/cleaner/onboarding-wizard";

export default function CleanerLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("affinity_onboarding_seen");
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem("affinity_onboarding_seen", "true");
    setShowOnboarding(false);
  };

  if (!user || user.role !== 'CLEANER') return null;

  const isNotifications = pathname === "/cleaner/notifications";
  const isSettings = pathname === "/cleaner/settings";

  return (
    <div className="flex flex-col flex-1 pb-32">
      {showOnboarding && <OnboardingWizard onComplete={handleOnboardingComplete} />}
      
      <header className="flex justify-between items-center p-6 sticky top-0 bg-transparent z-40">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12 border-2 border-white shadow-xl ring-2 ring-slate-100 transition-transform active:scale-90">
            <AvatarImage src={user.avatarUrl} />
            <AvatarFallback className="bg-slate-100 text-slate-400">{user.name[0]}</AvatarFallback>
          </Avatar>
          <div className="space-y-0.5">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Affinity Integrated</p>
            <h2 className="text-lg font-black text-slate-900 leading-none">{user.name.split(' ')[0]}</h2>
          </div>
        </div>
        <div className="flex gap-3">
          <Link 
            href="/cleaner/notifications" 
            className={cn(
              "w-11 h-11 rounded-full flex items-center justify-center relative transition-all active:scale-95 bg-white shadow-[0_6px_12px_rgba(15,23,42,0.15)] border border-slate-50",
              isNotifications ? "text-[#2563EB]" : "text-[#334155]"
            )}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-3 h-3 bg-[#EF4444] rounded-full border-2 border-white shadow-sm animate-pulse"></span>
          </Link>
          <Link 
            href="/cleaner/settings" 
            className={cn(
              "w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-95 bg-white shadow-[0_6px_12px_rgba(15,23,42,0.15)] border border-slate-50",
              isSettings ? "text-[#2563EB]" : "text-[#334155]"
            )}
          >
            <User className="w-5 h-5" />
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
