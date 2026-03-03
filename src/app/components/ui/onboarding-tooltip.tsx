
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface OnboardingTooltipProps {
  text: string;
  storageKey: string;
  isVisible: boolean;
  position?: "top" | "bottom";
}

export function OnboardingTooltip({
  text,
  storageKey,
  isVisible,
  position = "top",
}: OnboardingTooltipProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const hasSeen = localStorage.getItem(storageKey);
      if (!hasSeen) {
        setShow(true);
      }
    }
  }, [isVisible, storageKey]);

  const dismiss = () => {
    localStorage.setItem(storageKey, "true");
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <div className="absolute z-[60] w-full left-0 flex justify-center pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: position === "top" ? 10 : -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={dismiss}
            className={cn(
              "pointer-events-auto bg-blue-600 text-white px-4 py-3 rounded-2xl shadow-2xl relative flex items-center gap-2 max-w-[200px] text-center",
              position === "top" ? "-top-16" : "top-16"
            )}
          >
            <p className="text-xs font-black tracking-tight leading-tight">{text}</p>
            {/* Arrow */}
            <div
              className={cn(
                "absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-600 rotate-45",
                position === "top" ? "-bottom-1.5" : "-top-1.5"
              )}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");
