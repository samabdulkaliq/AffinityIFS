"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "../lib/store";
import { repository } from "../lib/repository";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MapPin, Clock, Star, Zap } from "lucide-react";

export default function CleanerDashboard() {
  const { user } = useAuth();
  const todayShift = repository.getShiftsForUser(user!.id).find(s => s.status === 'SCHEDULED' || s.status === 'IN_PROGRESS');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-none shadow-sm bg-gradient-to-br from-secondary/10 to-transparent">
          <CardContent className="p-4 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center mb-2">
              <Zap className="w-5 h-5 text-secondary" />
            </div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Points</p>
            <p className="text-2xl font-bold text-primary">{user?.points}</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-4 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mb-2">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Rating</p>
            <p className="text-2xl font-bold text-primary">4.9</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-lg">Next Shift</h3>
          <Link href="/cleaner/shifts" className="text-xs font-semibold text-secondary">View All</Link>
        </div>

        {todayShift ? (
          <Card className="border-none shadow-lg overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-secondary"></div>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl font-bold">{todayShift.siteName}</CardTitle>
                <div className="px-2 py-1 rounded bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-widest">
                  Upcoming
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                {repository.getSite(todayShift.siteId)?.address}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="w-4 h-4 mr-2 text-slate-400" />
                {new Date(todayShift.scheduledStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                {new Date(todayShift.scheduledEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <Button asChild className="w-full bg-secondary hover:bg-secondary/90 text-white rounded-xl h-12">
                <Link href="/cleaner/clock">Go to Time Clock</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="text-center py-12 px-4 bg-white rounded-3xl border border-dashed border-slate-200">
            <p className="text-muted-foreground italic">No shifts scheduled for today ✨</p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-lg">Daily Tips</h3>
        <Card className="border-none bg-primary text-white shadow-lg shadow-primary/20">
          <CardContent className="p-4 flex gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-semibold text-sm">Perfect Attendance</p>
              <p className="text-xs text-white/70 mt-1">Clock in exactly on time for 5 shifts in a row to earn bonus points! 🏆</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
