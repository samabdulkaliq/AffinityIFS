"use client";

import { repository } from "@/app/lib/repository";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  XCircle,
  AlertCircle,
  FileText
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * @fileOverview Time Review Inbox.
 * Lists all operational exceptions requiring manager validation.
 */

export default function AdminApprovalsPage() {
  const requests = repository.getReviewRequests().sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-24">
      <div className="px-1 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Time Review</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Compliance Queue</p>
        </div>
        <Badge variant="outline" className="border-slate-200 text-slate-400 font-bold px-3">
          {requests.filter(r => r.status === 'PENDING').length} ACTION
        </Badge>
      </div>

      <div className="space-y-3">
        {requests.map((request) => (
          <Link key={request.id} href={`/admin/approvals/${request.id}`} className="block group">
            <Card className="border-none shadow-sm hover:shadow-md transition-all active:scale-[0.99] rounded-[1.5rem] bg-white overflow-hidden">
              <div className="flex items-stretch min-h-[100px]">
                <div className={cn(
                  "w-1.5",
                  request.status === 'PENDING' ? "bg-amber-400" : "bg-emerald-500"
                )} />
                <CardContent className="flex-1 p-5 flex items-center justify-between">
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-slate-50",
                      request.status === 'PENDING' ? "bg-amber-50 text-amber-500" : "bg-emerald-50 text-emerald-500"
                    )}>
                      {request.status === 'PENDING' ? <AlertCircle className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <h4 className="font-black text-slate-900 text-sm leading-tight">{request.cleanerName}</h4>
                            <Badge className="bg-slate-100 text-slate-500 text-[8px] font-black uppercase px-2">{request.reason}</Badge>
                        </div>
                        <p className="text-xs text-slate-500 italic line-clamp-1 leading-relaxed">"{request.note}"</p>
                        <div className="flex items-center gap-2 pt-1">
                            <Clock className="w-3 h-3 text-slate-300" />
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                                Recieved {new Date(request.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                            </span>
                        </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-blue-500" />
                </CardContent>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {requests.length === 0 && (
        <div className="py-24 text-center space-y-4">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto border border-slate-100">
            <CheckCircle2 className="w-10 h-10 text-slate-200" />
          </div>
          <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Inbox Zero</p>
        </div>
      )}
    </div>
  );
}