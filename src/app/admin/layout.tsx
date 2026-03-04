
"use client";

import { useAuth } from "../lib/store";
import { 
  Bell, 
  LayoutDashboard, 
  Users, 
  Map, 
  CheckCircle2, 
  Settings, 
  LayoutGrid, 
  MessageSquare, 
  User as UserIcon,
  Crown
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();

  if (!user || user.role !== 'ADMIN') return null;

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
    { label: "Staff", icon: Users, href: "/admin/workers" },
    { label: "Supplies", icon: LayoutGrid, href: "/admin/assets" },
    { label: "Chat", icon: MessageSquare, href: "/admin/chat" },
    { label: "Settings", icon: Settings, href: "/admin/settings" },
  ];

  return (
    <div className="flex flex-col flex-1 pb-16 bg-slate-50/50">
      <header className="flex justify-between items-center p-6 bg-transparent">
        <div className="text-xs font-bold text-slate-400 tracking-widest uppercase">
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full border-2 border-slate-300"></div>
          <div className="w-4 h-4 rotate-45 border-t-2 border-r-2 border-slate-300"></div>
          <div className="bg-slate-300 text-[8px] font-black px-1 rounded text-white">48</div>
        </div>
      </header>

      <main className="flex-1 p-6">
        {children}
      </main>

      {/* Premium Bottom Nav */}
      <nav className="fixed bottom-0 w-full max-w-[480px] bg-white/80 backdrop-blur-xl border-t border-slate-100 flex justify-around items-center py-3 px-4 h-20 safe-area-bottom z-50">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.label} href={item.href} className="flex flex-col items-center justify-center flex-1 gap-1 group">
              <item.icon className={cn(
                "w-6 h-6 transition-all", 
                isActive ? "text-blue-500 scale-110" : "text-slate-400 group-hover:text-slate-600"
              )} />
              <span className={cn(
                "text-[10px] font-bold transition-colors", 
                isActive ? "text-blue-500" : "text-slate-400"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
