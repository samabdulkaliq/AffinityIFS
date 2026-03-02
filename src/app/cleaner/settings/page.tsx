"use client";

import { useAuth } from "@/app/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { LogOut, User, Bell, Shield, HelpCircle, ChevronRight, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

export default function CleanerSettingsPage() {
  const { user, logout } = useAuth();

  const settingsItems = [
    { icon: User, label: "Profile Information", sub: "Phone, Email, Worker Type" },
    { icon: Bell, label: "Notifications", sub: "Shift reminders, Points alerts", toggle: true },
    { icon: Shield, label: "Privacy & Security", sub: "Location sharing, Biometrics" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col items-center py-6 space-y-3">
        <Avatar className="h-24 w-24 border-4 border-white shadow-xl">
          <AvatarImage src={user?.avatarUrl} />
          <AvatarFallback>{user?.name[0]}</AvatarFallback>
        </Avatar>
        <div className="text-center">
          <h3 className="text-xl font-bold text-primary">{user?.name}</h3>
          <p className="text-sm text-muted-foreground uppercase font-bold tracking-widest text-[10px]">{user?.workerType}</p>
        </div>
      </div>

      <div className="space-y-4">
        <Link href="/cleaner/help">
            <Card className="border-none shadow-md bg-gradient-to-r from-secondary to-blue-600 text-white overflow-hidden relative group active:scale-[0.98] transition-all">
                <div className="absolute top-0 right-0 p-2 opacity-20">
                    <Sparkles className="w-12 h-12 group-hover:scale-110 transition-transform" />
                </div>
                <CardContent className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                            <HelpCircle className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-bold">AI Support Center</p>
                            <p className="text-[10px] text-white/70 uppercase tracking-tighter">Get instant help on-site</p>
                        </div>
                    </div>
                    <ChevronRight className="w-5 h-5 opacity-50" />
                </CardContent>
            </Card>
        </Link>

        <Card className="border-none shadow-sm overflow-hidden">
          <CardContent className="p-0 divide-y">
            {settingsItems.map((item, i) => (
              <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700">{item.label}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{item.sub}</p>
                  </div>
                </div>
                {item.toggle && <Switch defaultChecked />}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="pt-4">
        <Button onClick={logout} variant="destructive" className="w-full h-14 rounded-2xl font-bold shadow-lg shadow-red-500/20">
          <LogOut className="w-5 h-5 mr-2" /> Sign Out
        </Button>
      </div>
    </div>
  );
}
