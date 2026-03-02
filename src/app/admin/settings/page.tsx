"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/app/lib/store";
import { Button } from "@/components/ui/button";
import { LogOut, Database, User, Bell, Shield } from "lucide-react";

export default function AdminSettings() {
  const { user, logout, isMockMode, setMockMode } = useAuth();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Card className="border-none shadow-sm">
        <CardContent className="p-6 flex items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-sm">
                <img src={user?.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div>
                <h3 className="text-xl font-bold">{user?.name}</h3>
                <p className="text-sm text-muted-foreground">System Administrator</p>
            </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground px-1">System Control</h4>
        <Card className="border-none shadow-sm">
            <CardContent className="p-0 divide-y">
                <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                        <Database className="w-5 h-5 text-secondary" />
                        <div>
                            <p className="text-sm font-bold">Mock Demo Mode</p>
                            <p className="text-xs text-muted-foreground">Use local seeded data</p>
                        </div>
                    </div>
                    <Switch checked={isMockMode} onCheckedChange={setMockMode} />
                </div>
                <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5 text-slate-400" />
                        <p className="text-sm font-bold">In-App Notifications</p>
                    </div>
                    <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-slate-400" />
                        <p className="text-sm font-bold">Biometric Security</p>
                    </div>
                    <Switch />
                </div>
            </CardContent>
        </Card>
      </div>

      <div className="pt-4">
        <Button onClick={logout} variant="destructive" className="w-full h-14 rounded-2xl shadow-lg shadow-red-500/20 font-bold">
            <LogOut className="w-5 h-5 mr-2" /> Log Out Demo
        </Button>
      </div>
    </div>
  );
}
