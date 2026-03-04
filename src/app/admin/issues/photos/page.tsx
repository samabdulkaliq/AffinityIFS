
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { repository } from "@/app/lib/repository";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Camera, 
  User, 
  CheckCircle2, 
  AlertTriangle,
  Image as ImageIcon,
  MessageSquare
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function MissingPhotosQueue() {
  const router = useRouter();
  const { toast } = useToast();
  const [shifts, setShifts] = useState(repository.getMissingPhotoShifts());

  const handleResolve = (id: string) => {
    repository.updateShift(id, { photosUploaded: 5 }); // Simulate resolution
    setShifts(repository.getMissingPhotoShifts());
    toast({ title: "Issue Resolved", description: "Documentation verified manually." });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-24">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
          <ArrowLeft className="w-6 h-6 text-slate-400" />
        </Button>
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Photo Evidence</h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Documentation Compliance</p>
        </div>
      </div>

      <div className="space-y-4">
        {shifts.length > 0 ? shifts.map((shift) => {
          const worker = repository.getUser(shift.userId);
          return (
            <Card key={shift.id} className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden group">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500">
                      <Camera className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 leading-none">{worker?.name}</h4>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{shift.siteName}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-red-100 text-red-600 bg-red-50/30 font-black text-[10px]">
                    {shift.photosUploaded}/{shift.photosRequired} SAVED
                  </Badge>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-white border border-slate-100 flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-slate-200" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-700 italic">"Shift incomplete - washroom photos missing."</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase">System Flag • Today</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-14 rounded-2xl border-2 font-black uppercase text-[10px] tracking-widest">
                    <MessageSquare className="w-4 h-4 mr-2" /> Request
                  </Button>
                  <Button 
                    onClick={() => handleResolve(shift.id)}
                    className="h-14 rounded-2xl bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest shadow-xl shadow-slate-200"
                  >
                    Manually Resolve
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        }) : (
          <div className="py-24 text-center space-y-4">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
              <Camera className="w-10 h-10 text-slate-200" />
            </div>
            <p className="text-slate-400 font-black text-xs uppercase tracking-widest">All Photos Uploaded</p>
          </div>
        )}
      </div>
    </div>
  );
}
