
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Clock, Calendar, Wallet, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function CleanerBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", icon: Home, href: "/cleaner" },
    { label: "Duty", icon: Clock, href: "/cleaner/clock" },
    { label: "Cycle", icon: Calendar, href: "/cleaner/shifts" },
    { label: "Vault", icon: Wallet, href: "/cleaner/wallet" },
    { label: "Arena", icon: Trophy, href: "/cleaner/leaderboard" },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-[440px] h-20 glass rounded-[2.5rem] flex justify-around items-center px-6 safe-area-bottom z-50 border border-white/10">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href === '/cleaner' && pathname.startsWith('/cleaner/notifications'));
        return (
          <Link key={item.href} href={item.href} className="flex flex-col items-center justify-center flex-1 relative group">
            <div className={cn(
                "relative z-10 transition-all duration-300",
                isActive ? "-translate-y-1 scale-110" : "group-hover:scale-110"
            )}>
                <item.icon className={cn(
                    "w-6 h-6 transition-colors", 
                    isActive ? "text-primary" : "text-muted-foreground/60"
                )} />
            </div>
            
            <span className={cn(
                "text-[9px] mt-1.5 font-black uppercase tracking-widest transition-all duration-300", 
                isActive ? "opacity-100 text-primary" : "opacity-0 text-muted-foreground"
            )}>
              {item.label}
            </span>

            {isActive && (
                <motion.div 
                    layoutId="nav-indicator"
                    className="absolute -top-3 w-8 h-1 bg-primary rounded-full shadow-[0_0_15px_rgba(59,130,246,0.8)]"
                />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
