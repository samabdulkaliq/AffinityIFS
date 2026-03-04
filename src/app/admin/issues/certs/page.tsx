
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { repository } from "@/app/lib/repository";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ArrowLeft, 
  ShieldAlert, 
  Mail, 
  CheckCircle2, 
  ExternalLink,
  Calendar,
  AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CertificationQueue() {
  const router = useRouter();
  const { toast } = useToast();
  const [workers, setWorkers] = useState(repository.getWorkersWithExpiredCerts());

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
        {workers.length > 0 ? workers.map((worker) => (
          <Card key={worker.id} className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden group">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={worker.avatarUrl} />
                    <AvatarFallback>{worker.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-black text-slate-900 leading-none">{worker.name}</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">ID {worker.id.split('-')[1]}</p>
                  </div>
                </div>
                <Badge className="bg-red-50 text-red-600 border-none font-black text-[10px] px-3">EXPIRED</Badge>
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

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-14 rounded-2xl border-2 font-black uppercase text-[10px] tracking-widest">
                  <Mail className="w-4 h-4 mr-2" /> Request Docs
                </Button>
                <Button 
                  onClick={() => handleResolve(worker.id)}
                  className="h-14 rounded-2xl bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest shadow-xl shadow-slate-200"
                >
                  Confirm Training
                </Button>
              </div>
            </CardContent>
          </Card>
        )) : (
          <div className="py-24 text-center space-y-4">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-emerald-200" />
            </div>
            <p className="text-slate-400 font-black text-xs uppercase tracking-widest">All Staff Compliant</p>
          </div>
        )}
      </div>
    </div>
  );
}
