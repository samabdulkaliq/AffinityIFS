
"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "./lib/store";
import { Mail, Lock, Loader2, User as UserIcon, Sparkles, ArrowRight, ChevronLeft, Check, Bot, Sparkle } from "lucide-react";
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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
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
    if (mode === "SIGNUP") return firstName.length >= 2 && lastName.length >= 2 && isEmailValid && password.length >= 8 && password === confirmPassword;
    if (mode === "FORGOT_PASSWORD") return isEmailValid;
    return false;
  }, [mode, firstName, lastName, email, password, confirmPassword]);

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
      const fullName = `${firstName} ${lastName}`.trim();
      const success = await signup(fullName, email, "CLEANER", password);
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
      if (!firstName) return "Welcome! I’ll help you get set up in less than a minute.";
      if (!lastName) return "Great! Now enter your last name to complete your profile.";
      if (!email) return "Use your personal email to create your new team account.";
      if (password.length < 8) return "Almost done! Choose a password with at least 8 characters.";
      return "You're all set! Just click create account to finish.";
    }
    
    if (mode === "FORGOT_PASSWORD") {
      return "No problem! Enter your email and I'll send you a recovery link.";
    }

    return "Welcome back! Sign in to access your team dashboard.";
  }, [mode, firstName, lastName, email, password, isSuccess]);

  if (isSuccess) {
    return (
      <div className="flex-1 bg-white flex flex-col items-center justify-center p-8 text-center space-y-10 animate-in fade-in duration-1000">
        <div className="relative">
          {/* Animated Glow Backdrop */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-blue-500/20 blur-[60px] rounded-full" 
          />
          
          {/* Animated Gradient Success Ring */}
          <motion.div 
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 15, stiffness: 100 }}
            className="w-28 h-28 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] flex items-center justify-center relative z-10 shadow-[0_20px_50px_-12px_rgba(37,99,235,0.4)]"
          >
            <motion.div
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Check className="w-14 h-14 text-white stroke-[3px]" />
            </motion.div>
          </motion.div>

          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute -top-4 -right-4 bg-amber-400 p-2 rounded-xl shadow-lg z-20"
          >
            <Sparkle className="w-4 h-4 text-white fill-white" />
          </motion.div>
        </div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">You&apos;re all set!</h2>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">Registration Complete</p>
          </div>

          <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-6 relative overflow-hidden text-left shadow-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16" />
            
            <div className="space-y-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Onboarding Guide</p>
              </div>
              
              <p className="text-base font-bold text-slate-700 leading-relaxed">
                Your account has been created successfully. Your manager will assign your first work site soon.
              </p>

              <div className="pt-4 border-t border-slate-200/50 flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <p className="text-xs font-bold text-slate-400 italic">
                  Tip: Once assigned, you&apos;ll see your schedule and tasks here.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="w-full"
        >
          <Button 
            onClick={() => window.location.reload()}
            className="w-full h-18 bg-slate-900 hover:bg-slate-800 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-2xl shadow-slate-200 transition-all active:scale-95 group"
          >
            Continue to Login
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
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
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">First name</label>
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors z-10">
                          <UserIcon className="w-4 h-4" />
                        </div>
                        <Input 
                          type="text" 
                          placeholder="e.g. Maria"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="h-14 pl-12 rounded-2xl border-slate-100 bg-slate-50/50 focus-visible:ring-blue-600 font-bold"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Last name</label>
                      <div className="relative group">
                        <Input 
                          type="text" 
                          placeholder="e.g. Thompson"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="h-14 px-4 rounded-2xl border-slate-100 bg-slate-50/50 focus-visible:ring-blue-600 font-bold"
                        />
                      </div>
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
