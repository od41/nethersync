"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation, Variant, useInView } from "framer-motion";

type Direction = "up" | "down" | "left" | "right";

type FadeInProps = {
  children: React.ReactNode;
  className?: string;
  initialDelay?: number;
  repeatDelay?: number;
  direction?: Direction;
  once?: boolean;
  customAnimation?: {
    hidden: Variant;
    visible: Variant;
  };
};

const transitionDuration = 0.6;

const defaultAnimations: Record<
  Direction,
  { hidden: Variant; visible: Variant }
> = {
  up: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: transitionDuration, ease: [0.25, 0.1, 0.25, 1] },
    },
  },
  down: {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: transitionDuration, ease: [0.25, 0.1, 0.25, 1] },
    },
  },
  left: {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: transitionDuration, ease: [0.25, 0.1, 0.25, 1] },
    },
  },
  right: {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: transitionDuration, ease: [0.25, 0.1, 0.25, 1] },
    },
  },
};

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  className,
  initialDelay = 0,
  repeatDelay,
  direction = "up",
  once = false,
  customAnimation,
}) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.5, once });
  const [isFirstAnimation, setIsFirstAnimation] = useState(true);

  const animation = customAnimation || defaultAnimations[direction];

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const animate = () => {
      if (isFirstAnimation && initialDelay > 0) {
        timeout = setTimeout(() => {
          controls.start("visible");
          setIsFirstAnimation(false);
        }, initialDelay * 1000);
      } else {
        controls.start("visible");
      }

      if (repeatDelay) {
        timeout = setTimeout(async () => {
          await controls.start("hidden");
          controls.start("visible");
        }, repeatDelay);
      }
    };

    if (isInView) {
      animate();
    } else {
      controls.start("hidden");
    }

    return () => clearTimeout(timeout);
  }, [isInView, isFirstAnimation, initialDelay, repeatDelay, controls]);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={controls}
      variants={animation}
    >
      {children}
    </motion.div>
  );
};
