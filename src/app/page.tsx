"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "./lib/store";
import { Mail, Lock, Loader2, User as UserIcon } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "./lib/placeholder-images";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

type FlowStep = "SPLASH" | "LOGIN";

export default function AppEntryFlow() {
  const { login } = useAuth();
  const { toast } = useToast();
  
  const [step, setStep] = useState<FlowStep>("SPLASH");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStep("LOGIN");
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const logo = Array.isArray(PlaceHolderImages) 
    ? PlaceHolderImages.find(img => img.id === 'brand-logo') 
    : null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please enter your username or email and password."
      });
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const success = await login(identifier, password);
    
    if (!success) {
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Invalid credentials. Please use 'Abraham Wellman' or 'abraham@affinity.com' for Admin access."
      });
    }
  };

  return (
    <div className="flex-1 bg-[#F7F9FC] relative flex flex-col items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        {step === "SPLASH" && (
          <motion.div 
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center space-y-8 relative"
          >
            <div className="absolute w-[300px] h-[300px] bg-[#2F5BFF]/5 rounded-full blur-[80px] -z-10" />
            
            <div className="w-32 h-32 bg-white rounded-[2rem] flex items-center justify-center shadow-sm border border-slate-100 overflow-hidden">
              {logo ? (
                <Image 
                  src={logo.imageUrl} 
                  alt={logo.description} 
                  width={128} 
                  height={128} 
                  className="object-cover"
                  data-ai-hint={logo.imageHint}
                />
              ) : (
                <div className="text-4xl font-black text-[#2F5BFF]">A</div>
              )}
            </div>
            <div className="text-center space-y-2">
              <h1 className="text-5xl font-black tracking-tighter text-[#2F5BFF]">AFFINITY</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] ml-1">Integrated Facility Solutions</p>
            </div>
          </motion.div>
        )}

        {step === "LOGIN" && (
          <motion.div 
            key="login"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-sm px-8 space-y-10"
          >
            <div className="flex flex-col items-center space-y-6">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 overflow-hidden">
                {logo ? (
                  <Image 
                    src={logo.imageUrl} 
                    alt={logo.description} 
                    width={64} 
                    height={64} 
                    className="object-cover"
                    data-ai-hint={logo.imageHint}
                  />
                ) : (
                  <div className="text-2xl font-black text-[#2F5BFF]">A</div>
                )}
              </div>
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                  Sign In
                </h2>
                <p className="text-sm text-slate-500 font-medium">Abraham Wellman Command Portal</p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-4">
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2F5BFF] transition-colors">
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <Input 
                    type="text" 
                    placeholder="Email or Full Name"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="h-14 pl-12 rounded-2xl border-slate-100 bg-white focus-visible:ring-[#2F5BFF] font-medium"
                  />
                </div>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2F5BFF] transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <Input 
                    type="password" 
                    placeholder="Any Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-14 pl-12 rounded-2xl border-slate-100 bg-white focus-visible:ring-[#2F5BFF] font-medium"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-14 bg-[#2F5BFF] hover:bg-[#254EDF] text-white rounded-2xl shadow-xl shadow-blue-500/10 font-black uppercase text-xs tracking-widest transition-all active:scale-95"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Open Dashboard"}
              </Button>
            </form>

            <div className="text-center pt-8">
              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em]">
                Abraham Wellman Secure Session 🔒
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
