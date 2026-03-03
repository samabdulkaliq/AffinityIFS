"use client";

import { useAuth } from "@/app/lib/store";
import { repository } from "@/app/lib/repository";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  Clock, 
  Zap, 
  Shield, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight, 
  Inbox,
  CalendarDays,
  ShieldCheck,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

/**
 * @fileOverview Operational Intelligence Inbox.
 * High-fidelity notification system for field alerts and compliance updates.
 */

export default function CleanerNotificationsPage() {
  const { user } = useAuth();
  const notifications = repository.getNotificationsForUser(user?.id || "")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'TIME': return { icon: Clock, bg: "bg-blue-50 text-blue-600", border: "border-blue-100", label: "Operations" };
      case 'REWARDS': return { icon: Zap, bg: "bg-amber-50 text-amber-600", border: "border-amber-100", label: "Milestones" };
      case 'APPROVALS': return { icon: CheckCircle2, bg: "bg-emerald-50 text-emerald-600", border: "border-emerald-100", label: "Payroll" };
      case 'REMINDERS': return { icon: ShieldCheck, bg: "bg-indigo-50 text-indigo-600", border: "border-indigo-100", label: "Compliance" };
      default: return { icon: Bell, bg: "bg-slate-50 text-slate-600", border: "border-slate-100", label: "Update" };
    }
  };

  const formatRelativeTime = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffInMins = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffInMins < 1) return 'Just now';
    if (diffInMins < 60) return `${diffInMins}m ago`;
    if (diffInMins < 1440) return `${Math.floor(diffInMins / 60)}h ago`;
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-8 pb-32 animate-in fade-in duration-700">
      <div className="px-2 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Intelligence</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Operational Pulse</p>
        </div>
        <div className="flex gap-2">
            <Badge variant="outline" className="border-slate-200 text-slate-400 font-black text-[9px] uppercase tracking-widest px-3">
                {notifications.filter(n => !n.read).length} NEW
            </Badge>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.length > 0 ? (
          notifications.map((notif, index) => {
            const style = getCategoryStyles(notif.category);
            const Icon = style.icon;

            return (
              <motion.div
                key={notif.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={cn(
                  "border-none shadow-sm overflow-hidden transition-all active:scale-[0.98] group rounded-[1.5rem]",
                  !notif.read ? "bg-white" : "bg-slate-50/50 opacity-80"
                )}>
                  <CardContent className="p-5 flex gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-transform group-hover:scale-110 shadow-sm",
                      style.bg,
                      style.border
                    )}>
                      <Icon className="w-6 h-6" />
                    </div>
                    
                    <div className="flex-1 space-y-1.5 min-w-0">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                            {!notif.read && <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse shrink-0" />}
                            <h4 className="text-sm font-black text-slate-900 leading-tight truncate pr-4">{notif.title}</h4>
                        </div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter whitespace-nowrap">
                            {formatRelativeTime(notif.createdAt)}
                        </span>
                      </div>
                      
                      <p className="text-xs text-slate-500 font-medium leading-relaxed pr-2">
                        {notif.body}
                      </p>

                      <div className="flex items-center gap-3 pt-1">
                        <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em]">{style.label}</span>
                        <ChevronRight className="w-3 h-3 text-slate-200 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        ) : (
          <div className="py-24 text-center space-y-4">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto border border-slate-100">
              <Inbox className="w-10 h-10 text-slate-200" />
            </div>
            <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Everything Clear</p>
          </div>
        )}
      </div>

      {notifications.length > 0 && (
        <div className="text-center pt-4">
            <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors">
                Archive All Read
            </button>
        </div>
      )}
    </div>
  );
}
