
"use client";

import { useState, useMemo } from "react";
import { repository } from "@/app/lib/repository";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Filter, 
  ChevronRight, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ShieldCheck,
  Smartphone,
  Mail,
  MoreVertical
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

/**
 * @fileOverview Staff Directory.
 * Lists all field staff with certification tracking and filtering.
 */

export default function AdminWorkersPage() {
  const searchParams = useSearchParams();
  const initialFilter = searchParams.get('filter') || 'ALL';
  
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>(initialFilter);

  const workers = repository.users.filter(u => u.role === 'CLEANER');

  const filteredWorkers = useMemo(() => {
    return workers.filter(worker => {
      const matchesSearch = worker.name.toLowerCase().includes(search.toLowerCase()) || 
                            worker.email.toLowerCase().includes(search.toLowerCase());
      
      const hasCertStatus = (status: string) => worker.certifications?.some(c => c.status === status);
      
      let matchesFilter = true;
      if (filter === 'VALID') matchesFilter = worker.certifications?.every(c => c.status === 'VALID') ?? false;
      if (filter === 'EXPIRING') matchesFilter = hasCertStatus('EXPIRING');
      if (filter === 'EXPIRED') matchesFilter = hasCertStatus('EXPIRED');

      return matchesSearch && matchesFilter;
    });
  }, [workers, search, filter]);

  const getOverallCertStatus = (worker: any) => {
    if (worker.certifications?.some((c: any) => c.status === 'EXPIRED')) return 'EXPIRED';
    if (worker.certifications?.some((c: any) => c.status === 'EXPIRING')) return 'EXPIRING';
    return 'VALID';
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="px-1 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Staff Directory</h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Field Workforce Directory</p>
        </div>
        <div className="flex gap-2">
            <Badge variant="outline" className="bg-white border-slate-200 text-slate-400 font-black px-3 py-1">
                {workers.length} TOTAL
            </Badge>
        </div>
      </div>

      <div className="flex gap-3 px-1">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search staff by name..." 
            className="h-14 pl-12 rounded-2xl border-none shadow-sm bg-white font-medium focus-visible:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-14 w-14 rounded-2xl border-none shadow-sm bg-white hover:bg-slate-50">
          <Filter className="w-5 h-5 text-slate-500" />
        </Button>
      </div>

      <div className="flex gap-2 px-1 overflow-x-auto pb-2 scrollbar-hide">
        {['ALL', 'VALID', 'EXPIRING', 'EXPIRED'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={cn(
              "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-2",
              filter === s 
                ? "bg-slate-900 border-slate-900 text-white shadow-lg" 
                : "bg-white border-transparent text-slate-400 hover:bg-slate-50"
            )}
          >
            {s === 'EXPIRING' ? 'EXPIRING SOON' : s}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {filteredWorkers.map((worker) => {
          const status = getOverallCertStatus(worker);
          return (
            <Card key={worker.id} className="border-none shadow-sm hover:shadow-md transition-all rounded-[2rem] overflow-hidden group">
              <CardContent className="p-0">
                <div className="flex items-stretch min-h-[120px]">
                  <div className={cn(
                    "w-2",
                    status === 'VALID' ? "bg-emerald-400" :
                    status === 'EXPIRING' ? "bg-amber-400" :
                    "bg-red-500"
                  )} />
                  <div className="flex-1 p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar className="w-16 h-16 border-4 border-white shadow-sm group-hover:scale-105 transition-transform">
                          <AvatarImage src={worker.avatarUrl} />
                          <AvatarFallback>{worker.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className={cn(
                          "absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center shadow-sm",
                          status === 'VALID' ? "bg-emerald-500" :
                          status === 'EXPIRING' ? "bg-amber-500" :
                          "bg-red-500"
                        )}>
                          {status === 'VALID' ? <ShieldCheck className="w-3.5 h-3.5 text-white" /> :
                           status === 'EXPIRING' ? <AlertTriangle className="w-3.5 h-3.5 text-white" /> :
                           <XCircle className="w-3.5 h-3.5 text-white" />}
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <h3 className="text-lg font-black text-slate-900 leading-none">{worker.name}</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{worker.workerType} Operation • ID {worker.id.split('-')[1]}</p>
                        <div className="flex items-center gap-3 pt-1">
                          <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400">
                            <Mail className="w-3 h-3" /> {worker.email}
                          </div>
                          <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400">
                            <Smartphone className="w-3 h-3" /> {worker.phone}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-start sm:items-end gap-3 w-full sm:w-auto">
                      <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
                        {worker.certifications?.map((cert, idx) => (
                          <Badge key={idx} variant="outline" className={cn(
                            "px-2 py-0.5 text-[8px] font-black uppercase border-2",
                            cert.status === 'VALID' ? "border-emerald-50 text-emerald-500" :
                            cert.status === 'EXPIRING' ? "border-amber-50 text-amber-500" :
                            "border-red-50 text-red-500"
                          )}>
                            {cert.name}
                          </Badge>
                        ))}
                      </div>
                      <Button variant="ghost" size="sm" className="w-full sm:w-auto rounded-xl hover:bg-slate-50 text-[10px] font-black uppercase text-slate-400 group-hover:text-blue-500">
                        View Profile <ChevronRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {filteredWorkers.length === 0 && (
          <div className="py-24 text-center space-y-4 bg-white/50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
            <Users className="w-12 h-12 text-slate-200 mx-auto" />
            <p className="text-slate-400 font-black text-xs uppercase tracking-widest">No staff found</p>
          </div>
        )}
      </div>
    </div>
  );
}
