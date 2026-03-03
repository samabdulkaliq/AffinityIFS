
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/lib/store";
import { repository } from "@/app/lib/repository";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Camera, 
  CheckCircle2, 
  Package, 
  History,
  Upload
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { OnboardingTooltip } from "@/app/components/ui/onboarding-tooltip";

export default function FieldOpsLogPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeShift, setActiveShift] = useState<any>(null);
  
  const [logs, setLogs] = useState({
    supplyLogged: false,
    photosCount: 2,
  });

  useEffect(() => {
    if (!user) return;
    const shifts = repository.getShiftsForUser(user.id);
    const current = shifts.find(s => s.status === 'IN_PROGRESS' || s.status === 'SCHEDULED');
    setActiveShift(current);
  }, [user]);

  const handlePhotoUpload = () => {
    setLogs(prev => ({
      ...prev,
      photosCount: Math.min(prev.photosCount + 1, 5),
    }));
    localStorage.setItem("affinity_tooltip_photos_seen", "true");
    toast({ title: "Photo uploaded", description: "This has been added to your shift." });
  };

  const handleSupplyAudit = () => {
    setLogs(prev => ({ ...prev, supplyLogged: true }));
    toast({ title: "Inventory checked", description: "Thank you for the update." });
  };

  if (!activeShift) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center px-10 space-y-4">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
          <History className="w-8 h-8 text-slate-200" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900">Shift Photos</h3>
          <p className="text-sm text-slate-500 font-medium">Photos can only be uploaded while you are on shift.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-32 animate-in fade-in duration-700">
      <div className="px-1">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Shift Photos</h2>
        <p className="text-sm text-slate-500 font-medium mt-2">Update your progress and inventory.</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 px-1">Photo Progress</h3>
        
        <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden">
          <CardContent className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-3xl font-black text-slate-900 leading-none">{logs.photosCount} of 5</p>
                <p className="text-sm text-slate-500 font-medium">Photos uploaded</p>
              </div>
              <div className="flex -space-x-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-12 h-12 rounded-2xl border-2 border-white bg-slate-100 overflow-hidden shadow-sm">
                    <img src={`https://picsum.photos/seed/doc${i}/100/100`} alt="Preview" className="w-full h-full object-cover opacity-80" />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Progress value={(logs.photosCount / 5) * 100} className="h-2 bg-slate-100" />
            </div>

            <div className="relative">
              <OnboardingTooltip 
                text="Upload photos to show your work 📷" 
                storageKey="affinity_tooltip_photos_seen" 
                isVisible={true}
              />
              <Button 
                onClick={handlePhotoUpload}
                className="w-full h-16 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-200 active:scale-95 transition-all border-none"
              >
                <Camera className="w-6 h-6 mr-3" /> Upload Photo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 px-1">Inventory Check</h3>
        <Card className={cn(
          "border-none shadow-sm rounded-[2rem] transition-all overflow-hidden",
          logs.supplyLogged ? "bg-emerald-50/50 border-emerald-100" : "bg-white"
        )}>
          <CardContent className="p-6">
            <div className="flex gap-5 mb-6">
              <div className={cn(
                "w-16 h-16 rounded-[1.5rem] flex items-center justify-center border-2 transition-all",
                logs.supplyLogged ? "bg-white border-emerald-200 text-emerald-500" : "bg-slate-50 border-slate-100 text-slate-300"
              )}>
                {logs.supplyLogged ? <CheckCircle2 className="w-8 h-8" /> : <Package className="w-8 h-8" />}
              </div>
              <div className="flex-1 space-y-1">
                <h4 className="text-base font-bold text-slate-900">Supply Review</h4>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  Check supplies and report issues.
                </p>
              </div>
            </div>
            <Button 
              onClick={handleSupplyAudit}
              disabled={logs.supplyLogged}
              className={cn(
                "w-full h-16 rounded-2xl font-bold transition-all border-none shadow-md",
                logs.supplyLogged 
                  ? "bg-emerald-500 text-white" 
                  : "bg-slate-900 text-white hover:bg-slate-800"
              )}
            >
              {logs.supplyLogged ? (
                <><CheckCircle2 className="w-5 h-5 mr-2" /> All checked</>
              ) : (
                <><Upload className="w-5 h-5 mr-2" /> Run Inventory Check</>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
