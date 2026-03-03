"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Clock, Calendar, Trophy, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function CleanerBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", icon: Home, href: "/cleaner" },
    { label: "Duty", icon: Clock, href: "/cleaner/clock" },
    { label: "Shifts", icon: Calendar, href: "/cleaner/shifts" },
    { label: "Rewards", icon: Trophy, href: "/cleaner/wallet" },
    { label: "Work Log", icon: Camera, href: "/cleaner/log" },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-[440px] h-20 glass-nav rounded-[2.5rem] flex justify-around items-center px-6 safe-area-bottom z-50 shadow-[0_20px_50px_rgba(58,111,247,0.15)]">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href === '/cleaner' && pathname.startsWith('/cleaner/notifications')) || (item.href === '/cleaner/shifts' && pathname.startsWith('/cleaner/shifts/'));
        return (
          <Link key={item.href} href={item.href} className="flex flex-col items-center justify-center flex-1 relative group py-2">
            <div className={cn(
                "relative z-10 transition-all duration-300",
                isActive ? "-translate-y-1 scale-125" : "group-hover:scale-110"
            )}>
                <item.icon className={cn(
                    "w-5 h-5 transition-colors", 
                    isActive ? "text-primary stroke-[2.5px]" : "text-slate-400"
                )} />
            </div>
            
            <span className={cn(
                "text-[8px] mt-1.5 font-black uppercase tracking-widest transition-all duration-300", 
                isActive ? "opacity-100 text-primary translate-y-0" : "opacity-0 text-slate-400 translate-y-1"
            )}>
              {item.label}
            </span>

            {isActive && (
                <motion.div 
                    layoutId="nav-indicator"
                    className="absolute bottom-1 w-1 h-1 bg-primary rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
