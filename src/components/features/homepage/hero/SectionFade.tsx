"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface SectionFadeProps {
  sectionKey: string;
  children: ReactNode;
}

export default function SectionFade({ sectionKey, children }: SectionFadeProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={sectionKey}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
