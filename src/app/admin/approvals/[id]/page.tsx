"use client";

import { useState, use } from "react";
import { repository } from "@/app/lib/repository";
import { intelligentTimeReviewAssistant, TimeReviewAssistantOutput } from "@/ai/flows/intelligent-time-review-assistant";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, AlertTriangle, CheckCircle2, XCircle, Info, Calendar, Clock, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function ApprovalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { toast } = useToast();
  const request = repository.getReviewRequests().find(r => r.id === id);
  const [aiAnalysis, setAiAnalysis] = useState<TimeReviewAssistantOutput | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  if (!request) return <div className="p-12 text-center font-bold text-slate-400">Request not found</div>;

  const shift = repository.getShift(request.shiftId);
  const cleaner = repository.getUser(request.userId);

  const runAiAssistant = async () => {
    setLoadingAi(true);
    try {
      const result = await intelligentTimeReviewAssistant({
        requestId: request.id,
        cleanerName: cleaner?.name || "Unknown",
        workerType: cleaner?.workerType || "EMPLOYEE",
        requestReason: request.reason,
        requestNote: request.note,
        requestCreatedAt: request.createdAt,
        shiftId: shift!.id,
        scheduledStart: shift!.scheduledStart,
        scheduledEnd: shift!.scheduledEnd,
        siteName: shift!.siteName || "Unknown",
        existingTimeEvents: repository.getEventsForShift(shift!.id).map(e => ({
            type: e.type,
            timestamp: e.timestamp,
            source: e.source,
            notes: e.notes
        })),
        ontarioBreakRuleEnabled: true
      });
      setAiAnalysis(result);
      toast({ title: "AI Analysis Complete ✨", description: "Review findings below." });
    } catch (error) {
      toast({ variant: "destructive", title: "AI Error", description: "Failed to run analysis." });
    } finally {
      setLoadingAi(false);
    }
  };

  const handleAction = (status: 'APPROVED' | 'REJECTED') => {
    repository.updateReviewRequest(request.id, { status });
    toast({ title: `Request ${status === 'APPROVED' ? 'Approved ✅' : 'Rejected ❌'}` });
    router.back();
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
      <div className="flex items-center gap-2 mb-2">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-slate-500 font-bold hover:bg-slate-100 rounded-xl">
          <ChevronRight className="w-4 h-4 rotate-180 mr-1" /> Back to Review
        </Button>
      </div>

      <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden bg-white">
        <CardHeader className="pb-4 bg-slate-50/50 border-b border-slate-100">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-black text-slate-900 tracking-tight">{request.cleanerName}</CardTitle>
              <CardDescription className="text-slate-500 font-medium">Request ID: {request.id}</CardDescription>
            </div>
            <Badge className={cn(
              "px-3 py-1 font-black uppercase text-[10px] tracking-widest",
              request.status === 'PENDING' ? "bg-amber-500" :
              request.status === 'APPROVED' ? "bg-emerald-500" :
              "bg-red-500"
            )}>
              {request.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reason: {request.reason}</p>
                  <p className="text-sm font-medium text-slate-700 italic leading-relaxed">"{request.note}"</p>
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scheduled Start</p>
                    <div className="flex items-center gap-2 text-slate-900 font-bold">
                      <Clock className="w-4 h-4 text-blue-500" />
                      {new Date(shift!.scheduledStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>
                <div className="space-y-1 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scheduled End</p>
                    <div className="flex items-center gap-2 text-slate-900 font-bold">
                      <Clock className="w-4 h-4 text-blue-500" />
                      {new Date(shift!.scheduledEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3 text-slate-600">
              <MapPin className="w-5 h-5 text-slate-400" />
              <span className="text-sm font-bold">{shift!.siteName}</span>
            </div>
        </CardContent>
      </Card>

      {!aiAnalysis && (
        <Button 
          onClick={runAiAssistant} 
          disabled={loadingAi}
          className="w-full h-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl shadow-xl shadow-blue-200 font-black uppercase tracking-widest text-xs active:scale-95 transition-all"
        >
          {loadingAi ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Sparkles className="w-5 h-5 mr-2" />}
          Execute AI Analysis
        </Button>
      )}

      {aiAnalysis && (
        <Card className="border-none bg-blue-50/30 shadow-xl border-l-8 border-blue-500 rounded-[2rem] animate-in zoom-in-95 duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                Intelligence Findings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div>
                <p className="font-black text-blue-600 mb-1 uppercase text-[10px] tracking-widest">Analysis Summary</p>
                <p className="text-slate-700 text-sm leading-relaxed font-medium">{aiAnalysis.analysisSummary}</p>
            </div>
            
            {aiAnalysis.identifiedDiscrepancies.length > 0 && (
                <div className="bg-white/60 p-4 rounded-2xl border border-blue-100/50">
                    <p className="font-black text-slate-400 mb-2 uppercase text-[10px] tracking-widest">Anomalies Detected</p>
                    <ul className="space-y-2">
                        {aiAnalysis.identifiedDiscrepancies.map((d, i) => (
                            <li key={i} className="flex items-start gap-2 text-red-600 font-bold text-xs">
                                <AlertTriangle className="w-4 h-4 shrink-0" />
                                <span>{d}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="bg-white p-5 rounded-[1.5rem] border border-blue-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-12 -mt-12 blur-2xl opacity-50" />
                <p className="font-black text-slate-400 mb-2 uppercase text-[10px] tracking-widest">Recommended Action</p>
                <div className="flex items-center justify-between relative z-10">
                    <span className="text-xl font-black text-slate-900">{aiAnalysis.suggestedResolution}</span>
                    <Badge className="bg-blue-600 font-black px-2 py-0.5">{Math.round(aiAnalysis.confidenceScore * 100)}% Match</Badge>
                </div>
                <p className="text-xs text-slate-500 mt-3 italic leading-relaxed border-t border-slate-50 pt-3">
                  Guidance: {aiAnalysis.adminGuidance}
                </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Button onClick={() => handleAction('REJECTED')} variant="outline" className="h-16 rounded-2xl border-2 border-slate-200 text-slate-700 font-black uppercase tracking-widest text-xs hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all">
            <XCircle className="w-5 h-5 mr-2" /> Reject
        </Button>
        <Button onClick={() => handleAction('APPROVED')} className="h-16 rounded-2xl bg-slate-900 text-white hover:bg-emerald-600 font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-slate-200">
            <CheckCircle2 className="w-5 h-5 mr-2" /> Approve
        </Button>
      </div>
    </div>
  );
}