
"use client";

import { useState } from "react";
import { useAuth } from "@/app/lib/store";
import { cleanerHelpAssistant, CleanerHelpOutput } from "@/ai/flows/cleaner-help-assistant";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2, MapPin, Clock, Camera, ClipboardCheck, Phone, ArrowRight, ChevronLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

/**
 * @fileOverview Redesigned Support Center.
 * Simple language, quick help buttons, and AI assistant.
 */

export default function CleanerHelpPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<CleanerHelpOutput | null>(null);

  const handleAskAI = async (textOverride?: string) => {
    const textToAsk = textOverride || query;
    if (!textToAsk.trim()) return;
    
    setLoading(true);
    try {
      const result = await cleanerHelpAssistant({
        cleanerName: user?.name || "Cleaner",
        issueDescription: textToAsk,
        shiftStatus: "IN_PROGRESS"
      });
      setResponse(result);
    } catch (error) {
      toast({ variant: "destructive", title: "Assistant Error", description: "Failed to connect to help assistant." });
    } finally {
      setLoading(false);
    }
  };

  const quickButtons = [
    { label: "GPS issue", icon: MapPin, text: "My GPS is not showing correctly at the site." },
    { label: "Time issue", icon: Clock, text: "I need to correct my clock-in time." },
    { label: "Photo issue", icon: Camera, text: "I'm having trouble uploading my shift photos." },
    { label: "Task question", icon: ClipboardCheck, text: "I have a question about one of my shift tasks." },
    { label: "Call supervisor", icon: Phone, text: "I need to talk to my supervisor.", isAction: true },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
          <ChevronLeft className="w-6 h-6 text-slate-400" />
        </Button>
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Support Center</h2>
          <p className="text-sm text-slate-500 font-medium">Get instant help with your shift 🛠️</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Quick actions</h3>
        <div className="grid grid-cols-2 gap-3">
            {quickButtons.map((btn, i) => (
              <Button 
                key={i} 
                variant="outline" 
                onClick={() => btn.isAction ? toast({ title: "Connecting..." }) : handleAskAI(btn.text)}
                className="h-20 rounded-2xl border-2 border-slate-50 flex flex-col items-center justify-center gap-2 bg-white shadow-sm hover:border-blue-100 hover:bg-blue-50/30 transition-all text-slate-600 active:scale-95"
              >
                <btn.icon className="w-5 h-5 text-blue-500" />
                <span className="text-[10px] font-bold uppercase tracking-tighter">{btn.label}</span>
              </Button>
            ))}
        </div>
      </div>

      <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-black text-slate-900 uppercase tracking-tight">
            What do you need help with?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea 
            placeholder="Type your question here..."
            className="min-h-[120px] rounded-2xl border-slate-100 bg-slate-50/50 font-medium focus-visible:ring-blue-500"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button 
            onClick={() => handleAskAI()} 
            disabled={loading || !query}
            className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-xl shadow-blue-100 font-black uppercase text-xs tracking-widest transition-all"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
            Ask Assistant
          </Button>
        </CardContent>
      </Card>

      {response && (
        <Card className="border-none bg-blue-50/50 shadow-md animate-in slide-in-from-bottom-2 rounded-[2rem]">
          <CardContent className="p-6 space-y-4">
            <p className="text-sm font-black text-blue-600 italic">"{response.empathyStatement}"</p>
            <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-sm">
              <p className="text-sm text-slate-700 leading-relaxed font-medium">{response.advice}</p>
            </div>
            <div className="flex flex-col gap-2">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Suggested Action</p>
                <div className="bg-slate-900 text-white p-4 rounded-2xl flex justify-between items-center shadow-lg">
                    <span className="font-black text-xs uppercase tracking-widest">{response.suggestedAction}</span>
                    <ArrowRight className="w-4 h-4" />
                </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
