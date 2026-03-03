
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "./lib/store";
import { Mail, Lock, Loader2, User, Crown, ChevronRight } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "./lib/placeholder-images";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type FlowStep = "SPLASH" | "ROLE_SELECTION" | "LOGIN";
type SelectedRole = "CLEANER" | "ADMIN";

export default function AppEntryFlow() {
  const { login } = useAuth();
  const { toast } = useToast();
  
  const [step, setStep] = useState<FlowStep>("SPLASH");
  const [selectedRole, setSelectedRole] = useState<SelectedRole | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Transition from Splash to Role Selection
  useEffect(() => {
    const timer = setTimeout(() => {
      setStep("ROLE_SELECTION");
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const logo = Array.isArray(PlaceHolderImages) 
    ? PlaceHolderImages.find(img => img.id === 'brand-logo') 
    : null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please enter your email and password."
      });
      return;
    }

    setIsLoading(true);
    // Simulate slight network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const success = await login(email, password);
    
    if (!success) {
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Authentication failed",
        description: "Invalid credentials. Try 'cleaner1@affinity.com' or 'david@affinity.com'."
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
            {/* Subtle radial glow behind logo */}
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
            <div className="pt-4">
               <p className="text-[10px] text-slate-300 font-medium tracking-widest uppercase">Reliable. Professional. Trusted.</p>
            </div>
            <div className="absolute bottom-[-150px] text-center">
              <p className="text-[10px] font-medium text-slate-300 uppercase tracking-widest">Secure Workforce Platform 🔒</p>
            </div>
          </motion.div>
        )}

        {step === "ROLE_SELECTION" && (
          <motion.div 
            key="role-selection"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, x: -20 }}
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
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Choose how you&apos;re signing in</h2>
              </div>
            </div>

            <div className="grid gap-4">
              <button
                onClick={() => setSelectedRole("CLEANER")}
                className={cn(
                  "p-6 rounded-3xl border-2 text-left transition-all active:scale-[0.98]",
                  selectedRole === "CLEANER" 
                    ? "bg-white border-[#2F5BFF] shadow-lg shadow-blue-500/5" 
                    : "bg-white border-transparent shadow-sm hover:border-slate-200"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                    selectedRole === "CLEANER" ? "bg-[#2F5BFF] text-white" : "bg-slate-50 text-slate-400"
                  )}>
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 leading-none">Cleaner</h4>
                    <p className="text-xs text-slate-500 font-medium mt-1">Clock in and manage your shift</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setSelectedRole("ADMIN")}
                className={cn(
                  "p-6 rounded-3xl border-2 text-left transition-all active:scale-[0.98]",
                  selectedRole === "ADMIN" 
                    ? "bg-white border-[#2F5BFF] shadow-lg shadow-blue-500/5" 
                    : "bg-white border-transparent shadow-sm hover:border-slate-200"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                    selectedRole === "ADMIN" ? "bg-[#2F5BFF] text-white" : "bg-slate-50 text-slate-400"
                  )}>
                    <Crown className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 leading-none">Admin</h4>
                    <p className="text-xs text-slate-500 font-medium mt-1">Manage team and approvals</p>
                  </div>
                </div>
              </button>
            </div>

            <Button 
              onClick={() => setStep("LOGIN")}
              disabled={!selectedRole}
              className="w-full h-14 bg-[#2F5BFF] hover:bg-[#254EDF] text-white rounded-2xl shadow-xl shadow-blue-500/10 font-black uppercase text-xs tracking-widest transition-all active:scale-95 disabled:opacity-50"
            >
              Continue <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
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
                  Sign in as {selectedRole === "CLEANER" ? "Cleaner" : "Admin"}
                </h2>
                <p className="text-sm text-slate-500 font-medium">Please enter your credentials</p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-4">
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2F5BFF] transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <Input 
                    type="email" 
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 pl-12 rounded-2xl border-slate-100 bg-white focus-visible:ring-[#2F5BFF] font-medium"
                  />
                </div>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2F5BFF] transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <Input 
                    type="password" 
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-14 pl-12 rounded-2xl border-slate-100 bg-white focus-visible:ring-[#2F5BFF] font-medium"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center">
                <button type="button" onClick={() => setStep("ROLE_SELECTION")} className="text-xs font-bold text-slate-400 hover:text-slate-600">
                  ← Change role
                </button>
                <button type="button" className="text-xs font-bold text-[#2F5BFF] hover:text-[#254EDF]">
                  Forgot password?
                </button>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-14 bg-[#2F5BFF] hover:bg-[#254EDF] text-white rounded-2xl shadow-xl shadow-blue-500/10 font-black uppercase text-xs tracking-widest transition-all active:scale-95"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                Secure Workforce Platform 🔒
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
