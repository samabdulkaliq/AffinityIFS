
"use client";

import { useAuth } from "@/app/lib/store";
import { repository } from "@/app/lib/repository";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock } from "lucide-react";

export default function CleanerShiftsPage() {
  const { user } = useAuth();
  const shifts = repository.getShiftsForUser(user!.id).sort((a, b) => 
    new Date(b.scheduledStart).getTime() - new Date(a.scheduledStart).getTime()
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary">Your Shifts</h2>
        <Badge variant="outline">{shifts.length} Total</Badge>
      </div>

      <div className="space-y-4">
        {shifts.map((shift) => (
          <Card key={shift.id} className="border-none shadow-sm overflow-hidden border-l-4 border-secondary">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-bold">{shift.siteName}</CardTitle>
                <Badge className={
                  shift.status === 'COMPLETED' ? "bg-green-100 text-green-700 hover:bg-green-100" :
                  shift.status === 'IN_PROGRESS' ? "bg-blue-100 text-blue-700 hover:bg-blue-100" :
                  "bg-slate-100 text-slate-700 hover:bg-slate-100"
                }>
                  {shift.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date(shift.scheduledStart).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="w-4 h-4 mr-2" />
                {new Date(shift.scheduledStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                {new Date(shift.scheduledEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mr-2" />
                {repository.getSite(shift.siteId)?.address}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
