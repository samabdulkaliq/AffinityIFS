
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { repository } from "@/app/lib/repository";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ChevronRight, 
  MapPin, 
  Calendar, 
  User, 
  CheckCircle2, 
  AlertTriangle, 
  Search,
  ArrowLeft,
  ShieldCheck,
  Clock,
  Briefcase
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type Step = 'SITE' | 'TIME' | 'WORKER' | 'CONFIRM';

export default function AssignStaffPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [step, setStep] = useState<Step>('SITE');
  const [selectedSiteId, setSelectedSiteId] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedWorkerId, setSelectedWorkerId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const sites = repository.sites;
  const workers = repository.users.filter(u => u.role === 'CLEANER');
  
  const filteredWorkers = workers.filter(w => 
    w.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedSite = repository.getSite(selectedSiteId);
  const selectedWorker = repository.getUser(selectedWorkerId);

  // Validation Logic
  const workerConflict = selectedWorkerId ? repository.getShiftsForUser(selectedWorkerId).some(s => s.scheduledStart.startsWith(selectedDate)) : false;
  const certMissing = selectedWorker?.certifications?.some(c => c.status === 'EXPIRED') || false;

  const handleComplete = () => {
    if (!selectedSite || !selectedWorker) return;

    repository.addShift({
      id: `shift-new-${Math.random().toString(36).substring(2, 9)}`,
      userId: selectedWorkerId,
      siteId: selectedSiteId,
      siteName: selectedSite.name,
      scheduledStart: `${selectedDate}T08:00:00.000Z`,
      scheduledEnd: `${selectedDate}T16:00:00.000Z`,
      status: 'SCHEDULED',
      reviewStatus: 'NEEDS_REVIEW',
      photosRequired: 5,
      photosUploaded: 0,
      tasks: [{ id: 't1', label: 'Initial Site Check', completed: false }]
    });

    toast({ title: "Assignment Successful! ✅", description: `${selectedWorker.name} assigned to ${selectedSite.name}.` });
    router.push('/admin');
  };

  const nextStep = () => {
    if (step === 'SITE' && selectedSiteId) setStep('TIME');
    else if (step === 'TIME' && selectedDate) setStep('WORKER');
    else if (step === 'WORKER' && selectedWorkerId) setStep('CONFIRM');
  };

  const prevStep = () => {
    if (step === 'TIME') setStep('SITE');
    else if (step === 'WORKER') setStep('TIME');
    else if (step === 'CONFIRM') setStep('WORKER');
    else router.back();
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={prevStep} className="rounded-full">
          <ArrowLeft className="w-6 h-6 text-slate-400" />
        </Button>
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Assign Staff</h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">New Deployment</p>
        </div>
      </div>

      {/* Progress Pills */}
      <div className="flex gap-2 px-1">
        {(['SITE', 'TIME', 'WORKER', 'CONFIRM'] as Step[]).map((s, i) => (
          <div key={s} className={cn(
            "h-1.5 flex-1 rounded-full transition-all duration-500",
            step === s ? "bg-blue-600" : i < ['SITE', 'TIME', 'WORKER', 'CONFIRM'].indexOf(step) ? "bg-blue-200" : "bg-slate-100"
          )} />
        ))}
      </div>

      <div className="min-h-[400px]">
        {step === 'SITE' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest px-1">Select Work Site</h3>
            <div className="grid gap-3">
              {sites.map(site => (
                <Card 
                  key={site.id} 
                  onClick={() => setSelectedSiteId(site.id)}
                  className={cn(
                    "border-2 transition-all cursor-pointer rounded-[1.5rem] overflow-hidden",
                    selectedSiteId === site.id ? "border-blue-600 bg-blue-50/30" : "border-transparent bg-white shadow-sm hover:border-slate-100"
                  )}
                >
                  <CardContent className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", selectedSiteId === site.id ? "bg-blue-600 text-white" : "bg-slate-50 text-slate-400")}>
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 text-sm">{site.name}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">{site.address}</p>
                      </div>
                    </div>
                    {selectedSiteId === site.id && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {step === 'TIME' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest px-1">Scheduling</h3>
            <Card className="border-none shadow-sm rounded-[2rem] bg-white p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Shift Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    type="date" 
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="h-14 pl-12 rounded-2xl border-slate-100 bg-slate-50/50 font-bold"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Shift Template</label>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-14 rounded-2xl border-2 border-blue-100 bg-blue-50/30 text-blue-600 font-bold">Day (08:00 - 16:00)</Button>
                  <Button variant="outline" className="h-14 rounded-2xl border-2 border-slate-50 text-slate-400 font-bold">Night (22:00 - 06:00)</Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {step === 'WORKER' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="px-1 flex justify-between items-center">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Select Staff</h3>
              <Badge className="bg-slate-900 text-white text-[10px]">{filteredWorkers.length} Available</Badge>
            </div>
            
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search by name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 pl-12 rounded-2xl border-none shadow-sm bg-white font-medium"
              />
            </div>

            <div className="grid gap-2">
              {filteredWorkers.map(worker => (
                <Card 
                  key={worker.id}
                  onClick={() => setSelectedWorkerId(worker.id)}
                  className={cn(
                    "border-2 transition-all cursor-pointer rounded-[1.5rem] overflow-hidden",
                    selectedWorkerId === worker.id ? "border-blue-600 bg-blue-50/30" : "border-transparent bg-white shadow-sm"
                  )}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12 border-2 border-white shadow-sm">
                        <AvatarImage src={worker.avatarUrl} />
                        <AvatarFallback>{worker.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-black text-slate-900 text-sm">{worker.name}</h4>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">{worker.workerType} • {worker.points} PTS</p>
                      </div>
                    </div>
                    {selectedWorkerId === worker.id && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {step === 'CONFIRM' && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest px-1">Assignment Summary</h3>
            <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
              <CardHeader className="bg-slate-900 text-white p-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                    <Briefcase className="w-7 h-7 text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-black">Verify Details</CardTitle>
                    <CardDescription className="text-slate-400 font-bold uppercase text-[10px]">Staff Deployment</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="grid gap-6">
                  <div className="flex items-start gap-4">
                    <MapPin className="w-5 h-5 text-blue-500 shrink-0 mt-1" />
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase">Site</p>
                      <p className="text-base font-bold text-slate-900">{selectedSite?.name}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Calendar className="w-5 h-5 text-emerald-500 shrink-0 mt-1" />
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase">Schedule</p>
                      <p className="text-base font-bold text-slate-900">{new Date(selectedDate).toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                      <p className="text-xs font-bold text-slate-500">08:00 AM – 16:00 PM</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <User className="w-5 h-5 text-indigo-500 shrink-0 mt-1" />
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase">Worker</p>
                      <p className="text-base font-bold text-slate-900">{selectedWorker?.name}</p>
                    </div>
                  </div>
                </div>

                {/* Warnings Section */}
                {(workerConflict || certMissing) && (
                  <div className="space-y-2 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                    <p className="text-[10px] font-black text-amber-600 uppercase flex items-center gap-2">
                      <AlertTriangle className="w-3 h-3" /> Compliance Warnings
                    </p>
                    <ul className="space-y-1">
                      {workerConflict && <li className="text-xs font-bold text-amber-700">• Schedule conflict detected for this date</li>}
                      {certMissing && <li className="text-xs font-bold text-amber-700">• Required Safety Training is expired</li>}
                    </ul>
                    <p className="text-[9px] font-medium text-amber-500 mt-2 italic">Manager override will be documented.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-slate-50/80 backdrop-blur-lg border-t border-slate-100 z-50">
        <Button 
          onClick={step === 'CONFIRM' ? handleComplete : nextStep}
          disabled={
            (step === 'SITE' && !selectedSiteId) ||
            (step === 'TIME' && !selectedDate) ||
            (step === 'WORKER' && !selectedWorkerId)
          }
          className="w-full h-16 bg-slate-900 hover:bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-slate-200 transition-all active:scale-95 group"
        >
          {step === 'CONFIRM' ? "Confirm Assignment" : "Continue"}
          <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
}
