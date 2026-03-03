"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "./lib/store";
import { ShieldCheck, Mail, Lock, Loader2 } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "./lib/placeholder-images";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function AppEntryFlow() {
  const { login } = useAuth();
  const { toast } = useToast();
  
  const [showSplash, setShowSplash] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Transition from Splash to Login
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
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
    await new Promise(resolve => setTimeout(resolve, 1000));
    
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
    <div className="flex-1 bg-white relative flex flex-col items-center justify-center">
      <AnimatePresence mode="wait">
        {showSplash ? (
          <motion.div 
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center space-y-8"
          >
            <div className="w-32 h-32 bg-white rounded-[2rem] flex items-center justify-center shadow-xl border border-slate-50 overflow-hidden">
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
            </div>
            <div className="text-center space-y-2">
              <h1 className="text-5xl font-black tracking-tighter text-slate-900">AFFINITY</h1>
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] ml-1">Integrated Facility Solutions</p>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="login"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-sm px-8 space-y-10"
          >
            <div className="flex flex-col items-center space-y-6">
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-lg border border-slate-50 overflow-hidden">
                {logo ? (
                  <Image 
                    src={logo.imageUrl} 
                    alt={logo.description} 
                    width={80} 
                    height={80} 
                    className="object-cover"
                    data-ai-hint={logo.imageHint}
                  />
                ) : (
                  <div className="text-2xl font-black text-blue-600">A</div>
                )}
              </div>
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Welcome back</h2>
                <p className="text-sm text-slate-500 font-medium">Sign in to continue</p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-4">
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <Input 
                    type="email" 
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 pl-12 rounded-2xl border-slate-100 bg-slate-50/50 focus-visible:ring-blue-500 font-medium"
                  />
                </div>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <Input 
                    type="password" 
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-14 pl-12 rounded-2xl border-slate-100 bg-slate-50/50 focus-visible:ring-blue-500 font-medium"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button type="button" className="text-xs font-bold text-blue-600 hover:text-blue-700">
                  Forgot password?
                </button>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-xl shadow-blue-100 font-black uppercase text-xs tracking-widest transition-all active:scale-95"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
                Secure login 🔒
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
