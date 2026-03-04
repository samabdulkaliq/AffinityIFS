"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "./lib/store";
import { Mail, Lock, Loader2, User as UserIcon, Sparkles, ArrowRight, ChevronLeft, Check } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "./lib/placeholder-images";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { UserRole } from "./lib/models";

type FlowStep = "SPLASH" | "AUTH";
type AuthMode = "LOGIN" | "SIGNUP" | "FORGOT_PASSWORD";

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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>("CLEANER");

  useEffect(() => {
    const timer = setTimeout(() => {
      setStep("AUTH");
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const logo = Array.isArray(PlaceHolderImages) 
    ? PlaceHolderImages.find(img => img.id === 'brand-logo') 
    : null;

  const isEmailValid = useMemo(() => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }, [email]);

  const isFormValid = useMemo(() => {
    if (mode === "LOGIN") return isEmailValid && password.length >= 1;
    if (mode === "SIGNUP") return name.length >= 2 && isEmailValid && password.length >= 8 && password === confirmPassword;
    if (mode === "FORGOT_PASSWORD") return isEmailValid;
    return false;
  }, [mode, name, email, password, confirmPassword, isEmailValid]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    
    setIsLoading(true);

    if (mode === "LOGIN") {
      const success = await login(email, password);
      if (!success) {
        setIsLoading(false);
        toast({ variant: "destructive", title: "Access Denied", description: "Invalid email or password. Please check your credentials." });
      }
    } else if (mode === "SIGNUP") {
      const success = await signup(name, email, role, password);
      if (!success) {
        setIsLoading(false);
        toast({ variant: "destructive", title: "Account Exists", description: "An account with this email already exists." });
      } else {
        toast({ title: "Welcome! ✨", description: "Your account has been created successfully." });
      }
    } else if (mode === "FORGOT_PASSWORD") {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsLoading(false);
      toast({ title: "Reset link sent ✅", description: "Check your email for the reset link." });
      setMode("LOGIN");
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
              <h1 className="text-5xl font-black tracking-tighter text-slate-900 uppercase">Affinity</h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-1">Workforce Platform</p>
            </div>
          </motion.div>
        )}

        {step === "AUTH" && (
          <motion.div 
            key="auth"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-sm px-8 space-y-8 overflow-y-auto max-h-[90vh] pb-10 scrollbar-hide"
          >
            <div className="space-y-2 text-center">
              {mode !== "FORGOT_PASSWORD" && (
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                   <Sparkles className="w-8 h-8 text-blue-600" />
                </div>
              )}
              
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                {mode === "LOGIN" ? "Welcome back 👋" : mode === "SIGNUP" ? "Let's get you set up ✨" : "Reset password"}
              </h2>
              <p className="text-sm text-slate-500 font-medium">
                {mode === "LOGIN" ? "Sign in to access your dashboard" : mode === "SIGNUP" ? "Create your account to start working" : "Enter your email to receive a reset link"}
              </p>
            </div>

            {mode !== "FORGOT_PASSWORD" && (
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
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                {mode === "SIGNUP" && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Full name</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors z-10">
                        <UserIcon className="w-4 h-4" />
                      </div>
                      <Input 
                        type="text" 
                        placeholder="e.g. Maria Thompson"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="h-14 pl-12 rounded-2xl border-slate-100 bg-slate-50/50 focus-visible:ring-blue-600 font-bold"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors z-10">
                      <Mail className="w-4 h-4" />
                    </div>
                    <Input 
                      type="email" 
                      placeholder="name@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-14 pl-12 rounded-2xl border-slate-100 bg-slate-50/50 focus-visible:ring-blue-600 font-bold"
                    />
                  </div>
                  <p className="text-[9px] text-slate-400 px-1 font-medium">Use your personal email (ex: name@gmail.com)</p>
                </div>

                {mode !== "FORGOT_PASSWORD" && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Password</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors z-10">
                        <Lock className="w-4 h-4" />
                      </div>
                      <Input 
                        type="password" 
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        showToggle
                        className="h-14 pl-12 rounded-2xl border-slate-100 bg-slate-50/50 focus-visible:ring-blue-600 font-bold"
                      />
                    </div>
                    {mode === "SIGNUP" && (
                      <p className="text-[9px] text-slate-400 px-1 font-medium">Must be at least 8 characters</p>
                    )}
                  </div>
                )}

                {mode === "SIGNUP" && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Confirm password</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors z-10">
                        <Check className="w-4 h-4" />
                      </div>
                      <Input 
                        type="password" 
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        showToggle
                        className="h-14 pl-12 rounded-2xl border-slate-100 bg-slate-50/50 focus-visible:ring-blue-600 font-bold"
                      />
                    </div>
                  </div>
                )}

                {mode === "SIGNUP" && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Work role</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        type="button"
                        onClick={() => setRole("CLEANER")}
                        className={cn(
                          "h-12 rounded-xl border-2 transition-all flex items-center justify-center font-black text-[10px] uppercase tracking-widest",
                          role === "CLEANER" ? "bg-blue-600 border-blue-600 text-white shadow-lg" : "bg-white border-slate-100 text-slate-400"
                        )}
                      >
                        Cleaner
                      </button>
                      <button 
                        type="button"
                        onClick={() => setRole("ADMIN")}
                        className={cn(
                          "h-12 rounded-xl border-2 transition-all flex items-center justify-center font-black text-[10px] uppercase tracking-widest",
                          role === "ADMIN" ? "bg-blue-600 border-blue-600 text-white shadow-lg" : "bg-white border-slate-100 text-slate-400"
                        )}
                      >
                        Admin
                      </button>
                    </div>
                    <p className="text-[9px] text-slate-400 text-center font-medium italic">Admins can be approved later.</p>
                  </div>
                )}
              </div>

              {mode === "LOGIN" && (
                <div className="flex justify-end">
                  <button 
                    type="button" 
                    onClick={() => setMode("FORGOT_PASSWORD")}
                    className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <Button 
                type="submit" 
                disabled={isLoading || !isFormValid}
                className="w-full h-16 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl shadow-xl shadow-slate-200 font-black uppercase text-xs tracking-widest transition-all active:scale-95 mt-4 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : mode === "LOGIN" ? "Sign in" : mode === "SIGNUP" ? "Create account" : "Send reset link"}
                {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>

              {mode === "FORGOT_PASSWORD" && (
                <button 
                  type="button"
                  onClick={() => setMode("LOGIN")}
                  className="w-full flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600"
                >
                  <ChevronLeft className="w-3 h-3" /> Back to sign in
                </button>
              )}
            </form>

            <div className="text-center pt-2">
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
