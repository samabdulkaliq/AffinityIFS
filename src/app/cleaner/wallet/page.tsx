
"use client";

import { useAuth } from "@/app/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, ArrowUpRight, ArrowDownLeft, Zap, Star } from "lucide-react";

export default function CleanerWalletPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <Card className="bg-primary text-white border-none shadow-xl overflow-hidden relative rounded-[2rem]">
        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/20 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        <CardContent className="p-8 space-y-6">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
              <Wallet className="w-6 h-6" />
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">Points Balance</p>
              <h2 className="text-4xl font-black">{user?.points}</h2>
            </div>
          </div>
          
          <div className="flex gap-4 pt-4">
             <Button className="flex-1 bg-secondary text-white font-bold h-12 rounded-xl">
               <ArrowUpRight className="w-4 h-4 mr-2" /> Redeem
             </Button>
             <Button variant="outline" className="flex-1 bg-white/5 border-white/20 text-white font-bold h-12 rounded-xl hover:bg-white/10">
               History
             </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="font-bold text-lg">Ways to Earn 🚀</h3>
        <div className="grid grid-cols-1 gap-3">
          <Card className="border-none shadow-sm bg-blue-50/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Zap className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold">Perfect Attendance</p>
                <p className="text-xs text-muted-foreground">50 points for 5 shifts on time</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-yellow-50/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold">High Rating</p>
                <p className="text-xs text-muted-foreground">100 points for 5-star feedback</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
