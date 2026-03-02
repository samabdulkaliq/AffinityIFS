"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Clock, Calendar, Wallet, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

export function CleanerBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", icon: Home, href: "/cleaner" },
    { label: "Clock", icon: Clock, href: "/cleaner/clock" },
    { label: "Shifts", icon: Calendar, href: "/cleaner/shifts" },
    { label: "Wallet", icon: Wallet, href: "/cleaner/wallet" },
    { label: "Leaders", icon: Trophy, href: "/cleaner/leaderboard" },
  ];

  return (
    <nav className="fixed bottom-0 w-full max-w-[480px] bg-white border-t flex justify-around items-center py-2 px-4 h-16 safe-area-bottom z-50">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href === '/cleaner' && pathname.startsWith('/cleaner/notifications'));
        return (
          <Link key={item.href} href={item.href} className="flex flex-col items-center justify-center flex-1">
            <item.icon className={cn("w-6 h-6 transition-colors", isActive ? "text-secondary" : "text-slate-400")} />
            <span className={cn("text-[10px] mt-1 font-medium", isActive ? "text-secondary" : "text-slate-400")}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
