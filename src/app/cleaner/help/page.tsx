"use client";

import { useState } from "react";
import { useAuth } from "@/app/lib/store";
import { cleanerHelpAssistant, CleanerHelpOutput } from "@/ai/flows/cleaner-help-assistant";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2, MessageSquare, Phone, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CleanerHelpPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<CleanerHelpOutput | null>(null);

  const handleAskAI = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const result = await cleanerHelpAssistant({
        cleanerName: user?.name || "Cleaner",
        issueDescription: query,
        shiftStatus: "IN_PROGRESS"
      });
      setResponse(result);
    } catch (error) {
      toast({ variant: "destructive", title: "Assistant Error", description: "Failed to connect to help assistant." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="px-2">
        <h2 className="text-2xl font-bold text-primary">Support Center</h2>
        <p className="text-sm text-muted-foreground">Get instant help with your shift 🛠️</p>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-secondary" />
            What's happening?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea 
            placeholder="e.g. I'm at the site but the GPS says I'm 50m away..."
            className="min-h-[100px] rounded-2xl border-slate-200"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button 
            onClick={handleAskAI} 
            disabled={loading || !query}
            className="w-full h-12 bg-secondary text-white rounded-xl shadow-lg shadow-secondary/20"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
            Ask AI Assistant
          </Button>
        </CardContent>
      </Card>

      {response && (
        <Card className="border-none bg-blue-50/50 shadow-md animate-in slide-in-from-bottom-2">
          <CardContent className="p-6 space-y-4">
            <p className="text-sm font-bold text-primary italic">"{response.empathyStatement}"</p>
            <div className="bg-white p-4 rounded-2xl border border-blue-100">
              <p className="text-sm text-slate-600 leading-relaxed">{response.advice}</p>
            </div>
            <div className="flex flex-col gap-2">
                <p className="text-[10px] font-bold text-secondary uppercase tracking-widest px-1">Suggested Action</p>
                <div className="bg-primary text-white p-3 rounded-xl flex justify-between items-center">
                    <span className="font-bold">{response.suggestedAction}</span>
                    <ArrowRight className="w-4 h-4" />
                </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-2">Common Actions</p>
        <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-16 rounded-2xl border-2 border-slate-100 flex flex-col items-center justify-center gap-1">
                <Phone className="w-5 h-5 text-secondary" />
                <span className="text-[10px] font-bold uppercase">Call Admin</span>
            </Button>
            <Button variant="outline" className="h-16 rounded-2xl border-2 border-slate-100 flex flex-col items-center justify-center gap-1">
                <MessageSquare className="w-5 h-5 text-secondary" />
                <span className="text-[10px] font-bold uppercase">Live Chat</span>
            </Button>
        </div>
      </div>
    </div>
  );
}
