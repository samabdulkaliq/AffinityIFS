
"use client";

import { useAuth } from "@/app/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  LogOut, 
  Bell, 
  MapPin, 
  ShieldCheck, 
  ChevronRight, 
  Sparkles,
  Clock,
  Camera,
  Globe,
  Info
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * @fileOverview Redesigned Cleaner Profile.
 * Simple, friendly, and premium focus. Removes corporate/payroll jargon.
 */

export default function CleanerSettingsPage() {
  const { user, logout } = useAuth();

  const quickStats = [
    { label: "On time", value: "98%", icon: Clock, color: "text-blue-500" },
    { label: "Photos done", value: "100%", icon: Camera, color: "text-emerald-500" },
    { label: "Safety", value: "4.9", icon: ShieldCheck, color: "text-indigo-500" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-32">
      {/* 1. Header */}
      <div className="flex flex-col items-center py-6 space-y-3">
        <div className="relative">
            <Avatar className="h-24 w-24 border-4 border-white shadow-xl relative z-10">
              <AvatarImage src={user?.avatarUrl} />
              <AvatarFallback className="bg-blue-50 text-blue-600 font-bold">{user?.name[0]}</AvatarFallback>
            </Avatar>
        </div>
        <div className="text-center space-y-1">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">{user?.name}</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: {user?.id.split('-')[1]}</p>
          <div className="pt-1">
            <Badge className="bg-emerald-50 text-emerald-600 border-none px-3 py-0.5 font-black text-[10px] uppercase">
               ✅ Active
            </Badge>
          </div>
        </div>
      </div>

      {/* 2. Quick Stats */}
      <div className="grid grid-cols-3 gap-3 px-1">
        {quickStats.map((stat, i) => (
            <div key={i} className="bg-white p-4 rounded-3xl shadow-sm border border-slate-50 flex flex-col items-center text-center space-y-1">
                <stat.icon className={cn("w-5 h-5 mb-1", stat.color)} />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{stat.label}</p>
                <p className="text-sm font-black text-slate-900">{stat.value}</p>
            </div>
        ))}
      </div>

      {/* 3. Help Section */}
      <div className="px-1">
        <Link href="/cleaner/help">
            <Card className="border-none shadow-xl bg-slate-900 text-white overflow-hidden relative group active:scale-[0.98] transition-all rounded-[2.5rem]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl" />
                <CardContent className="p-6 flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                            <span className="text-2xl">🧠</span>
                        </div>
                        <div>
                            <p className="font-black text-lg tracking-tight">Help Center</p>
                            <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Quick help during your shift</p>
                        </div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-white/30 group-hover:translate-x-1 transition-all" />
                </CardContent>
            </Card>
        </Link>
      </div>

      {/* 4. Certifications */}
      <div className="space-y-4">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Certifications</h4>
        <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden">
            <CardContent className="p-0 divide-y divide-slate-50">
                <div className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-700">WHMIS 2024</p>
                            <p className="text-[10px] text-emerald-600 font-bold uppercase">Valid</p>
                        </div>
                    </div>
                    <Badge variant="outline" className="text-[8px] font-black border-emerald-100 text-emerald-600">VALID</Badge>
                </div>
                <div className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                            <Info className="w-5 h-5" />
                        </div>
                        <p className="text-sm font-bold text-slate-700">Site Protocol</p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-[10px] font-black text-blue-600 uppercase">START</Button>
                </div>
            </CardContent>
        </Card>
      </div>

      {/* 5. Settings */}
      <div className="space-y-4">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Settings</h4>
        <Card className="border-none shadow-sm overflow-hidden rounded-[2rem] bg-white">
          <CardContent className="p-0 divide-y divide-slate-50">
              <div className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                    <Bell className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-bold text-slate-700">Notifications</p>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-blue-600" />
              </div>
              <div className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-bold text-slate-700">Location Access</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-200" />
              </div>
              <div className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                    <Globe className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-bold text-slate-700">Language</p>
                </div>
                <span className="text-[10px] font-black text-blue-600 uppercase">English</span>
              </div>
          </CardContent>
        </Card>
      </div>

      {/* 6. Logout */}
      <div className="pt-4 px-1">
        <Button onClick={logout} variant="outline" className="w-full h-16 rounded-[2rem] border-2 border-slate-100 font-black uppercase tracking-widest text-[10px] text-slate-500 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all">
          <LogOut className="w-4 h-4 mr-2" /> Log Out
        </Button>
      </div>
    </div>
  );
}
