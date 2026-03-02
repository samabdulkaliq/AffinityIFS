
"use client";

import { useAuth } from "@/app/lib/store";
import { repository } from "@/app/lib/repository";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Clock, Zap, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CleanerNotificationsPage() {
  const { user } = useAuth();
  const notifications = repository.notifications.filter(n => n.userId === user?.id || n.userId === 'all');

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex justify-between items-center px-2">
        <h2 className="text-2xl font-bold text-primary uppercase tracking-tighter">Inbox</h2>
        <Badge variant="secondary" className="bg-secondary text-white">New</Badge>
      </div>

      <div className="space-y-3">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <Card key={notif.id} className={cn(
              "border-none shadow-sm overflow-hidden transition-all active:scale-[0.98]",
              !notif.read ? "bg-white border-l-4 border-secondary" : "bg-slate-50/50 opacity-60"
            )}>
              <CardContent className="p-4 flex gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                  notif.category === 'TIME' ? "bg-blue-100 text-blue-600" :
                  notif.category === 'REWARDS' ? "bg-yellow-100 text-yellow-600" :
                  "bg-slate-100 text-slate-600"
                )}>
                  {notif.category === 'TIME' ? <Clock className="w-5 h-5" /> :
                   notif.category === 'REWARDS' ? <Zap className="w-5 h-5" /> :
                   <MessageSquare className="w-5 h-5" />}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-bold text-primary">{notif.title}</p>
                    <span className="text-[8px] font-bold text-slate-400 uppercase">{new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{notif.body}</p>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-20 text-muted-foreground italic">
            <Bell className="w-12 h-12 mx-auto mb-4 opacity-10" />
            No new notifications
          </div>
        )}
      </div>
    </div>
  );
}
