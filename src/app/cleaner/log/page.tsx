
"use client"

import { useState, useEffect } from "react"
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
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"

type InventoryStatus = 'GOOD' | 'LOW' | 'EMPTY' | 'DAMAGE' | null;

const INVENTORY_ITEMS = ["Paper Towels", "Toilet Paper", "Hand Soap", "Garbage Bags", "Floor Cleaner"];
const ISSUE_TYPES = ["Broken dispenser", "Leaking sink", "Floor damage", "Safety concern", "Other"];

export default function WorkLogPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeShift, setActiveShift] = useState<any>(null);
  const [inventoryStatus, setInventoryStatus] = useState<InventoryStatus>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedIssueType, setSelectedIssueType] = useState<string>("");
  const [note, setNote] = useState("");
  
  const [logState, setLogState] = useState({
    photos: [
      { id: 'lobby', label: 'Main Entrance', completed: true },
      { id: 'restroom', label: 'Washrooms', completed: true },
      { id: 'floors', label: 'Hallway Floors', completed: false },
      { id: 'garbage', label: 'Waste Bins', completed: false },
      { id: 'supplies', label: 'Supply Closet', completed: false },
    ],
    lastPhotoStatus: null as 'SAVED' | 'BLURRY' | 'OFFSITE' | null,
  });

  useEffect(() => {
    if (!user) return;
    const current = repository.getShiftsForUser(user.id).find(s => s.status === 'IN_PROGRESS' || s.status === 'SCHEDULED');
    setActiveShift(current);
  }, [user]);

  const handleTakePhoto = () => {
    const nextIdx = logState.photos.findIndex(p => !p.completed);
    if (nextIdx === -1) {
       toast({ title: "All photos done! 🎉" });
       return;
    }

    const updatedPhotos = [...logState.photos];
    updatedPhotos[nextIdx].completed = true;
    
    setLogState(prev => ({ 
      ...prev, 
      photos: updatedPhotos,
      lastPhotoStatus: 'SAVED'
    }));

    toast({ title: "Photo saved! ✅", description: `${updatedPhotos[nextIdx].label} is finished.` });
    setTimeout(() => setLogState(p => ({ ...p, lastPhotoStatus: null })), 3000);
  };

  const handleInventoryCheckStatus = (status: InventoryStatus) => {
    setInventoryStatus(status);
    if (status === 'GOOD') {
      toast({ title: "Supplies are Good", description: "Saved your update." });
    }
  };

  const handleSubmitInventory = () => {
    toast({ 
      title: "Report Sent", 
      description: inventoryStatus === 'GOOD' ? "Everything is saved." : "Your message has been sent to the manager." 
    });
    setInventoryStatus(null);
    setSelectedItems([]);
    setSelectedIssueType("");
    setNote("");
  };

  const toggleItem = (item: string) => {
    setSelectedItems(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
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
          <h3 className="text-xl font-black text-slate-900">Work Photos</h3>
          <p className="text-sm text-slate-500 font-medium">Please start work to take your photos.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-32 animate-in fade-in duration-700">
      <div className="px-1">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Work Log 📸</h2>
        <p className="text-sm text-slate-500 font-medium mt-2">Take pictures of your work today.</p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-end px-1">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Required Photos 📸</h3>
          <span className="text-xs font-black text-blue-600">{completedCount} / {logState.photos.length}</span>
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
                      {p.completed && <span className="text-[8px] font-black uppercase text-emerald-500">Done</span>}
                    </div>
                  </div>
                  {!p.completed && (
                    <div className="bg-amber-50 text-amber-600 text-[8px] font-black px-2 py-0.5 rounded-full">NOT YET</div>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-2">
              <Progress value={(completedCount / logState.photos.length) * 100} className="h-2 bg-slate-50" />
              <Button 
                onClick={handleTakePhoto}
                disabled={isAllComplete}
                className="w-full h-16 rounded-[2rem] btn-gradient text-lg font-black border-none"
              >
                <Camera className="w-6 h-6 mr-3" /> 
                {isAllComplete ? "All Photos Taken! 🎉" : "Take Photo"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Supplies Check 🧾</h3>
        <Card className="premium-card">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
                <Package className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-black text-slate-900 leading-tight">Site Supplies</p>
                <p className="text-xs font-medium text-slate-500 leading-relaxed">Let us know if you need more soap, paper, or bags.</p>
              </div>
            </div>

            {!inventoryStatus ? (
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => handleInventoryCheckStatus('GOOD')}
                  className="flex flex-col items-center justify-center p-5 rounded-2xl border-2 bg-white border-slate-50 hover:bg-slate-50 active:scale-95 transition-all"
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
                  <span className="text-[9px] font-black uppercase tracking-tighter">Report Problem</span>
                </button>
              </div>
            ) : (
              <AnimatePresence>
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "font-black uppercase text-[10px] tracking-widest px-2 py-0.5 rounded-full text-white",
                        inventoryStatus === 'GOOD' ? "bg-emerald-500" :
                        inventoryStatus === 'LOW' ? "bg-amber-500" :
                        "bg-red-500"
                      )}>
                        {inventoryStatus === 'GOOD' ? 'OK' : inventoryStatus === 'LOW' ? 'LOW' : 'ISSUE'}
                      </div>
                      <button onClick={() => setInventoryStatus(null)} className="text-[10px] font-black text-slate-400 uppercase underline">Change</button>
                    </div>
                  </div>

                  {(inventoryStatus === 'LOW' || inventoryStatus === 'EMPTY') && (
                    <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">What do we need?</p>
                      <div className="grid gap-2">
                        {INVENTORY_ITEMS.map(item => (
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
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">What happened?</p>
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

                  {inventoryStatus === 'GOOD' && (
                    <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      <p className="text-sm font-medium text-emerald-700">Everything is okay.</p>
                    </div>
                  )}

                  <Button onClick={handleSubmitInventory} className="w-full h-14 rounded-2xl bg-slate-900 text-white font-black uppercase text-xs tracking-widest shadow-xl shadow-slate-200">
                    Submit Report
                  </Button>
                </motion.div>
              </AnimatePresence>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
