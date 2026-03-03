"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sparkles, CheckCircle2, Clock, Camera } from "lucide-react";

interface OnboardingWizardProps {
  onComplete: () => void;
}

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Welcome to Affinity 👋",
      text: "We're here to help you have a great work day. This app makes it easy to track your time and see your tasks.",
      icon: <Sparkles className="w-16 h-16 text-blue-500" />,
    },
    {
      title: "Start Your Work ⏱",
      text: "When you get to the building, just tap 'Start Work'. We'll handle the timing for you.",
      subtext: "Wait until you are inside the building 📍",
      icon: <Clock className="w-16 h-16 text-emerald-500" />,
    },
    {
      title: "Your Daily Tasks ✅",
      text: "See exactly what needs to be cleaned. Check them off as you go!",
      icon: <CheckCircle2 className="w-16 h-16 text-blue-600" />,
    },
    {
      title: "Show Your Work 📸",
      text: "Take a few quick photos when you're finished. It helps us see the great job you did!",
      icon: <Camera className="w-16 h-16 text-amber-500" />,
      button: "Let's Get Started! 🚀",
    },
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-8 text-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.4 }}
          className="flex-1 flex flex-col items-center justify-center max-w-sm space-y-10"
        >
          <div className="p-8 bg-slate-50 rounded-[3rem] shadow-inner">
            {steps[step].icon}
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
              {steps[step].title}
            </h2>
            <p className="text-lg font-medium text-slate-500 leading-relaxed px-2">
              {steps[step].text}
            </p>
            {steps[step].subtext && (
              <p className="text-xs font-black text-blue-600 bg-blue-50 py-2 px-6 rounded-full inline-block uppercase tracking-widest">
                {steps[step].subtext}
              </p>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="w-full max-w-sm space-y-6 pb-12">
        <div className="flex justify-center gap-2.5 mb-8">
          {steps.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-2 rounded-full transition-all duration-500",
                step === i ? "w-10 bg-blue-600" : "w-2.5 bg-slate-100"
              )}
            />
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={handleNext}
            className="h-20 rounded-[2.5rem] bg-blue-600 hover:bg-blue-700 text-white font-black text-xl shadow-2xl shadow-blue-200 transition-all active:scale-95 border-none"
          >
            {steps[step].button || "Next"}
          </Button>
          {step < steps.length - 1 && (
            <button
              onClick={onComplete}
              className="py-2 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-slate-600 transition-colors"
            >
              Skip Tutorial
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
