
"use client"

import { useState, useEffect, useMemo } from "react"
import { useAuth } from "@/app/lib/store"
import { repository } from "@/app/lib/repository"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  Camera, 
  CheckCircle2, 
  Package, 
  Check,
  Circle,
  AlertTriangle,
  Info,
  ChevronRight,
  ClipboardCheck,
  ArrowRight,
  Star,
  Trophy,
  Zap,
  Loader2
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"

type InventoryStatus = 'GOOD' | 'LOW' | 'EMPTY' | 'DAMAGE' | null;

const SUPPLY_ITEMS = ["Paper Towels", "Toilet Paper", "Hand Soap", "Garbage Bags", "Floor Cleaner"];
const ISSUE_TYPES = ["Broken dispenser", "Leaking sink", "Floor damage", "Safety concern", "Other"];

export default function WorkLogPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeShift, setActiveShift] = useState<any>(null);
  const [inventoryStatus, setInventoryStatus] = useState<InventoryStatus>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedIssueType, setSelectedIssueType] = useState<string>("");
  const [note, setNote] = useState("");
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [isShiftSubmitted, setIsShiftSubmitted] = useState(false);
  
  const [logState, setLogState] = useState({
    photos: [
      { id: 'lobby', label: 'Main Entrance', completed: true },
      { id: 'restroom', label: 'Washrooms', completed: true },
      { id: 'floors', label: 'Hallway Floors', completed: false },
      { id: 'garbage', label: 'Waste Bins', completed: false },
      { id: 'supplies', label: 'Supply Closet', completed: false },
    ],
  });

  useEffect(() => {
    if (!user) return;
    const current = repository.getShiftsForUser(user.id).find(s => s.status === 'IN_PROGRESS' || s.status === 'SCHEDULED');
    setActiveShift(current);
  }, [user]);

  const handleTakePhoto = () => {
    const nextIdx = logState.photos.findIndex(p => !p.completed);
    if (nextIdx === -1) return;

    const updatedPhotos = [...logState.photos];
    updatedPhotos[nextIdx].completed = true;
    
    setLogState(prev => ({ 
      ...prev, 
      photos: updatedPhotos,
    }));

    toast({ title: "Photo saved! ✅", description: `${updatedPhotos[nextIdx].label} looks good.` });
  };

  const handleInventoryCheckStatus = (status: InventoryStatus) => {
    setInventoryStatus(status);
    if (status === 'GOOD') {
      toast({ title: "Supplies Checked ✅", description: "Everything looks good." });
    }
  };

  const handleSubmitReport = async () => {
    setIsSubmittingReport(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({ 
      title: "Report Sent 📩", 
      description: "Your supply update has been sent to the manager." 
    });
    
    setIsSubmittingReport(false);
    // Keep status 'GOOD' context for the wrap-up
  };

  const toggleItem = (item: string) => {
    setSelectedItems(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const completedPhotosCount = logState.photos.filter(p => p.completed).length;
  const isPhotosComplete = completedPhotosCount === logState.photos.length;

  const tasks = activeShift?.tasks || [];
  const completedTasksCount = tasks.filter((t: any) => t.completed).length;
  const isTasksComplete = tasks.length > 0 && completedTasksCount === tasks.length;
  const isSuppliesDone = inventoryStatus !== null;

  const isEverythingComplete = isPhotosComplete && isTasksComplete && isSuppliesDone;

  const handleFinalSubmit = async () => {
    if (!isEverythingComplete) {
        toast({ 
            variant: "destructive", 
            title: "Wait! ⚠️", 
            description: "Please finish your photos and tasks first." 
        });
        return;
    }
    setIsSubmittingReport(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsShiftSubmitted(true);
    setIsSubmittingReport(false);
  };

  if (!activeShift && !isShiftSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center px-10 space-y-4">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
          <Camera className="w-8 h-8 text-slate-200" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-black text-slate-900">Work Log</h3>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">Please start your work to take photos and check supplies.</p>
        </div>
      </div>
    );
  }

  if (isShiftSubmitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[80vh] px-8 text-center space-y-10 py-12"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full" />
          <div className="w-24 h-24 bg-blue-600 rounded-[2.5rem] flex items-center justify-center relative z-10 shadow-2xl shadow-blue-200">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute -top-2 -right-2"
          >
            <Star className="w-8 h-8 text-[#F4B860] fill-[#F4B860]" />
          </motion.div>
        </div>

        <div className="space-y-3">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">Great job! 🎉</h2>
          <p className="text-lg font-medium text-slate-500">Shift submitted. You&apos;re all set!</p>
          <p className="text-sm font-bold text-blue-600 bg-blue-50 py-2 px-6 rounded-full inline-block">Safe travels! 🚗</p>
        </div>

        <Card className="w-full premium-card overflow-hidden text-left bg-slate-50/50">
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Site Name</p>
               <p className="text-xs font-black text-slate-900">{activeShift?.siteName}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase">Photos</p>
                <p className="text-sm font-black text-emerald-600">✅ {completedPhotosCount} Saved</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase">Tasks</p>
                <p className="text-sm font-black text-emerald-600">✅ {completedTasksCount} Done</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase">Supplies</p>
                <p className="text-sm font-black text-emerald-600">✅ Checked</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase">Points</p>
                <p className="text-sm font-black text-blue-600">+450 PTS</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button asChild className="w-full h-16 rounded-[2rem] bg-slate-900 text-white font-black uppercase text-xs tracking-widest shadow-xl shadow-slate-200">
          <Link href="/cleaner">Done</Link>
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8 pb-32 animate-in fade-in duration-700">
      <div className="px-1">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Work Log 📸</h2>
        <p className="text-sm text-slate-500 font-medium mt-2">Take pictures of your work today.</p>
      </div>

      {/* 1. Required Photos Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-end px-1">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Required Photos 📸</h3>
          <span className="text-xs font-black text-blue-600">{completedPhotosCount} / {logState.photos.length}</span>
        </div>
        
        <Card className="premium-card overflow-hidden">
          <CardContent className="p-6 space-y-6">
            <div className="grid gap-3">
              {logState.photos.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center transition-colors",
                      p.completed ? "bg-emerald-500" : "bg-slate-100"
                    )}>
                      {p.completed ? <Check className="w-3 h-3 text-white" /> : <Circle className="w-3 h-3 text-slate-300" />}
                    </div>
                    <div className="flex flex-col">
                      <span className={cn("text-sm font-bold", p.completed ? "text-slate-900" : "text-slate-400")}>{p.label}</span>
                      {p.completed && <span className="text-[8px] font-black uppercase text-emerald-500">Saved</span>}
                    </div>
                  </div>
                  {!p.completed && (
                    <div className="bg-amber-50 text-amber-600 text-[8px] font-black px-2 py-0.5 rounded-full">NOT YET</div>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-2">
              <Progress value={(completedPhotosCount / logState.photos.length) * 100} className="h-2 bg-slate-50" />
              <Button 
                onClick={handleTakePhoto}
                disabled={isPhotosComplete}
                className="w-full h-16 rounded-[2rem] btn-gradient text-lg font-black border-none"
              >
                <Camera className="w-6 h-6 mr-3" /> 
                {isPhotosComplete ? "All Photos Taken! ✅" : "Take Photo"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 2. Inventory Check Section */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Inventory Check 🧼</h3>
        <Card className="premium-card">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
                <Package className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-black text-slate-900 leading-tight">Site Supplies 🧰</p>
                <p className="text-xs font-medium text-slate-500 leading-relaxed">Let us know if you need more soap, paper, or bags.</p>
              </div>
            </div>

            {!inventoryStatus || inventoryStatus === 'GOOD' ? (
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => handleInventoryCheckStatus('GOOD')}
                  className={cn(
                    "flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all active:scale-95",
                    inventoryStatus === 'GOOD' ? "bg-emerald-50 border-emerald-500 text-emerald-700" : "bg-white border-slate-50 hover:bg-slate-50"
                  )}
                >
                  <span className="text-2xl mb-1">🟢</span>
                  <span className="text-[9px] font-black uppercase tracking-tighter">All Good</span>
                </button>
                <button 
                  onClick={() => handleInventoryCheckStatus('LOW')}
                  className="flex flex-col items-center justify-center p-5 rounded-2xl border-2 bg-white border-slate-50 hover:bg-slate-50 active:scale-95 transition-all"
                >
                  <span className="text-2xl mb-1">🟡</span>
                  <span className="text-[9px] font-black uppercase tracking-tighter">Running Low</span>
                </button>
                <button 
                  onClick={() => handleInventoryCheckStatus('EMPTY')}
                  className="flex flex-col items-center justify-center p-5 rounded-2xl border-2 bg-white border-slate-50 hover:bg-slate-50 active:scale-95 transition-all"
                >
                  <span className="text-2xl mb-1">🔴</span>
                  <span className="text-[9px] font-black uppercase tracking-tighter">Out of Stock</span>
                </button>
                <button 
                  onClick={() => handleInventoryCheckStatus('DAMAGE')}
                  className="flex flex-col items-center justify-center p-5 rounded-2xl border-2 bg-white border-slate-50 hover:bg-slate-50 active:scale-95 transition-all"
                >
                  <span className="text-2xl mb-1">⚠️</span>
                  <span className="text-[9px] font-black uppercase tracking-tighter">Report Issue</span>
                </button>
              </div>
            ) : (
              <AnimatePresence>
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "font-black uppercase text-[10px] tracking-widest px-2 py-0.5 rounded-full text-white",
                        inventoryStatus === 'LOW' ? "bg-amber-500" : "bg-red-500"
                      )}>
                        {inventoryStatus === 'LOW' ? 'LOW STOCK' : inventoryStatus === 'EMPTY' ? 'EMPTY' : 'ISSUE'}
                      </div>
                      <button onClick={() => setInventoryStatus(null)} className="text-[10px] font-black text-slate-400 uppercase underline">Change</button>
                    </div>
                  </div>

                  {(inventoryStatus === 'LOW' || inventoryStatus === 'EMPTY') && (
                    <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">What do we need? 🧼</p>
                      <div className="grid gap-2">
                        {SUPPLY_ITEMS.map(item => (
                          <div key={item} className="flex items-center gap-3">
                            <Checkbox id={item} checked={selectedItems.includes(item)} onCheckedChange={() => toggleItem(item)} />
                            <label htmlFor={item} className="text-sm font-bold text-slate-700">{item}</label>
                          </div>
                        ))}
                      </div>
                      <Textarea placeholder="Add a note here..." className="bg-white min-h-[80px]" value={note} onChange={e => setNote(e.target.value)} />
                    </div>
                  )}

                  {inventoryStatus === 'DAMAGE' && (
                    <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">What happened? ⚠️</p>
                      <div className="grid gap-2">
                        {ISSUE_TYPES.map(type => (
                          <button 
                            key={type}
                            onClick={() => setSelectedIssueType(type)}
                            className={cn(
                              "p-3 rounded-xl border text-sm font-bold text-left transition-all",
                              selectedIssueType === type ? "bg-blue-600 text-white border-blue-600" : "bg-white border-slate-100 text-slate-700"
                            )}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                      <Textarea placeholder="Describe the problem..." className="bg-white min-h-[80px]" value={note} onChange={e => setNote(e.target.value)} />
                    </div>
                  )}

                  <div className="flex flex-col gap-3">
                    <Button variant="outline" className="h-12 rounded-xl border-dashed border-slate-200 text-slate-400 font-black uppercase text-[10px]">
                      <Camera className="w-4 h-4 mr-2" /> (Optional) Add Photo
                    </Button>
                    <Button onClick={handleSubmitReport} disabled={isSubmittingReport} className="w-full h-14 rounded-2xl bg-slate-900 text-white font-black uppercase text-xs tracking-widest shadow-xl shadow-slate-200">
                      {isSubmittingReport ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Report"}
                    </Button>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 3. Wrap Up Section */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Wrap up ✅</h3>
        <Card className="premium-card bg-slate-50/50 border-none">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Camera className={cn("w-4 h-4", isPhotosComplete ? "text-emerald-500" : "text-slate-300")} />
                  <span className="text-sm font-bold text-slate-700">Photos</span>
                </div>
                <span className={cn("text-[10px] font-black uppercase", isPhotosComplete ? "text-emerald-600" : "text-amber-500")}>
                  {isPhotosComplete ? "Complete ✅" : `${completedPhotosCount}/${logState.photos.length} Taken`}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ClipboardCheck className={cn("w-4 h-4", isTasksComplete ? "text-emerald-500" : "text-slate-300")} />
                  <span className="text-sm font-bold text-slate-700">Tasks</span>
                </div>
                {isTasksComplete ? (
                    <span className="text-[10px] font-black text-emerald-600 uppercase">Complete ✅</span>
                ) : (
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-amber-500 uppercase">{tasks.length - completedTasksCount} left</span>
                        <Button asChild variant="ghost" className="h-6 px-2 text-[8px] font-black uppercase text-blue-600 hover:bg-blue-50 rounded-full underline">
                            <Link href="/cleaner/clock">View tasks</Link>
                        </Button>
                    </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className={cn("w-4 h-4", isSuppliesDone ? "text-emerald-500" : "text-slate-300")} />
                  <span className="text-sm font-bold text-slate-700">Supplies check</span>
                </div>
                <span className={cn("text-[10px] font-black uppercase", isSuppliesDone ? "text-emerald-600" : "text-amber-500")}>
                  {isSuppliesDone ? "Done ✅" : "Not done yet"}
                </span>
              </div>
            </div>

            <Button 
                onClick={handleFinalSubmit}
                disabled={isSubmittingReport}
                className={cn(
                    "w-full h-18 rounded-[2rem] text-lg font-black uppercase tracking-widest shadow-2xl transition-all active:scale-95",
                    isEverythingComplete ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200" : "bg-white border-2 border-slate-100 text-slate-400"
                )}
            >
                {isSubmittingReport ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                ) : isEverythingComplete ? (
                    <>Finish & Submit ✅</>
                ) : (
                    <>Fix missing items</>
                )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
