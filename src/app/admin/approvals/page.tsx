"use client";

import { repository } from "@/app/lib/repository";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ChevronRight, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  XCircle,
  Calendar,
  User
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function AdminApprovalsPage() {
  const requests = repository.getReviewRequests().sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="px-1 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Time Review</h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Pending Approvals</p>
        </div>
        <Badge variant="outline" className="border-slate-200 text-slate-500 font-bold">
          {requests.filter(r => r.status === 'PENDING').length} Active
        </Badge>
      </div>

      <div className="space-y-3">
        {requests.map((request) => (
          <Link key={request.id} href={`/admin/approvals/${request.id}`} className="block group">
            <Card className="border-none shadow-sm hover:shadow-md transition-all active:scale-[0.99] rounded-[1.5rem] overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-stretch">
                  {/* Status Indicator Bar */}
                  <div className={cn(
                    "w-1.5",
                    request.status === 'PENDING' ? "bg-amber-400" :
                    request.status === 'APPROVED' ? "bg-emerald-500" :
                    "bg-red-500"
                  )} />
                  
                  <div className="flex-1 p-5 flex items-center justify-between">
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                        request.status === 'PENDING' ? "bg-amber-50 text-amber-600" :
                        request.status === 'APPROVED' ? "bg-emerald-50 text-emerald-600" :
                        "bg-red-50 text-red-600"
                      )}>
                        {request.status === 'PENDING' ? <Clock className="w-6 h-6" /> :
                         request.status === 'APPROVED' ? <CheckCircle2 className="w-6 h-6" /> :
                         <XCircle className="w-6 h-6" />}
                      </div>
                      
                      <div className="space-y-1">
                        <h3 className="text-base font-bold text-slate-900 leading-tight">
                          {request.cleanerName}
                        </h3>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="bg-slate-100 text-slate-600 text-[10px] font-black uppercase px-2 py-0">
                            {request.reason}
                          </Badge>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                            {new Date(request.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1 italic mt-1">
                          "{request.note}"
                        </p>
                      </div>
                    </div>
                    
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {requests.length === 0 && (
        <div className="py-20 text-center space-y-4">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8 text-slate-300" />
          </div>
          <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Inbox Zero</p>
        </div>
      )}
    </div>
  );
}