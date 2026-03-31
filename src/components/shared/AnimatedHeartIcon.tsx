"use client";

import { Heart } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface AnimatedHeartIconProps {
  className?: string;
  active?: boolean;
  animateKey?: number | string | null;
  interactive?: boolean;
}

export function AnimatedHeartIcon({
  className = "h-4 w-4",
  active = false,
  animateKey = null,
  interactive = false,
}: AnimatedHeartIconProps) {
  const [pressed, setPressed] = useState(false);
  const [bursting, setBursting] = useState(false);

  useEffect(() => {
    if (animateKey == null) {
      return;
    }

    setBursting(true);
    const timer = window.setTimeout(() => setBursting(false), 520);

    return () => window.clearTimeout(timer);
  }, [animateKey]);

  const filled = active || bursting || pressed;

  return (
    <motion.span
      className="relative inline-flex items-center justify-center"
      initial={false}
      animate={
        bursting
          ? { scale: [1, 0.92, 1.12, 1], y: [0, 0.3, -0.8, 0] }
          : pressed
            ? { scale: 0.95 }
            : { scale: 1, y: 0 }
      }
      transition={
        bursting
          ? { duration: 0.46, ease: "easeOut", times: [0, 0.24, 0.62, 1] }
          : { duration: 0.16, ease: "easeOut" }
      }
      onPointerDown={interactive ? () => setPressed(true) : undefined}
      onPointerUp={interactive ? () => setPressed(false) : undefined}
      onPointerLeave={interactive ? () => setPressed(false) : undefined}
      onPointerCancel={interactive ? () => setPressed(false) : undefined}
    >
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-0.36rem] rounded-full"
        style={{ backgroundColor: "currentColor" }}
        initial={false}
        animate={
          bursting
            ? { opacity: [0, 0.14, 0], scale: [0.72, 1.32, 1.52] }
            : pressed
              ? { opacity: 0.08, scale: 0.92 }
              : { opacity: 0, scale: 0.8 }
        }
        transition={{ duration: bursting ? 0.52 : 0.16, ease: "easeOut" }}
      />
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-0.58rem] rounded-full border"
        style={{ borderColor: "currentColor" }}
        initial={false}
        animate={
          bursting
            ? { opacity: [0, 0.12, 0], scale: [0.82, 1.08, 1.34] }
            : { opacity: 0, scale: 0.82 }
        }
        transition={{ duration: 0.52, ease: "easeOut" }}
      />

      <span className="relative inline-flex items-center justify-center">
        <motion.span
          className="absolute inset-0 inline-flex items-center justify-center"
          initial={false}
          animate={{
            opacity: filled ? 1 : 0,
            scale: filled ? 1 : 0.78,
          }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <Heart className={className} fill="currentColor" strokeWidth={1.9} />
        </motion.span>
        <motion.span
          className="inline-flex items-center justify-center"
          initial={false}
          animate={{
            opacity: filled ? 0 : 1,
            scale: filled ? 0.84 : 1,
          }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          <Heart className={className} fill="transparent" />
        </motion.span>
      </span>
    </motion.span>
  );
}
