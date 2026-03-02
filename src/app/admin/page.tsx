"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { repository } from "../lib/repository";
import { Users, Clock, AlertCircle, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboard() {
  const pendingRequests = repository.getReviewRequests().filter(r => r.status === 'PENDING');
  const totalCleaners = repository.users.filter(u => u.role === 'CLEANER').length;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
            <Users className="w-6 h-6 text-secondary mb-2" />
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Staff</p>
            <p className="text-2xl font-bold">{totalCleaners}</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
            <Clock className="w-6 h-6 text-blue-500 mb-2" />
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Active Shifts</p>
            <p className="text-2xl font-bold">12</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-lg">Needs Attention ⚠️</h3>
          <Link href="/admin/approvals" className="text-xs font-semibold text-secondary">Manage All</Link>
        </div>

        {pendingRequests.length > 0 ? (
          <div className="space-y-3">
            {pendingRequests.map(req => (
              <Link key={req.id} href={`/admin/approvals/${req.id}`}>
                <Card className="border-none shadow-sm hover:shadow-md transition-all active:scale-[0.98]">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">{req.cleanerName}</p>
                        <p className="text-xs text-muted-foreground">{req.reason}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="border-none bg-slate-100/50 border-dashed border-2 border-slate-200">
            <CardContent className="p-12 text-center text-muted-foreground italic text-sm">
              All caught up! No pending requests. ✨
            </CardContent>
          </Card>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-lg">Platform Health</h3>
        <Card className="border-none shadow-sm bg-primary text-white p-1">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-secondary" />
                </div>
                <div>
                    <p className="text-sm font-bold">Punctuality Score</p>
                    <p className="text-[10px] text-white/60">94.2% company average</p>
                </div>
            </div>
            <Badge variant="secondary" className="bg-secondary text-white font-bold">+2.4%</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
