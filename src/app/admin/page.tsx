"use client";

import { Card, CardContent } from "@/components/ui/card";
import { repository } from "../lib/repository";
import { 
  Shield, 
  AlertTriangle, 
  Camera, 
  Sun, 
  Package, 
  MessageSquare, 
  Activity as ActivityIcon, 
  ChevronRight, 
  MapPin
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
  { date: "06:00", count: 88 },
  { date: "07:00", count: 92 },
  { date: "08:00", count: 98 },
  { date: "09:00", count: 95 },
  { date: "10:00", count: 97 },
];

export default function AdminDashboard() {
  const pendingRequests = repository.getReviewRequests().filter(r => r.status === 'PENDING');
  
  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-24">
      <div className="flex justify-between items-end px-1">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Ops Center</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Live Operational Summary</p>
        </div>
        <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 font-black">14 STAFF LIVE</Badge>
      </div>

      {/* Attendance Chart - PRD 14.0 */}
      <Card className="border-none bg-slate-900 shadow-2xl rounded-[2.5rem] overflow-hidden">
        <CardContent className="p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
                <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">Compliance Index</p>
                <h3 className="text-white text-4xl font-black mt-1">98.4%</h3>
            </div>
            <div className="bg-blue-500/10 p-3 rounded-2xl border border-blue-500/20">
                <Shield className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={4} fill="url(#chartGradient)" />
                <XAxis dataKey="date" hide />
                <YAxis hide domain={[80, 100]} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Critical Exceptions - PRD 4.3 */}
      <div className="grid grid-cols-2 gap-4 px-1">
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-50 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">No-Shows</p>
                <p className="text-2xl font-black text-slate-900">02 <span className="text-[10px] text-red-500 font-bold ml-1">ALERT</span></p>
            </div>
        </div>
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-50 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Camera className="w-5 h-5 text-blue-500" />
            </div>
            <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Unverified</p>
                <p className="text-2xl font-black text-slate-900">01 <span className="text-[10px] text-blue-500 font-bold ml-1">LOGS</span></p>
            </div>
        </div>
      </div>

      {/* Quick Ops Access */}
      <div className="space-y-4">
        <h3 className="text-xl font-black text-slate-900 px-1">Management Flow</h3>
        <div className="space-y-3">
            <Link href="/admin/approvals">
                <Card className="border-none shadow-sm hover:shadow-md transition-all rounded-3xl bg-white overflow-hidden group">
                    <CardContent className="p-5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                                <Sun className="w-6 h-6 text-purple-500" />
                            </div>
                            <div>
                                <h4 className="font-black text-slate-900 uppercase text-xs tracking-tight">Audit Exceptions</h4>
                                <p className="text-[10px] font-bold text-slate-400">Payroll & Compliance Gates</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {pendingRequests.length > 0 && (
                                <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{pendingRequests.length}</span>
                            )}
                            <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-purple-500" />
                        </div>
                    </CardContent>
                </Card>
            </Link>

            <Link href="/admin/assets">
                <Card className="border-none shadow-sm hover:shadow-md transition-all rounded-3xl bg-white overflow-hidden group">
                    <CardContent className="p-5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                                <Package className="w-6 h-6 text-orange-500" />
                            </div>
                            <div>
                                <h4 className="font-black text-slate-900 uppercase text-xs tracking-tight">Supply & Inventory</h4>
                                <p className="text-[10px] font-bold text-slate-400">Site-Specific Stock Management</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-orange-500" />
                    </CardContent>
                </Card>
            </Link>
        </div>
      </div>

      {/* Site Intelligence */}
      <div className="space-y-4 px-1">
        <h3 className="text-xl font-black text-slate-900">Site Intelligence</h3>
        <div className="grid grid-cols-3 gap-3">
            <Link href="/admin/chat" className="bg-blue-50 p-4 rounded-3xl flex flex-col items-center gap-3 text-center active:scale-95 transition-all">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm"><MessageSquare className="w-5 h-5 text-blue-500" /></div>
                <span className="text-[9px] font-black text-blue-700 uppercase">Field Comms</span>
            </Link>
            <div className="bg-indigo-50 p-4 rounded-3xl flex flex-col items-center gap-3 text-center">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm"><ActivityIcon className="w-5 h-5 text-indigo-500" /></div>
                <span className="text-[9px] font-black text-indigo-700 uppercase">Site Pulse</span>
            </div>
            <div className="bg-slate-100 p-4 rounded-3xl flex flex-col items-center gap-3 text-center">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm"><MapPin className="w-5 h-5 text-slate-400" /></div>
                <span className="text-[9px] font-black text-slate-500 uppercase">Geofencing</span>
            </div>
        </div>
      </div>
    </div>
  );
}