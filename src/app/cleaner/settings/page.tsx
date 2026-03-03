"use client";

import { useAuth } from "@/app/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  LogOut, 
  User, 
  Bell, 
  Shield, 
  HelpCircle, 
  ChevronRight, 
  Sparkles,
  ShieldCheck,
  Zap,
  Clock,
  MapPin,
  ClipboardCheck,
  Info
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

/**
 * @fileOverview Production-ready Operational ID & Settings.
 * Focuses on worker compliance, certifications, and operational stats.
 */

export default function CleanerSettingsPage() {
  const { user, logout } = useAuth();

  const complianceStats = [
    { label: "Punctuality", value: "98%", icon: Clock, color: "text-blue-500" },
    { label: "Documentation", value: "100%", icon: ClipboardCheck, color: "text-emerald-500" },
    { label: "Safety Score", value: "4.9", icon: ShieldCheck, color: "text-indigo-500" },
  ];

  const settingsItems = [
    { icon: User, label: "Employment Details", sub: "Contract, Pay Cycle, Tax ID" },
    { icon: Bell, label: "Operational Alerts", sub: "Geofence confirmations, Shift triggers", toggle: true },
    { icon: Shield, label: "Security & Biometrics", sub: "Location consent, FaceID login" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-32">
      {/* Executive Profile Header */}
      <div className="flex flex-col items-center py-8 space-y-4">
        <div className="relative">
            <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-2xl scale-150 animate-pulse" />
            <Avatar className="h-28 w-28 border-4 border-white shadow-2xl relative z-10">
              <AvatarImage src={user?.avatarUrl} />
              <AvatarFallback>{user?.name[0]}</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white w-10 h-10 rounded-full border-4 border-white flex items-center justify-center shadow-lg z-20">
                <ShieldCheck className="w-5 h-5" />
            </div>
        </div>
        <div className="text-center space-y-1">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">{user?.name}</h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">ID: AFF-{user?.id.split('-')[1]}</p>
          <div className="pt-2">
            <Badge className="bg-blue-50 text-blue-600 border-none px-4 py-1 font-black text-[9px] tracking-widest uppercase">
                {user?.workerType} OPERATION
            </Badge>
          </div>
        </div>
      </div>

      {/* Operational Stats Grid */}
      <div className="grid grid-cols-3 gap-3 px-1">
        {complianceStats.map((stat, i) => (
            <div key={i} className="bg-white p-4 rounded-3xl shadow-sm border border-slate-50 flex flex-col items-center text-center space-y-2">
                <stat.icon className={cn("w-5 h-5", stat.color)} />
                <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">{stat.label}</p>
                    <p className="text-sm font-black text-slate-900">{stat.value}</p>
                </div>
            </div>
        ))}
      </div>

      {/* Support Center Callout */}
      <div className="px-1">
        <Link href="/cleaner/help">
            <Card className="border-none shadow-xl bg-slate-900 text-white overflow-hidden relative group active:scale-[0.98] transition-all rounded-[2.5rem]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl" />
                <CardContent className="p-6 flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/5">
                            <Sparkles className="w-7 h-7 text-blue-400" />
                        </div>
                        <div>
                            <p className="font-black text-lg tracking-tight">AI Support Center</p>
                            <p className="text-[10px] text-white/50 font-black uppercase tracking-widest">Instant Field Guidance</p>
                        </div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-white/30 group-hover:translate-x-1 transition-all" />
                </CardContent>
            </Card>
        </Link>
      </div>

      {/* Compliance / Certification Status */}
      <div className="space-y-4">
        <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest px-2 flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-500" />
            Certifications
        </h4>
        <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden">
            <CardContent className="p-0 divide-y divide-slate-50">
                <div className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-black text-slate-700">WHMIS 2024</p>
                            <p className="text-[10px] text-emerald-600 font-bold uppercase">Certified & Current</p>
                        </div>
                    </div>
                    <Badge variant="outline" className="text-[8px] font-black border-emerald-100 text-emerald-600">VALID</Badge>
                </div>
                <div className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-black text-slate-700">Site Protocol V2</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Required for Crystal Plaza</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-[10px] font-black text-blue-600 uppercase">START</Button>
                </div>
            </CardContent>
        </Card>
      </div>

      {/* System Settings */}
      <div className="space-y-4">
        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">System Config</h4>
        <Card className="border-none shadow-sm overflow-hidden rounded-[2rem] bg-white">
          <CardContent className="p-0 divide-y divide-slate-50">
            {settingsItems.map((item, i) => (
              <div key={i} className="p-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-700 leading-none">{item.label}</p>
                    <p className="text-[10px] text-slate-400 font-bold mt-1 tracking-tighter uppercase">{item.sub}</p>
                  </div>
                </div>
                {item.toggle && <Switch defaultChecked className="data-[state=checked]:bg-blue-600" />}
                {!item.toggle && <ChevronRight className="w-4 h-4 text-slate-200" />}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="pt-6 px-1">
        <Button onClick={logout} variant="destructive" className="w-full h-16 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-red-200 transition-all active:scale-95">
          <LogOut className="w-5 h-5 mr-3" /> Decommission Device
        </Button>
      </div>
    </div>
  );
}

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
