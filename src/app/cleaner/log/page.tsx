
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, CheckCircle2, Package, Shield, AlertCircle, Info, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

/**
 * @fileOverview Field Operations Log.
 * Replaces gamification with PRD-mandated verification modules.
 */

export default function FieldOpsLogPage() {
  const { toast } = useToast();
  const [supplyUploaded, setSupplyUploaded] = useState(false);
  const [hourlyCount, setHourlyCount] = useState(2);

  const handleUpload = (type: string) => {
    if (type === 'SUPPLY') setSupplyUploaded(true);
    else setHourlyCount(c => c + 1);
    
    toast({
      title: "Evidence Archived",
      description: "Photo documentation synced with manager portal.",
    });
  };

  return (
    <div className="space-y-8 pb-24 animate-in fade-in duration-700">
      <div className="px-1 space-y-1">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Field Log</h2>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Compliance & Documentation</p>
      </div>

      {/* PRD Section 7: Supply Room Monitoring */}
      <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden bg-white">
        <CardHeader className="pb-2 border-b border-slate-50">
          <CardTitle className="text-sm font-black flex items-center gap-2">
            <Package className="w-4 h-4 text-blue-500" />
            Supply Room Inventory
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
              <Camera className="w-6 h-6 text-slate-300" />
            </div>
            <div className="space-y-1 flex-1">
              <p className="text-xs font-bold text-slate-700">Daily Stock Verification</p>
              <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                Photograph supply room organization and stock levels for manager review.
              </p>
            </div>
            {supplyUploaded ? (
              <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 font-black text-[8px] px-2 py-0.5">COMPLETED</Badge>
            ) : (
              <Badge variant="outline" className="text-[8px] font-black border-slate-200 text-slate-400">PENDING</Badge>
            )}
          </div>
          <Button 
            onClick={() => handleUpload('SUPPLY')}
            disabled={supplyUploaded}
            className="w-full h-12 rounded-xl bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest"
          >
            {supplyUploaded ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
            {supplyUploaded ? "Synced for Today" : "Archive Supply Photo"}
          </Button>
        </CardContent>
      </Card>

      {/* PRD Section 6: Photo Documentation */}
      <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden bg-white">
        <CardHeader className="pb-2 border-b border-slate-50">
          <CardTitle className="text-sm font-black flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-500" />
            Work Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Shift Progress</p>
              <p className="text-2xl font-black text-slate-900">{hourlyCount} / 5 <span className="text-xs text-slate-400 font-bold">Photos</span></p>
            </div>
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden">
                   <img src={`https://picsum.photos/seed/doc${i}/100/100`} alt="Doc" className="w-full h-full object-cover" />
                </div>
              ))}
              <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-50 flex items-center justify-center">
                <Info className="w-3 h-3 text-blue-500" />
              </div>
            </div>
          </div>
          
          <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100/50">
            <p className="text-[10px] text-blue-600 font-bold leading-relaxed">
              Requirement: Submit 3–5 photos per hour of completed tasks. This provides defensible documentation for client reporting.
            </p>
          </div>

          <Button 
            onClick={() => handleUpload('HOURLY')}
            className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-[10px] tracking-widest shadow-xl shadow-blue-100"
          >
            <Camera className="w-5 h-5 mr-2" /> Submit Verification Photo
          </Button>
        </CardContent>
      </Card>

      {/* PRD Section 8: Activity Monitoring */}
      <Card className="border-none bg-slate-900 text-white rounded-[2rem] overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-xs font-bold">Active Motion Consent</p>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed font-medium mb-6">
            To identify productivity gaps and defend staffing decisions, this device monitors active movement during shift hours.
          </p>
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
            <span className="text-[10px] font-black uppercase tracking-widest">Tracking Active</span>
            <div className="w-8 h-4 bg-emerald-500 rounded-full relative">
              <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full shadow-sm" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
