
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { repository } from "../lib/repository";
import { 
  Users, 
  Clock, 
  Calendar, 
  MessageSquare, 
  History, 
  ChevronRight, 
  Users2, 
  Sun, 
  Activity as ActivityIcon,
  Shield,
  Camera,
  AlertTriangle
} from "lucide-react";
import Link from "next/link";
import { 
  Area, 
  AreaChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip 
} from "recharts";
import { Badge } from "@/components/ui/badge";

const activityData = [
  { date: "Feb 23", count: 85 },
  { date: "Feb 24", count: 88 },
  { date: "Feb 25", count: 92 },
  { date: "Feb 26", count: 95 },
  { date: "Feb 27", count: 98 },
];

export default function AdminDashboard() {
  const pendingRequests = repository.getReviewRequests().filter(r => r.status === 'PENDING');
  
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="px-1 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Ops Center</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Operational Summary</p>
        </div>
        <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 font-black px-3 py-1">
          LIVE: 14 STAFF
        </Badge>
      </div>

      {/* Section 14: Operational Summary Chart */}
      <Card className="border-none bg-slate-900 shadow-xl overflow-hidden rounded-[2rem]">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">Attendance Efficiency</p>
              <h3 className="text-white text-3xl font-black">98.2%</h3>
            </div>
            <div className="bg-blue-500/10 p-2 rounded-xl">
              <Shield className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorCount)" 
                />
                <XAxis dataKey="date" hide />
                <YAxis hide domain={[80, 100]} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Exceptions & Alerts - PRD 4.2 & 14 */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-none bg-white shadow-sm rounded-2xl p-4 flex flex-col gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase">Late / No-Shows</p>
          <p className="text-xl font-black text-slate-900">02 <span className="text-[10px] text-red-500 font-bold">ALERTS</span></p>
        </Card>
        <Card className="border-none bg-white shadow-sm rounded-2xl p-4 flex flex-col gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
            <Camera className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase">Unverified Sites</p>
          <p className="text-xl font-black text-slate-900">01 <span className="text-[10px] text-blue-500 font-bold">PENDING</span></p>
        </Card>
      </div>

      {/* Strategic Navigation */}
      <div className="space-y-3">
        <Link href="/admin/approvals" className="block group">
          <Card className="border-none shadow-sm hover:shadow-md transition-all active:scale-[0.99] rounded-2xl">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                  <Sun className="w-5 h-5 text-purple-500" />
                </div>
                <span className="text-base font-black text-slate-700">Audit Exceptions</span>
              </div>
              <div className="flex items-center gap-2">
                {pendingRequests.length > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                    {pendingRequests.length}
                  </span>
                )}
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-purple-500 transition-colors" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/assets" className="block group">
          <Card className="border-none shadow-sm hover:shadow-md transition-all active:scale-[0.99] rounded-2xl">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                  <Package className="w-5 h-5 text-orange-500" />
                </div>
                <span className="text-base font-black text-slate-700">Inventory & Supply</span>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-orange-500 transition-colors" />
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Quick Ops Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-black text-slate-900 px-1">Job Execution</h3>
        <div className="grid grid-cols-3 gap-3">
          <Link href="/admin/chat" className="block">
            <Card className="border-none bg-blue-50 hover:bg-blue-100 transition-colors rounded-[1.5rem] aspect-square flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                <MessageSquare className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-[10px] font-black text-slate-600 uppercase">Comms</span>
            </Card>
          </Link>

          <Link href="/admin/approvals" className="block">
            <Card className="border-none bg-indigo-50 hover:bg-indigo-100 transition-colors rounded-[1.5rem] aspect-square flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                <Shield className="w-6 h-6 text-indigo-400" />
              </div>
              <span className="text-[10px] font-black text-slate-600 uppercase">Compliance</span>
            </Card>
          </Link>

          <Link href="/admin/settings" className="block">
            <Card className="border-none bg-purple-50 hover:bg-purple-100 transition-colors rounded-[1.5rem] aspect-square flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                <ActivityIcon className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-[10px] font-black text-slate-600 uppercase">Health</span>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
