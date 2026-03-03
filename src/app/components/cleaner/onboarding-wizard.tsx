
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface OnboardingWizardProps {
  onComplete: () => void;
}

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Welcome to Affinity 👋",
      text: "This app helps you start your shift, track your time, and complete tasks easily.",
      icon: "✨",
    },
    {
      title: "Start Your Shift ⏱",
      text: "When you arrive at the site, tap “Start Shift”. We’ll begin tracking your time automatically.",
      subtext: "Make sure you are at the right location 📍",
      icon: "⏱",
    },
    {
      title: "Tasks & Photos ✅📷",
      text: "Check off tasks as you finish them. Upload photos to show your work.",
      icon: "🚀",
      button: "Start Using the App 🚀",
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
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="flex-1 flex flex-col items-center justify-center max-w-sm space-y-8"
        >
          <div className="text-7xl mb-4">{steps[step].icon}</div>
          <div className="space-y-4">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              {steps[step].title}
            </h2>
            <p className="text-lg font-medium text-slate-500 leading-relaxed">
              {steps[step].text}
            </p>
            {steps[step].subtext && (
              <p className="text-sm font-bold text-blue-500 bg-blue-50 py-2 px-4 rounded-full inline-block">
                {steps[step].subtext}
              </p>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="w-full max-w-sm space-y-6 pb-12">
        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mb-8">
          {steps.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                step === i ? "w-8 bg-blue-500" : "w-2 bg-slate-200"
              )}
            />
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={handleNext}
            className="h-16 rounded-[2rem] bg-blue-600 hover:bg-blue-700 text-white font-black text-lg shadow-xl shadow-blue-100 transition-all active:scale-95 border-none"
          >
            {steps[step].button || "Next"}
          </Button>
          {step < steps.length - 1 && (
            <button
              onClick={onComplete}
              className="py-2 text-slate-400 font-bold hover:text-slate-600 transition-colors"
            >
              Skip
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
