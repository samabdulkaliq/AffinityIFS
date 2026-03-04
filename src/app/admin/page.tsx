
"use client";

import { useMemo } from "react";
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
  MapPin,
  Users,
  CheckCircle2,
  Zap,
  ClipboardCheck,
  Building
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function AdminDashboard() {
  const pendingRequests = repository.getReviewRequests().filter(r => r.status === 'PENDING');
  const expiredCerts = repository.getWorkersWithExpiredCerts();
  const allShifts = repository.shifts;
  const activeShifts = allShifts.filter(s => s.status === 'IN_PROGRESS');

  // Calculate Operational Metrics
  const metrics = useMemo(() => {
    const activeStaffCount = new Set(activeShifts.map(s => s.userId)).size;
    const activeSitesCount = new Set(activeShifts.map(s => s.siteId)).size;
    
    let totalTasks = 0;
    let completedTasks = 0;
    let totalPhotosReq = 0;
    let totalPhotosUp = 0;

    activeShifts.forEach(s => {
      totalTasks += s.tasks?.length || 0;
      completedTasks += s.tasks?.filter(t => t.completed).length || 0;
      totalPhotosReq += s.photosRequired || 0;
      totalPhotosUp += s.photosUploaded || 0;
    });

    const taskProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const photoProgress = totalPhotosReq > 0 ? Math.round((totalPhotosUp / totalPhotosReq) * 100) : 0;

    return {
      activeStaffCount,
      activeSitesCount,
      taskProgress,
      photoProgress
    };
  }, [activeShifts]);
  
  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-24">
      <div className="flex justify-between items-end px-1">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Operations Dashboard</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Live Operational Summary</p>
        </div>
        <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 font-black">
          {metrics.activeStaffCount} STAFF LIVE
        </Badge>
      </div>

      {/* Staff Certification Alert */}
      {expiredCerts.length > 0 && (
        <Link href="/admin/workers?filter=EXPIRED">
          <Card className="border-none bg-red-600 text-white shadow-xl shadow-red-200 rounded-3xl overflow-hidden group active:scale-[0.98] transition-all">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-white/70 uppercase tracking-widest">Certification Alert</p>
                  <p className="text-lg font-black">{expiredCerts.length} staff have expired certifications</p>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-white/50 group-hover:translate-x-1 transition-all" />
            </CardContent>
          </Card>
        </Link>
      )}

      {/* Operations Overview Panel */}
      <Card className="border-none bg-slate-900 shadow-2xl rounded-[2.5rem] overflow-hidden">
        <CardContent className="p-8 space-y-8">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">Operations Overview</p>
              <h3 className="text-white text-2xl font-black mt-1">Field Summary</h3>
            </div>
            <div className="bg-blue-500/20 p-3 rounded-2xl border border-blue-500/30">
              <Zap className="w-5 h-5 text-blue-400 fill-blue-400/20" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-white/40 mb-1">
                  <Users className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-black uppercase tracking-widest">Live Staff</span>
                </div>
                <p className="text-3xl font-black text-white">{metrics.activeStaffCount}</p>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-white/40 mb-1">
                  <Building className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-black uppercase tracking-widest">Active Sites</span>
                </div>
                <p className="text-3xl font-black text-white">{metrics.activeSitesCount}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-end text-white/40">
                  <div className="flex items-center gap-2">
                    <ClipboardCheck className="w-3.5 h-3.5" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Tasks</span>
                  </div>
                  <span className="text-xs font-black text-blue-400">{metrics.taskProgress}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-1000" 
                    style={{ width: `${metrics.taskProgress}%` }} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-end text-white/40">
                  <div className="flex items-center gap-2">
                    <Camera className="w-3.5 h-3.5" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Evidence</span>
                  </div>
                  <span className="text-xs font-black text-emerald-400">{metrics.photoProgress}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-1000" 
                    style={{ width: `${metrics.photoProgress}%` }} 
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Critical Exceptions */}
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

      {/* Workforce Management */}
      <div className="space-y-4">
        <h3 className="text-xl font-black text-slate-900 px-1">Workforce Management</h3>
        <div className="space-y-3">
            <Link href="/admin/workers">
                <Card className="border-none shadow-sm hover:shadow-md transition-all rounded-3xl bg-white overflow-hidden group">
                    <CardContent className="p-5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                <Users className="w-6 h-6 text-blue-500" />
                            </div>
                            <div>
                                <h4 className="font-black text-slate-900 uppercase text-xs tracking-tight">Staff Management</h4>
                                <p className="text-[10px] font-bold text-slate-400">Staff Health & Certification Hub</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-blue-500" />
                    </CardContent>
                </Card>
            </Link>

            <Link href="/admin/approvals">
                <Card className="border-none shadow-sm hover:shadow-md transition-all rounded-3xl bg-white overflow-hidden group">
                    <CardContent className="p-5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                                <Sun className="w-6 h-6 text-purple-500" />
                            </div>
                            <div>
                                <h4 className="font-black text-slate-900 uppercase text-xs tracking-tight">Payroll Exceptions</h4>
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
                                <h4 className="font-black text-slate-900 uppercase text-xs tracking-tight">Supply Management</h4>
                                <p className="text-[10px] font-bold text-slate-400">Site-Specific Stock Management</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-orange-500" />
                    </CardContent>
                </Card>
            </Link>
        </div>
      </div>

      {/* Site Activity */}
      <div className="space-y-4 px-1">
        <h3 className="text-xl font-black text-slate-900">Site Activity</h3>
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
