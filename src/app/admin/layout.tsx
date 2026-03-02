"use client";

import { useAuth } from "../lib/store";
import { Bell, LayoutDashboard, Users, Map, CheckCircle2, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { PlaceHolderImages } from "../lib/placeholder-images";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const logo = PlaceHolderImages.find(img => img.id === 'brand-logo');

  if (!user || user.role !== 'ADMIN') return null;

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
    { label: "Approvals", icon: CheckCircle2, href: "/admin/approvals" },
    { label: "Users", icon: Users, href: "/admin/users" },
    { label: "Sites", icon: Map, href: "/admin/sites" },
    { label: "Settings", icon: Settings, href: "/admin/settings" },
  ];

  return (
    <div className="flex flex-col flex-1 pb-16 bg-slate-50">
      <header className="bg-primary text-white p-6 rounded-b-[2rem] shadow-lg shadow-primary/20">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center overflow-hidden">
              {logo && (
                <Image 
                  src={logo.imageUrl} 
                  alt="Affinity Logo" 
                  width={40} 
                  height={40} 
                  className="object-cover"
                  data-ai-hint={logo.imageHint}
                />
              )}
            </div>
            <div>
              <h1 className="text-lg font-bold">Admin Console</h1>
              <p className="text-[10px] text-white/60 font-medium uppercase tracking-widest">Affinity Control</p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full border border-primary"></span>
          </div>
        </div>

        <nav className="flex justify-between px-2">
            {navItems.map(item => {
                const isActive = pathname === item.href;
                return (
                    <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 group">
                        <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                            isActive ? "bg-white text-primary" : "text-white/60 hover:bg-white/10"
                        )}>
                            <item.icon className="w-5 h-5" />
                        </div>
                        <span className={cn("text-[8px] font-bold uppercase tracking-widest", isActive ? "text-white" : "text-white/40")}>
                            {item.label}
                        </span>
                    </Link>
                );
            })}
        </nav>
      </header>

      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
