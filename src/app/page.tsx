
"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "./lib/store";
import { ShieldCheck, UserCheck, ChevronRight } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "./lib/placeholder-images";

export default function LoginPage() {
  const { login } = useAuth();
  
  // Safely find the logo with a fallback check
  const logo = Array.isArray(PlaceHolderImages) 
    ? PlaceHolderImages.find(img => img.id === 'brand-logo') 
    : null;

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-10 bg-gradient-to-b from-white to-slate-50/50">
      <div className="text-center space-y-6">
        <div className="w-28 h-28 bg-white rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-primary/5 border border-slate-100 overflow-hidden group">
          {logo ? (
            <Image 
              src={logo.imageUrl} 
              alt={logo.description} 
              width={112} 
              height={112} 
              className="object-cover transition-transform group-hover:scale-110 duration-500"
              data-ai-hint={logo.imageHint}
            />
          ) : (
            <div className="w-full h-full bg-slate-100 flex items-center justify-center text-primary font-bold">A</div>
          )}
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight text-primary uppercase">Affinity</h1>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] ml-1">Integrated Facility Solutions</p>
        </div>
      </div>

      <div className="w-full space-y-4">
        <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Select Access Portal</p>
        
        <Button 
          onClick={() => login('CLEANER')}
          variant="outline" 
          className="w-full h-20 justify-between text-lg px-6 rounded-3xl border-2 border-slate-100 hover:bg-white hover:border-secondary hover:shadow-xl hover:shadow-secondary/10 transition-all group bg-white/50"
        >
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mr-4 group-hover:bg-secondary/10 transition-colors">
              <UserCheck className="w-6 h-6 text-slate-500 group-hover:text-secondary" />
            </div>
            <div className="text-left">
              <span className="block font-bold text-slate-700">Cleaner Portal</span>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Clock in & Rewards</span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-secondary transform group-hover:translate-x-1 transition-all" />
        </Button>

        <Button 
          onClick={() => login('ADMIN')}
          variant="outline" 
          className="w-full h-20 justify-between text-lg px-6 rounded-3xl border-2 border-slate-100 hover:bg-white hover:border-primary hover:shadow-xl hover:shadow-primary/10 transition-all group bg-white/50"
        >
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mr-4 group-hover:bg-primary/10 transition-colors">
              <ShieldCheck className="w-6 h-6 text-slate-500 group-hover:text-primary" />
            </div>
            <div className="text-left">
              <span className="block font-bold text-slate-700">Admin Control</span>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Staff & Analytics</span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary transform group-hover:translate-x-1 transition-all" />
        </Button>
      </div>

      <div className="text-center text-[10px] font-bold text-slate-400 pt-8 max-w-[280px] uppercase tracking-widest">
        Secure Access Platform 🔐
      </div>
    </div>
  );
}
