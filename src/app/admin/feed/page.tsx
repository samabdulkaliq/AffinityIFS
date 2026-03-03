"use client";

import { repository } from "@/app/lib/repository";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Clock, 
  MapPin, 
  Camera, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronRight,
  Activity,
  Zap,
  Coffee,
  MoreVertical
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

/**
 * @fileOverview Live Operations Feed (Pulse).
 * A chronological audit trail of all field activity for administrators.
 */

export default function AdminFeedPage() {
  const events = repository.getAllEvents();

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'CLOCK_IN': return <Zap className="w-4 h-4 text-emerald-500" />;
      case 'CLOCK_OUT': return <CheckCircle2 className="w-4 h-4 text-blue-500" />;
      case 'BREAK_START': return <Coffee className="w-4 h-4 text-amber-500" />;
      case 'BREAK_END': return <Zap className="w-4 h-4 text-emerald-500" />;
      default: return <Activity className="w-4 h-4 text-slate-400" />;
    }
  };

  const getEventLabel = (type: string) => {
    return type.replace('_', ' ');
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-24">
      <div className="px-1 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Live Pulse</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Real-Time Field Audit</p>
        </div>
        <Badge className="bg-blue-600 text-white font-black border-none px-3 py-1">
          <Activity className="w-3 h-3 mr-1.5 animate-pulse" /> LIVE STREAM
        </Badge>
      </div>

      <div className="relative">
        {/* Timeline Path */}
        <div className="absolute left-[27px] top-4 bottom-0 w-0.5 bg-slate-100 hidden sm:block" />

        <div className="space-y-6">
          {events.map((event, index) => {
            const user = repository.getUser(event.userId);
            const site = repository.sites.find(s => s.id === (repository.getShift(event.shiftId)?.siteId || 'site-1'));

            return (
              <motion.div 
                key={event.id}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="relative flex items-start gap-4"
              >
                {/* Visual Connector for Desktop */}
                <div className="hidden sm:flex w-14 h-14 rounded-full bg-white border-4 border-slate-50 items-center justify-center shrink-0 z-10 shadow-sm">
                   {getEventIcon(event.type)}
                </div>

                <Card className="flex-1 border-none shadow-sm rounded-[1.5rem] bg-white overflow-hidden group hover:shadow-md transition-all active:scale-[0.99]">
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row">
                      {/* Left: Metadata & Identity */}
                      <div className="p-5 flex-1 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10 border-2 border-slate-50">
                              <AvatarImage src={user?.avatarUrl} />
                              <AvatarFallback>{user?.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="text-sm font-black text-slate-900 leading-none">{user?.name}</h4>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                {user?.workerType} • ID {user?.id.split('-')[1]}
                              </p>
                            </div>
                          </div>
                          <span className="text-[10px] font-black text-slate-400 uppercase tabular-nums">
                            {formatTime(event.timestamp)}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="bg-slate-50 border-slate-100 text-[9px] font-black text-slate-500 px-2 py-0.5 uppercase tracking-tighter">
                            {getEventLabel(event.type)}
                          </Badge>
                          <Badge variant="outline" className="bg-blue-50/50 border-blue-50 text-[9px] font-black text-blue-600 px-2 py-0.5 uppercase tracking-tighter">
                            <MapPin className="w-2.5 h-2.5 mr-1" /> {site?.name}
                          </Badge>
                          {event.source === 'AUTO' && (
                             <Badge className="bg-emerald-50 text-emerald-600 border-none text-[8px] font-black px-2 py-0.5 uppercase">Geofence Verified</Badge>
                          )}
                        </div>

                        {event.notes && (
                          <p className="text-xs text-slate-500 italic leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                            "{event.notes}"
                          </p>
                        )}
                      </div>

                      {/* Right: Operational Evidence (Mock for Feed Visuals) */}
                      {event.type === 'CLOCK_IN' && index % 2 === 0 && (
                        <div className="w-full sm:w-40 h-32 sm:h-auto bg-slate-100 relative overflow-hidden shrink-0 group-hover:opacity-90 transition-opacity">
                            <img 
                              src={`https://picsum.photos/seed/${event.id}/300/300`} 
                              alt="Entry Verification" 
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-3">
                              <div className="flex items-center gap-1.5 text-white">
                                <Camera className="w-3 h-3" />
                                <span className="text-[8px] font-black uppercase tracking-widest">Entry Verification</span>
                              </div>
                            </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {events.length === 0 && (
        <div className="py-24 text-center space-y-4">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto border border-slate-100">
            <Activity className="w-10 h-10 text-slate-200" />
          </div>
          <p className="text-slate-400 font-black text-xs uppercase tracking-widest">No Recent Activity</p>
        </div>
      )}
    </div>
  );
}
