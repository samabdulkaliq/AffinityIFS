
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "./lib/store";
import { Mail, Lock, Loader2, User as UserIcon, Sparkles, ArrowRight } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "./lib/placeholder-images";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type FlowStep = "SPLASH" | "AUTH";
type AuthMode = "LOGIN" | "SIGNUP";

export default function AppEntryFlow() {
  const { login, signup } = useAuth();
  const { toast } = useToast();
  
  const [step, setStep] = useState<FlowStep>("SPLASH");
  const [mode, setMode] = useState<AuthMode>("LOGIN");
  const [isLoading, setIsLoading] = useState(false);

  // Form States
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setStep("AUTH");
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const logo = Array.isArray(PlaceHolderImages) 
    ? PlaceHolderImages.find(img => img.id === 'brand-logo') 
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === "LOGIN") {
      if (!email || !password) {
        toast({ variant: "destructive", title: "Missing Information", description: "Please enter your email and password." });
        return;
      }
      setIsLoading(true);
      const success = await login(email, password);
      if (!success) {
        setIsLoading(false);
        toast({ variant: "destructive", title: "Access Denied", description: "Invalid email or password. Please check your credentials." });
      }
    } else {
      if (!name || !email || !password) {
        toast({ variant: "destructive", title: "Incomplete Form", description: "Please fill in all fields to create your account." });
        return;
      }
      setIsLoading(true);
      const success = await signup(name, email, password);
      if (!success) {
        setIsLoading(false);
        toast({ variant: "destructive", title: "Account Exists", description: "An account with this email already exists." });
      } else {
        toast({ title: "Welcome! 🎉", description: "Your account has been created successfully." });
      }
    }
  };

  return (
    <div className="flex-1 bg-white relative flex flex-col items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        {step === "SPLASH" && (
          <motion.div 
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center space-y-8 relative"
          >
            <div className="absolute w-[300px] h-[300px] bg-blue-600/5 rounded-full blur-[80px] -z-10" />
            
            <motion.div 
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              className="w-32 h-32 bg-white rounded-[2.5rem] flex items-center justify-center shadow-2xl border border-slate-50 overflow-hidden"
            >
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
                <div className="text-4xl font-black text-blue-600">A</div>
              )}
            </motion.div>
            <div className="text-center space-y-2">
              <h1 className="text-5xl font-black tracking-tighter text-slate-900">AFFINITY</h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-1">Workforce Platform</p>
            </div>
          </motion.div>
        )}

        {step === "AUTH" && (
          <motion.div 
            key="auth"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-sm px-8 space-y-8"
          >
            <div className="space-y-2 text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                 <Sparkles className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                {mode === "LOGIN" ? "Welcome Back" : "Join the Team"}
              </h2>
              <p className="text-sm text-slate-500 font-medium">
                {mode === "LOGIN" ? "Sign in to access your dashboard" : "Register as a cleaner to start working"}
              </p>
            </div>

            <div className="flex p-1 bg-slate-100 rounded-2xl">
              <button 
                onClick={() => setMode("LOGIN")}
                className={cn(
                  "flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                  mode === "LOGIN" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                )}
              >
                Log In
              </button>
              <button 
                onClick={() => setMode("SIGNUP")}
                className={cn(
                  "flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                  mode === "SIGNUP" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                )}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={mode}
                  initial={{ opacity: 0, x: mode === "LOGIN" ? -10 : 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: mode === "LOGIN" ? 10 : -10 }}
                  className="space-y-4"
                >
                  {mode === "SIGNUP" && (
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                        <UserIcon className="w-5 h-5" />
                      </div>
                      <Input 
                        type="text" 
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="h-14 pl-12 rounded-2xl border-slate-100 bg-slate-50/50 focus-visible:ring-blue-600 font-bold"
                      />
                    </div>
                  )}
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                      <Mail className="w-5 h-5" />
                    </div>
                    <Input 
                      type="email" 
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-14 pl-12 rounded-2xl border-slate-100 bg-slate-50/50 focus-visible:ring-blue-600 font-bold"
                    />
                  </div>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                      <Lock className="w-5 h-5" />
                    </div>
                    <Input 
                      type="password" 
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-14 pl-12 rounded-2xl border-slate-100 bg-slate-50/50 focus-visible:ring-blue-600 font-bold"
                    />
                  </div>
                </motion.div>
              </AnimatePresence>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-16 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl shadow-xl shadow-slate-200 font-black uppercase text-xs tracking-widest transition-all active:scale-95 mt-4"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : mode === "LOGIN" ? "Sign In" : "Create Account"}
                {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                Secure Enterprise Infrastructure 🔒
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
