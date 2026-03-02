"use client";

import { useState, use } from "react";
import { repository } from "@/app/lib/repository";
import { intelligentTimeReviewAssistant, TimeReviewAssistantOutput } from "@/ai/flows/intelligent-time-review-assistant";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, AlertTriangle, CheckCircle2, XCircle, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function ApprovalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { toast } = useToast();
  const request = repository.getReviewRequests().find(r => r.id === id);
  const [aiAnalysis, setAiAnalysis] = useState<TimeReviewAssistantOutput | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  if (!request) return <div>Request not found</div>;

  const shift = repository.getShift(request.shiftId);
  const cleaner = repository.getUser(request.userId);

  const runAiAssistant = async () => {
    setLoadingAi(true);
    try {
      // Mocked input for the AI flow based on our local repository data
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
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-2 mb-2">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>← Back</Button>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl">{request.cleanerName}</CardTitle>
            <Badge variant="outline">{request.status}</Badge>
          </div>
          <CardDescription>{request.reason}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="bg-slate-50 p-3 rounded-xl">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Cleaner Note</p>
                <p className="text-sm italic">"{request.note}"</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Shift Start</p>
                    <p className="text-sm font-medium">{new Date(shift!.scheduledStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Shift End</p>
                    <p className="text-sm font-medium">{new Date(shift!.scheduledEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
            </div>
        </CardContent>
      </Card>

      {!aiAnalysis && (
        <Button 
          onClick={runAiAssistant} 
          disabled={loadingAi}
          className="w-full h-14 bg-gradient-to-r from-secondary to-blue-500 text-white rounded-2xl shadow-lg font-bold"
        >
          {loadingAi ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Sparkles className="w-5 h-5 mr-2" />}
          Run AI Analysis
        </Button>
      )}

      {aiAnalysis && (
        <Card className="border-none bg-blue-50/50 shadow-md border-l-4 border-secondary animate-in zoom-in-95 duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-secondary" />
                AI Findings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
                <p className="font-bold text-primary mb-1 uppercase text-[10px]">Analysis Summary</p>
                <p className="text-slate-600 leading-relaxed">{aiAnalysis.analysisSummary}</p>
            </div>
            
            {aiAnalysis.identifiedDiscrepancies.length > 0 && (
                <div>
                    <p className="font-bold text-primary mb-1 uppercase text-[10px]">Discrepancies</p>
                    <ul className="space-y-1">
                        {aiAnalysis.identifiedDiscrepancies.map((d, i) => (
                            <li key={i} className="flex items-start gap-2 text-red-600 font-medium">
                                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                                <span>{d}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="bg-white/80 p-3 rounded-xl border border-blue-100">
                <p className="font-bold text-secondary mb-2 uppercase text-[10px]">Recommended Resolution</p>
                <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">{aiAnalysis.suggestedResolution}</span>
                    <Badge className="bg-secondary">{Math.round(aiAnalysis.confidenceScore * 100)}% Confidence</Badge>
                </div>
                <p className="text-xs text-slate-500 mt-2 italic">{aiAnalysis.adminGuidance}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-4 pb-8">
        <Button onClick={() => handleAction('REJECTED')} variant="outline" className="h-14 rounded-2xl border-2 border-red-200 text-red-600 hover:bg-red-50">
            <XCircle className="w-5 h-5 mr-2" /> Reject
        </Button>
        <Button onClick={() => handleAction('APPROVED')} className="h-14 rounded-2xl bg-primary text-white hover:bg-primary/90">
            <CheckCircle2 className="w-5 h-5 mr-2" /> Approve
        </Button>
      </div>
    </div>
  );
}
