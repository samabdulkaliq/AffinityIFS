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
  Upload,
  AlertCircle,
  AlertTriangle,
  Circle,
  Check,
  ChevronRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

/**
 * @fileOverview Redesigned Work Log 📸.
 * Focuses on purposeful verification and quick inventory reporting.
 */

type InventoryStatus = 'GOOD' | 'LOW' | 'EMPTY' | 'DAMAGE' | null;

export default function WorkLogPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeShift, setActiveShift] = useState<any>(null);
  const [inventoryStatus, setInventoryStatus] = useState<InventoryStatus>(null);
  
  const [logState, setLogState] = useState({
    photos: [
      { id: 'lobby', label: 'Lobby', completed: true },
      { id: 'restroom', label: 'Restroom', completed: true },
      { id: 'floors', label: 'Floors', completed: false },
      { id: 'garbage', label: 'Garbage', completed: false },
      { id: 'supplies', label: 'Supply Room', completed: false },
    ],
    lastPhotoStatus: null as 'SAVED' | 'BLURRY' | 'OFFSITE' | null,
  });

  useEffect(() => {
    if (!user) return;
    const current = repository.getShiftsForUser(user.id).find(s => s.status === 'IN_PROGRESS' || s.status === 'SCHEDULED');
    setActiveShift(current);
  }, [user]);

  const handleTakePhoto = () => {
    // Mocking logic: find first uncompleted and complete it
    const nextIdx = logState.photos.findIndex(p => !p.completed);
    if (nextIdx === -1) {
       toast({ title: "All required photos uploaded 🎉" });
       return;
    }

    const updatedPhotos = [...logState.photos];
    updatedPhotos[nextIdx].completed = true;
    
    setLogState(prev => ({ 
      ...prev, 
      photos: updatedPhotos,
      lastPhotoStatus: 'SAVED'
    }));

    toast({ title: "Photo saved ✅", description: `${updatedPhotos[nextIdx].label} verification complete.` });
    
    // Auto clear status
    setTimeout(() => setLogState(p => ({ ...p, lastPhotoStatus: null })), 3000);
  };

  const handleInventoryCheck = (status: InventoryStatus) => {
    setInventoryStatus(status);
    let msg = "All Good - Synchronized with management.";
    if (status === 'LOW' || status === 'EMPTY' || status === 'DAMAGE') {
      msg = "Low Stock / Issue reported to supervisor.";
    }
    toast({ title: "Inventory check complete 🧾", description: msg });
  };

  const completedCount = logState.photos.filter(p => p.completed).length;
  const isAllComplete = completedCount === logState.photos.length;

  if (!activeShift) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center px-10 space-y-4">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
          <Camera className="w-8 h-8 text-slate-200" />
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-900">Work Log</h3>
          <p className="text-sm text-slate-500 font-medium">Please start a shift to begin logging photos.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-32 animate-in fade-in duration-700">
      <div className="px-1">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Work Log 📸</h2>
        <p className="text-sm text-slate-500 font-medium mt-2">Purposeful site verification.</p>
      </div>

      {/* Photo Progress */}
      <div className="space-y-4">
        <div className="flex justify-between items-end px-1">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Photo Progress</h3>
          <span className="text-xs font-black text-primary">{completedCount} of {logState.photos.length} Done</span>
        </div>
        
        <Card className="premium-card overflow-hidden">
          <CardContent className="p-6 space-y-6">
            <div className="grid gap-3">
              {logState.photos.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center",
                      p.completed ? "bg-emerald-500" : "bg-slate-100"
                    )}>
                      {p.completed ? <Check className="w-3 h-3 text-white" /> : <Circle className="w-3 h-3 text-slate-300" />}
                    </div>
                    <span className={cn("text-sm font-bold", p.completed ? "text-slate-900" : "text-slate-400")}>{p.label}</span>
                  </div>
                  {p.completed && <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-none text-[8px] font-black">VERIFIED</Badge>}
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-2">
              <Progress value={(completedCount / logState.photos.length) * 100} className="h-2 bg-slate-50" />
              
              <AnimatePresence>
                {logState.lastPhotoStatus && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center gap-2 p-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest"
                  >
                    <CheckCircle2 className="w-3 h-3" /> Photo saved ✅
                  </motion.div>
                )}
              </AnimatePresence>

              <Button 
                onClick={handleTakePhoto}
                disabled={isAllComplete}
                className="w-full h-16 rounded-[2rem] btn-gradient text-lg font-black border-none"
              >
                <Camera className="w-6 h-6 mr-3" /> 
                {isAllComplete ? "All Photos Done 🎉" : "Take Photo"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Section */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Inventory Check 🧾</h3>
        <Card className="premium-card">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
                <Package className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-black text-slate-900 leading-tight">Site Supplies</p>
                <p className="text-xs font-medium text-slate-500 leading-relaxed">Check current inventory levels.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => handleInventoryCheck('GOOD')}
                className={cn(
                  "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all",
                  inventoryStatus === 'GOOD' ? "bg-emerald-50 border-emerald-500" : "bg-white border-slate-50 hover:bg-slate-50"
                )}
              >
                <span className="text-xl mb-1">🟢</span>
                <span className="text-[9px] font-black uppercase tracking-tighter">All Good</span>
              </button>
              <button 
                onClick={() => handleInventoryCheck('LOW')}
                className={cn(
                  "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all",
                  inventoryStatus === 'LOW' ? "bg-amber-50 border-amber-500" : "bg-white border-slate-50 hover:bg-slate-50"
                )}
              >
                <span className="text-xl mb-1">🟡</span>
                <span className="text-[9px] font-black uppercase tracking-tighter">Low Stock</span>
              </button>
              <button 
                onClick={() => handleInventoryCheck('EMPTY')}
                className={cn(
                  "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all",
                  inventoryStatus === 'EMPTY' ? "bg-red-50 border-red-500" : "bg-white border-slate-50 hover:bg-slate-50"
                )}
              >
                <span className="text-xl mb-1">🔴</span>
                <span className="text-[9px] font-black uppercase tracking-tighter">Empty</span>
              </button>
              <button 
                onClick={() => handleInventoryCheck('DAMAGE')}
                className={cn(
                  "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all",
                  inventoryStatus === 'DAMAGE' ? "bg-orange-50 border-orange-500" : "bg-white border-slate-50 hover:bg-slate-50"
                )}
              >
                <span className="text-xl mb-1">⚠️</span>
                <span className="text-[9px] font-black uppercase tracking-tighter">Report Issue</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Completion Warning */}
      {!isAllComplete && (
        <div className="px-1">
          <div className="bg-red-50 p-4 rounded-2xl border border-red-100 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-[9px] font-black text-red-600 uppercase tracking-widest">Incomplete Verification</p>
              <p className="text-xs font-medium text-red-900/70">You still need {logState.photos.length - completedCount} photos before ending your shift.</p>
              <button className="text-[9px] font-black text-red-600 uppercase underline mt-2 block">
                Finish Anyway (Manager Review Required)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const Badge = ({ children, variant, className }: any) => (
  <div className={cn("px-2 py-0.5 rounded-full", className)}>{children}</div>
);
