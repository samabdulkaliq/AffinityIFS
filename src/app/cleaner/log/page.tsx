"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, CheckCircle2, Package, Shield, Info, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

/**
 * @fileOverview Field Operations Verification Log.
 * Implements PRD-mandated visual evidence and supply room audits.
 */

export default function FieldOpsLogPage() {
  const { toast } = useToast();
  const [logs, setLogs] = useState({ supply: false, hourly: 2 });

  const handleAction = (type: 'SUPPLY' | 'HOURLY') => {
    if (type === 'SUPPLY') setLogs(prev => ({ ...prev, supply: true }));
    else setLogs(prev => ({ ...prev, hourly: prev.hourly + 1 }));
    
    toast({ title: "Evidence Logged", description: "Documentation synced with management portal." });
  };

  return (
    <div className="space-y-8 pb-24 animate-in fade-in duration-500">
      <div className="px-1">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Field Log</h2>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Compliance Verification</p>
      </div>

      {/* PRD 7.0: Supply Room Photo */}
      <Card className="border-none shadow-sm rounded-[2rem] bg-white">
        <CardHeader className="pb-2 border-b border-slate-50">
          <CardTitle className="text-sm font-black flex items-center gap-2">
            <Package className="w-4 h-4 text-blue-500" /> Supply Stock Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0">
                <Camera className="w-6 h-6 text-slate-300" />
            </div>
            <div className="space-y-1">
                <p className="text-xs font-bold text-slate-700 leading-tight">Daily Inventory Check</p>
                <p className="text-[10px] text-slate-400 leading-relaxed font-medium italic">Requirement: Capture current stock organization for audit trail.</p>
            </div>
          </div>
          <Button 
            onClick={() => handleAction('SUPPLY')}
            disabled={logs.supply}
            className="w-full h-12 rounded-xl bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest"
          >
            {logs.supply ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
            {logs.supply ? "Archived for Today" : "Log Supply Status"}
          </Button>
        </CardContent>
      </Card>

      {/* PRD 6.0: Photo Documentation */}
      <Card className="border-none shadow-sm rounded-[2rem] bg-white">
        <CardHeader className="pb-2 border-b border-slate-50">
          <CardTitle className="text-sm font-black flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-500" /> Work Quality Documentation
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Shift Evidence</p>
              <p className="text-2xl font-black text-slate-900">{logs.hourly} / 5 <span className="text-xs text-slate-400">Photos</span></p>
            </div>
            <div className="flex -space-x-3">
                {[1,2,3].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 overflow-hidden shadow-sm">
                        <img src={`https://picsum.photos/seed/doc${i}/100/100`} />
                    </div>
                ))}
            </div>
          </div>
          
          <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100/50 flex items-start gap-3">
            <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-[10px] text-blue-700 font-bold leading-relaxed">Continuous verification required. Submit photos every 60 mins to defend staffing decisions.</p>
          </div>

          <Button 
            onClick={() => handleAction('HOURLY')}
            className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-[10px] tracking-widest shadow-xl shadow-blue-200"
          >
            <Camera className="w-5 h-5 mr-2" /> Submit Task Verification
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}