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
  Activity as ActivityIcon 
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

const activityData = [
  { date: "Feb 23", count: 0 },
  { date: "Feb 24", count: 0 },
  { date: "Feb 25", count: 1 },
  { date: "Feb 26", count: 1 },
  { date: "Feb 27", count: 0 },
];

export default function AdminDashboard() {
  const pendingRequests = repository.getReviewRequests().filter(r => r.status === 'PENDING');
  
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="px-1">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin</h1>
      </div>

      {/* Users Activity Chart Card */}
      <Card className="border-none bg-gradient-to-b from-blue-500 to-blue-600 shadow-xl shadow-blue-200 overflow-hidden rounded-[2rem]">
        <CardContent className="p-6">
          <p className="text-white/80 text-sm font-medium mb-4">Users Activity</p>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="white" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="white" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="white" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorCount)" 
                  dot={{ fill: 'white', r: 4, strokeWidth: 2 }}
                />
                <XAxis 
                  dataKey="date" 
                  hide 
                />
                <YAxis hide domain={[0, 2]} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between mt-2 px-1">
            {activityData.map((d) => (
              <span key={d.date} className="text-white/60 text-[10px] font-bold uppercase tracking-tighter">
                {d.date}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* List Navigation */}
      <div className="space-y-3">
        <Link href="/admin/users" className="block group">
          <Card className="border-none shadow-sm hover:shadow-md transition-all active:scale-[0.99] rounded-2xl">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Users2 className="w-5 h-5 text-blue-500" />
                </div>
                <span className="text-base font-semibold text-slate-700">Users & admins</span>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/approvals" className="block group">
          <Card className="border-none shadow-sm hover:shadow-md transition-all active:scale-[0.99] rounded-2xl">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                  <Sun className="w-5 h-5 text-purple-500" />
                </div>
                <span className="text-base font-semibold text-slate-700">Manage time off</span>
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

        <Link href="/admin/approvals" className="block group">
          <Card className="border-none shadow-sm hover:shadow-md transition-all active:scale-[0.99] rounded-2xl">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                  <ActivityIcon className="w-5 h-5 text-green-500" />
                </div>
                <span className="text-base font-semibold text-slate-700">Activity</span>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-green-500 transition-colors" />
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Quick Access Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-black text-slate-900 px-1">Quick access</h3>
        <div className="grid grid-cols-3 gap-3">
          <Link href="/admin/sites" className="block">
            <Card className="border-none bg-orange-50 hover:bg-orange-100 transition-colors rounded-[1.5rem] aspect-square flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                <Calendar className="w-6 h-6 text-orange-400" />
              </div>
              <span className="text-xs font-bold text-slate-600">Schedule</span>
            </Card>
          </Link>

          <Link href="/admin/approvals" className="block">
            <Card className="border-none bg-indigo-50 hover:bg-indigo-100 transition-colors rounded-[1.5rem] aspect-square flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                <Clock className="w-6 h-6 text-indigo-400" />
              </div>
              <span className="text-xs font-bold text-slate-600">Time Clock</span>
            </Card>
          </Link>

          <Link href="/admin/settings" className="block">
            <Card className="border-none bg-purple-50 hover:bg-purple-100 transition-colors rounded-[1.5rem] aspect-square flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                <MessageSquare className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-xs font-bold text-slate-600 text-center">New update</span>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}