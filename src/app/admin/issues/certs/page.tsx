
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { repository } from "@/app/lib/repository";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, 
  ShieldAlert, 
  Mail, 
  CheckCircle2, 
  ExternalLink,
  Calendar,
  AlertTriangle,
  Bell,
  Sparkles,
  Loader2,
  Clock,
  Send,
  History,
  ShieldCheck
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { generateDocRequest, DocRequestOutput } from "@/ai/flows/document-request-flow";
import { useAuth } from "@/app/lib/store";
import { User, UserCertification, DocRequest } from "@/app/lib/models";
import { cn } from "@/lib/utils";

type Tone = 'Friendly' | 'Professional' | 'Urgent';

export default function CertificationQueue() {
  const router = useRouter();
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const [workers, setWorkers] = useState(repository.getWorkersWithExpiredCerts());
  
  // Modal State
  const [selectedWorker, setSelectedWorker] = useState<User | null>(null);
  const [selectedCert, setSelectedCert] = useState<UserCertification | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tone, setTone] = useState<Tone>('Professional');
  const [dueDateType, setDueDateType] = useState<'TODAY' | '24H' | '3D' | 'CUSTOM'>('24H');
  const [customDueDate, setCustomDueDate] = useState("");
  const [optionalNote, setOptionalNote] = useState("");
  
  // AI Preview State
  const [aiPreview, setAiPreview] = useState<DocRequestOutput | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [sending, setSending] = useState(false);

  const getDueDateString = () => {
    if (dueDateType === 'TODAY') return 'by end of day today';
    if (dueDateType === '24H') return 'within the next 24 hours';
    if (dueDateType === '3D') return 'within the next 3 days';
    return customDueDate || 'as soon as possible';
  };

  const handleOpenRequest = (worker: User, cert: UserCertification) => {
    setSelectedWorker(worker);
    setSelectedCert(cert);
    setIsModalOpen(true);
    setAiPreview(null);
    setOptionalNote("");
  };

  useEffect(() => {
    if (isModalOpen && selectedWorker && selectedCert) {
      const fetchPreview = async () => {
        setLoadingAi(true);
        try {
          const res = await generateDocRequest({
            workerName: selectedWorker.name,
            docType: selectedCert.name,
            expiryDate: selectedCert.expiryDate,
            dueDate: getDueDateString(),
            managerName: currentUser?.name || "Manager",
            tone: tone,
            optionalNote: optionalNote
          });
          setAiPreview(res);
        } catch (e) {
          console.error(e);
        } finally {
          setLoadingAi(false);
        }
      };
      
      const timer = setTimeout(fetchPreview, 500);
      return () => clearTimeout(timer);
    }
  }, [isModalOpen, tone, dueDateType, customDueDate, optionalNote]);

  const handleSend = async () => {
    if (!selectedWorker || !selectedCert || !aiPreview) return;
    
    setSending(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    repository.createDocRequest({
      userId: selectedWorker.id,
      certId: selectedCert.id,
      docType: selectedCert.name,
      dueDate: getDueDateString(),
      status: 'SENT',
      sentAt: new Date().toISOString(),
      pushSent: !!selectedWorker.phone, // Simplified check
      emailSent: !!selectedWorker.email,
    });

    toast({ 
      title: "Request Sent ✨", 
      description: `Notification and Email sent to ${selectedWorker.name.split(' ')[0]}.` 
    });
    
    setSending(false);
    setIsModalOpen(false);
    setWorkers(repository.getWorkersWithExpiredCerts()); // Refresh UI
  };

  const handleResolve = (id: string) => {
    const worker = repository.getUser(id);
    if (worker && worker.certifications) {
      const updatedCerts = worker.certifications.map(c => ({ ...c, status: 'VALID' as const, expiryDate: '2025-12-31' }));
      repository.updateUser(id, { certifications: updatedCerts });
      setWorkers(repository.getWorkersWithExpiredCerts());
      toast({ title: "Verification Saved", description: `${worker.name}'s training has been updated.` });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-24">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
          <ArrowLeft className="w-6 h-6 text-slate-400" />
        </Button>
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Certification Issues</h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Worker Compliance</p>
        </div>
      </div>

      <div className="space-y-4">
        {workers.length > 0 ? workers.map((worker) => {
          const requests = repository.getDocRequestsForUser(worker.id);
          const hasOpenRequest = requests.some(r => r.status === 'SENT');
          const latestRequest = requests.sort((a,b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime())[0];

          return (
            <Card key={worker.id} className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden group">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12 border-2 border-white shadow-sm">
                      <AvatarImage src={worker.avatarUrl} />
                      <AvatarFallback>{worker.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-black text-slate-900 leading-none">{worker.name}</h4>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">ID {worker.id.split('-')[1]}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge className="bg-red-50 text-red-600 border-none font-black text-[10px] px-3">EXPIRED</Badge>
                    {hasOpenRequest && (
                      <Badge variant="outline" className="border-blue-100 text-blue-600 bg-blue-50/30 text-[8px] font-black uppercase">Requested</Badge>
                    )}
                  </div>
                </div>

                <div className="p-5 bg-red-50/30 rounded-2xl border border-red-100 space-y-3">
                  {worker.certifications?.filter(c => c.status === 'EXPIRED').map(cert => (
                    <div key={cert.id} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-red-500" />
                        <span className="text-sm font-bold text-slate-700">{cert.name}</span>
                      </div>
                      <span className="text-[10px] font-black text-red-400 uppercase">Exp: {cert.expiryDate}</span>
                    </div>
                  ))}
                </div>

                {hasOpenRequest && latestRequest && (
                  <div className="flex items-center gap-2 px-1">
                    <Clock className="w-3 h-3 text-blue-400" />
                    <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">
                      Sent {new Date(latestRequest.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant={hasOpenRequest ? "outline" : "default"}
                    onClick={() => handleOpenRequest(worker, worker.certifications!.find(c => c.status === 'EXPIRED')!)}
                    className={cn(
                      "h-14 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all",
                      hasOpenRequest ? "border-2 border-blue-100 text-blue-600 bg-white" : "bg-slate-900 text-white"
                    )}
                  >
                    {hasOpenRequest ? <History className="w-4 h-4 mr-2" /> : <Mail className="w-4 h-4 mr-2" />}
                    {hasOpenRequest ? "Remind" : "Request Docs"}
                  </Button>
                  <Button 
                    onClick={() => handleResolve(worker.id)}
                    className="h-14 rounded-2xl bg-emerald-50 text-emerald-600 border-2 border-emerald-100 font-black uppercase text-[10px] tracking-widest hover:bg-emerald-100"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Verify Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        }) : (
          <div className="py-24 text-center space-y-4">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
              <ShieldCheck className="w-10 h-10 text-emerald-200" />
            </div>
            <p className="text-slate-400 font-black text-xs uppercase tracking-widest">All Staff Compliant</p>
          </div>
        )}
      </div>

      {/* REQUEST MODAL */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[440px] rounded-[2.5rem] p-0 overflow-hidden border-none shadow-3xl bg-white">
          <div className="p-8 bg-blue-600 text-white relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
            <DialogHeader className="text-left space-y-2 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <DialogTitle className="text-2xl font-black text-white">Smart Request</DialogTitle>
              </div>
              <DialogDescription className="text-blue-100 font-medium text-sm">
                AI will draft a professional update request for {selectedWorker?.name.split(' ')[0]}.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto scrollbar-hide">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Tone</label>
                  <select 
                    value={tone} 
                    onChange={(e) => setTone(e.target.value as Tone)}
                    className="w-full h-12 rounded-xl bg-slate-50 border-slate-100 font-bold text-xs px-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="Friendly">Friendly</option>
                    <option value="Professional">Professional</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Deadline</label>
                  <select 
                    value={dueDateType} 
                    onChange={(e) => setDueDateType(e.target.value as any)}
                    className="w-full h-12 rounded-xl bg-slate-50 border-slate-100 font-bold text-xs px-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="TODAY">Today</option>
                    <option value="24H">24 Hours</option>
                    <option value="3D">3 Days</option>
                    <option value="CUSTOM">Custom</option>
                  </select>
                </div>
              </div>

              {dueDateType === 'CUSTOM' && (
                <div className="space-y-1.5 animate-in slide-in-from-top-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Custom Date</label>
                  <Input 
                    placeholder="e.g. Next Friday" 
                    value={customDueDate} 
                    onChange={(e) => setCustomDueDate(e.target.value)}
                    className="h-12 rounded-xl bg-slate-50"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Optional Note</label>
                <Textarea 
                  placeholder="Anything else they should know?" 
                  value={optionalNote}
                  onChange={(e) => setOptionalNote(e.target.value)}
                  className="rounded-xl bg-slate-50 border-slate-100 min-h-[80px]"
                />
              </div>
            </div>

            {/* PREVIEW SECTION */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Message Preview</h4>
              
              {loadingAi ? (
                <div className="bg-slate-50 p-8 rounded-2xl flex flex-col items-center justify-center space-y-3">
                  <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Crafting Copy...</p>
                </div>
              ) : aiPreview ? (
                <div className="space-y-4 animate-in fade-in duration-500">
                  <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 space-y-2">
                    <div className="flex items-center gap-2 mb-1">
                      <Bell className="w-3 h-3 text-blue-600" />
                      <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Push Notification</span>
                    </div>
                    <p className="text-xs font-black text-slate-900">{aiPreview.pushTitle}</p>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">{aiPreview.pushBody}</p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                    <div className="flex items-center gap-2 mb-1">
                      <Mail className="w-3 h-3 text-slate-400" />
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Email Message</span>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400">Subject: {aiPreview.emailSubject}</p>
                    <p className="text-[10px] text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">{aiPreview.emailBody}</p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="p-8 bg-slate-50 border-t border-slate-100">
            <Button 
              onClick={handleSend}
              disabled={loadingAi || sending || !aiPreview}
              className="w-full h-16 rounded-[2rem] bg-slate-900 text-white font-black uppercase text-xs tracking-widest shadow-xl transition-all active:scale-95 group"
            >
              {sending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
              Send Request
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
