
"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "./lib/store";
import { Mail, Lock, Loader2, User as UserIcon, Sparkles, ArrowRight, ChevronLeft, Check, Brain, Bot, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "./lib/placeholder-images";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type FlowStep = "SPLASH" | "AUTH";
type AuthMode = "LOGIN" | "SIGNUP" | "FORGOT_PASSWORD";

export default function AppEntryFlow() {
  const { login, signup } = useAuth();
  const { toast } = useToast();
  
  const [step, setStep] = useState<FlowStep>("SPLASH");
  const [mode, setMode] = useState<AuthMode>("LOGIN");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form States
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setStep("AUTH");
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const logo = Array.isArray(PlaceHolderImages) 
    ? PlaceHolderImages.find(img => img.id === 'brand-logo') 
    : null;

  const emailHint = useMemo(() => {
    if (!email) return "Use your personal email address.";
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    return isValid ? "Email format looks correct ✅" : "Please check your email format.";
  }, [email]);

  const passwordHint = useMemo(() => {
    if (!password) return "Minimum 8 characters required.";
    if (password.length < 8) return `Add ${8 - password.length} more characters...`;
    const hasNumber = /\d/.test(password);
    if (!hasNumber) return "Almost there! Add a number for security.";
    return "Password is strong enough ✅";
  }, [password]);

  const confirmHint = useMemo(() => {
    if (!confirmPassword) return "";
    return password === confirmPassword ? "Passwords match ✅" : "Passwords do not match yet.";
  }, [password, confirmPassword]);

  const isFormValid = useMemo(() => {
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (mode === "LOGIN") return isEmailValid && password.length >= 1;
    if (mode === "SIGNUP") return name.length >= 2 && isEmailValid && password.length >= 8 && password === confirmPassword;
    if (mode === "FORGOT_PASSWORD") return isEmailValid;
    return false;
  }, [mode, name, email, password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    
    setIsLoading(true);

    if (mode === "LOGIN") {
      const success = await login(email, password);
      if (!success) {
        setIsLoading(false);
        toast({ variant: "destructive", title: "Access Denied", description: "Invalid email or password." });
      }
    } else if (mode === "SIGNUP") {
      const success = await signup(name, email, "CLEANER", password);
      if (!success) {
        setIsLoading(false);
        toast({ variant: "destructive", title: "Account Exists", description: "An account with this email already exists." });
      } else {
        setIsSuccess(true);
        setIsLoading(false);
      }
    } else if (mode === "FORGOT_PASSWORD") {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsLoading(false);
      toast({ title: "Reset link sent ✅", description: "Check your email for the reset link." });
      setMode("LOGIN");
    }
  };

  const aiMessage = useMemo(() => {
    if (isSuccess) return "Great! Your account is ready. Your manager will assign your first work site soon.";
    
    if (mode === "SIGNUP") {
      if (!name) return "Welcome! I’ll help you get set up in less than a minute.";
      if (!email) return "Use your personal email to create your new team account.";
      if (password.length < 8) return "Almost done! Choose a password with at least 8 characters.";
      return "You're all set! Just click create account to finish.";
    }
    
    if (mode === "FORGOT_PASSWORD") {
      return "No problem! Enter your email and I'll send you a recovery link.";
    }

    return "Welcome back! Sign in to access your team dashboard.";
  }, [mode, name, email, password, isSuccess]);

  if (isSuccess) {
    return (
      <div className="flex-1 bg-white flex flex-col items-center justify-center p-8 text-center space-y-8 animate-in fade-in zoom-in-95 duration-700">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full" />
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-24 h-24 bg-blue-600 rounded-[2.5rem] flex items-center justify-center relative z-10 shadow-2xl shadow-blue-200"
          >
            <Check className="w-12 h-12 text-white" />
          </motion.div>
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Account Created!</h2>
          <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex items-start gap-4 text-left">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-sm font-medium text-slate-600 leading-relaxed">
              {aiMessage}
            </p>
          </div>
        </div>
        <Button 
          onClick={() => window.location.reload()}
          className="w-full h-16 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all"
        >
          Go to Sign In
        </Button>
      </div>
    );
  }

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
                <Image src={logo.imageUrl} alt={logo.description} width={128} height={128} className="object-cover" />
              ) : (
                <div className="text-4xl font-black text-blue-600">A</div>
              )}
            </motion.div>
            <div className="text-center space-y-2">
              <h1 className="text-5xl font-black tracking-tighter text-slate-900 uppercase">Affinity</h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-1">Team Portal</p>
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
            {/* AI SMART WELCOME */}
            <div className="bg-blue-50/50 p-5 rounded-[2rem] border border-blue-100/50 flex items-start gap-4 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-full blur-xl -mr-10 -mt-10" />
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-blue-100 shrink-0">
                <Sparkles className="w-5 h-5 text-blue-600 animate-pulse" />
              </div>
              <div className="space-y-1 relative z-10">
                <p className="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em]">Affinity AI Assistant</p>
                <p className="text-xs font-bold text-slate-700 leading-relaxed">
                  {aiMessage}
                </p>
              </div>
            </div>

            <div className="flex p-1 bg-slate-100 rounded-2xl">
              <button onClick={() => setMode("LOGIN")} className={cn("flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all", mode === "LOGIN" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400")}>
                Log In
              </button>
              <button onClick={() => setMode("SIGNUP")} className={cn("flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all", mode === "SIGNUP" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400")}>
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-4">
                {mode === "SIGNUP" && (
                  <div className="space-y-1.5">
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

                <div className="space-y-1.5">
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
                  <p className={cn("text-[9px] px-1 font-bold transition-colors", email.length > 0 ? "text-blue-600" : "text-slate-400")}>
                    {emailHint}
                  </p>
                </div>

                {mode !== "FORGOT_PASSWORD" && (
                  <div className="space-y-1.5">
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
                      <p className={cn("text-[9px] px-1 font-bold transition-colors", password.length >= 8 ? "text-blue-600" : "text-slate-400")}>
                        {passwordHint}
                      </p>
                    )}
                  </div>
                )}

                {mode === "SIGNUP" && (
                  <div className="space-y-1.5">
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
                    <p className={cn("text-[9px] px-1 font-bold transition-colors", confirmPassword.length > 0 && password === confirmPassword ? "text-emerald-600" : "text-slate-400")}>
                      {confirmHint}
                    </p>
                  </div>
                )}
              </div>

              {mode === "LOGIN" && (
                <div className="flex justify-end">
                  <button type="button" onClick={() => setMode("FORGOT_PASSWORD")} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">
                    Forgot password?
                  </button>
                </div>
              )}

              <Button 
                type="submit" 
                disabled={isLoading || !isFormValid}
                className="w-full h-16 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl shadow-xl shadow-slate-200 font-black uppercase text-xs tracking-widest transition-all active:scale-95 mt-2"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : mode === "LOGIN" ? "Sign in" : mode === "SIGNUP" ? "Create account" : "Send reset link"}
                {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>

              {mode === "FORGOT_PASSWORD" && (
                <button type="button" onClick={() => setMode("LOGIN")} className="w-full flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600">
                  <ChevronLeft className="w-3 h-3" /> Back to sign in
                </button>
              )}
            </form>

            <div className="text-center pt-2">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                Team Member Access Only 🔒
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
