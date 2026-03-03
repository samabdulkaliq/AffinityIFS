"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/lib/store";
import { repository } from "@/app/lib/repository";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Camera, 
  CheckCircle2, 
  Package, 
  Shield, 
  Info, 
  Upload, 
  Activity, 
  AlertTriangle,
  History,
  Zap,
  MoreVertical,
  ChevronRight,
  ClipboardList
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

/**
 * @fileOverview Field Operations Verification Log (Affinity IFS).
 * High-fidelity implementation of PRD Sections 6, 7, and 8.
 */

export default function FieldOpsLogPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeShift, setActiveShift] = useState<any>(null);
  
  // Scenarios for the demo
  const [logs, setLogs] = useState({
    supplyLogged: false,
    photosCount: 2,
    motionStatus: 'ACTIVE' as 'ACTIVE' | 'IDLE' | 'OFF',
    complianceScore: 84
  });

  useEffect(() => {
    if (!user) return;
    const shifts = repository.getShiftsForUser(user.id);
    const current = shifts.find(s => s.status === 'IN_PROGRESS' || s.status === 'SCHEDULED');
    setActiveShift(current);
  }, [user]);

  const handlePhotoUpload = () => {
    setLogs(prev => ({
      ...prev,
      photosCount: Math.min(prev.photosCount + 1, 5),
      complianceScore: Math.min(prev.complianceScore + 4, 100)
    }));
    toast({ title: "Evidence Captured", description: "Verification photo uploaded to shift log." });
  };

  const handleSupplyAudit = () => {
    setLogs(prev => ({ ...prev, supplyLogged: true }));
    toast({ title: "Audit Complete", description: "Supply room inventory archived." });
  };

  if (!activeShift) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center px-10 space-y-4">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
          <History className="w-8 h-8 text-slate-200" />
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-900">Archive Only</h3>
          <p className="text-sm text-slate-500 font-medium">No active deployment found. Field logs are only accessible during shifts.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-32 animate-in fade-in duration-700">
      {/* Executive Header */}
      <div className="px-1 flex justify-between items-end">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Field Log</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Operational Integrity OS</p>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Shift Integrity</p>
          <Badge className={cn(
            "font-black text-[10px] px-3 py-1 border-none",
            logs.complianceScore >= 90 ? "bg-emerald-500" : "bg-amber-500"
          )}>
            {logs.complianceScore}% COMPLIANT
          </Badge>
        </div>
      </div>

      {/* PRD 8.0: Productivity & Motion Stream */}
      <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2rem] bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Activity className="w-24 h-24" />
        </div>
        <CardContent className="p-6 space-y-6 relative z-10">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Productivity Pulse</p>
              <h3 className="text-lg font-black flex items-center gap-2">
                {logs.motionStatus === 'ACTIVE' ? (
                  <>
                    <Zap className="w-5 h-5 text-blue-400 fill-blue-400" />
                    <span className="text-blue-400">Movement Detected</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    <span className="text-amber-500">Idle Alert</span>
                  </>
                )}
              </h3>
            </div>
            <Badge variant="outline" className="border-white/20 text-white/60 font-black text-[8px] tracking-widest uppercase">
              Sensor Live
            </Badge>
          </div>
          
          <div className="flex gap-1.5 h-12 items-end">
            {[30, 45, 20, 60, 80, 40, 90, 30, 50, 70, 40, 20, 80, 60, 30, 90].map((h, i) => (
              <motion.div 
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: i * 0.05, duration: 1, repeat: Infinity, repeatType: 'reverse' }}
                className={cn(
                  "flex-1 rounded-full",
                  logs.motionStatus === 'ACTIVE' ? "bg-blue-500/40" : "bg-amber-500/20"
                )}
              />
            ))}
          </div>
          
          <p className="text-[10px] text-white/50 font-medium italic leading-relaxed">
            * Tracking purpose: defend staffing decisions and performance management. Continuous active motion required.
          </p>
        </CardContent>
      </Card>

      {/* PRD 6.0: Continuous Photo Verification */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
            <Camera className="w-4 h-4 text-blue-600" />
            Shift Documentation
          </h3>
          <span className="text-[9px] font-black text-slate-400 uppercase">Hourly Requirement</span>
        </div>
        
        <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden group">
          <CardContent className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-3xl font-black text-slate-900 leading-none">{logs.photosCount} / 5</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Verified Tasks Captured</p>
              </div>
              <div className="flex -space-x-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-12 h-12 rounded-2xl border-2 border-white bg-slate-100 overflow-hidden shadow-sm transition-transform hover:scale-110">
                    <img src={`https://picsum.photos/seed/doc${i}/100/100`} alt="Task Doc" className="w-full h-full object-cover" />
                  </div>
                ))}
                {logs.photosCount > 3 && (
                  <div className="w-12 h-12 rounded-2xl border-2 border-white bg-blue-600 flex items-center justify-center text-white text-xs font-black shadow-sm">
                    +{logs.photosCount - 3}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase">
                <span>Verification Progress</span>
                <span>{Math.round((logs.photosCount / 5) * 100)}%</span>
              </div>
              <Progress value={(logs.photosCount / 5) * 100} className="h-2 bg-slate-100" />
            </div>

            <Button 
              onClick={handlePhotoUpload}
              className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-[11px] tracking-widest shadow-xl shadow-blue-200 active:scale-95 transition-all"
            >
              <Camera className="w-5 h-5 mr-2" /> Log Evidence Now
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* PRD 7.0: Supply Room Monitoring */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
            <Package className="w-4 h-4 text-emerald-600" />
            Inventory Control
          </h3>
          <Badge variant="outline" className="text-[8px] font-black border-slate-200">DAILY PROTOCOL</Badge>
        </div>

        <Card className={cn(
          "border-none shadow-sm rounded-[2rem] transition-all overflow-hidden",
          logs.supplyLogged ? "bg-emerald-50/50 border-emerald-100" : "bg-white"
        )}>
          <CardContent className="p-6">
            <div className="flex gap-5 mb-6">
              <div className={cn(
                "w-16 h-16 rounded-[1.5rem] flex items-center justify-center border-2 transition-all",
                logs.supplyLogged ? "bg-white border-emerald-200 text-emerald-500" : "bg-slate-50 border-slate-100 text-slate-300"
              )}>
                {logs.supplyLogged ? <CheckCircle2 className="w-8 h-8" /> : <Package className="w-8 h-8" />}
              </div>
              <div className="flex-1 space-y-1">
                <h4 className="text-base font-black text-slate-900">Supply Room Audit</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed italic">
                  Capture stock organization and check for inventory triggers.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col items-center gap-1">
                <span className="text-[10px] font-black text-slate-400 uppercase">Org Level</span>
                <span className="text-sm font-black text-slate-900">Standard</span>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col items-center gap-1">
                <span className="text-[10px] font-black text-slate-400 uppercase">Stock Alert</span>
                <span className="text-sm font-black text-emerald-600">Stable</span>
              </div>
            </div>

            <Button 
              onClick={handleSupplyAudit}
              disabled={logs.supplyLogged}
              className={cn(
                "w-full h-14 rounded-2xl font-black uppercase text-[11px] tracking-widest transition-all",
                logs.supplyLogged 
                  ? "bg-emerald-500 text-white" 
                  : "bg-slate-900 text-white hover:bg-slate-800"
              )}
            >
              {logs.supplyLogged ? (
                <><CheckCircle2 className="w-5 h-5 mr-2" /> Audit Recorded</>
              ) : (
                <><Upload className="w-5 h-5 mr-2" /> Run Daily Supply Audit</>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Advisory Gate */}
      <div className="p-4 rounded-2xl bg-slate-100/50 border border-slate-200 border-dashed flex items-start gap-3">
        <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
        <p className="text-[9px] text-slate-500 font-bold leading-relaxed">
          Operational Integrity is tracked live. Gaps in documentation or prolonged inactivity will trigger manager intervention. Defend your staffing decisions through continuous logging.
        </p>
      </div>
    </div>
  );
}
