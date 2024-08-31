"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import content from "@/content/home.content";

type LoopoingSentencesProps = {
  sentences: string | string[];
  delay?: number;
};
export const LoopingSentences: React.FC<LoopoingSentencesProps> = ({
  sentences,
  delay = 4,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % sentences.length);
    }, delay * 1000);

    return () => clearInterval(interval);
  }, [sentences.length]);

  const sentenceVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.04,
      },
    },
    exit: { opacity: 0, y: -20 },
  };

  const characterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="h-auto min-h-20 pb-3 flex  ">
      <AnimatePresence mode="wait">
        <span className="inline-block">
          {content.hero.heading}{" "}
          <motion.span
            key={currentIndex}
            variants={sentenceVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="inline-block "
          >
            {sentences[currentIndex].split(" ").map((word, wordIndex) => (
              <motion.span
                key={wordIndex}
                className="inline-block whitespace-nowrap" // Prevent word break
                style={{ marginRight: "0.25em" }} // Add space between words
              >
                {word.split("").map((char, charIndex) => (
                  <motion.span
                    key={`${wordIndex}-${charIndex}`}
                    variants={characterVariants}
                    className="inline-block border-b-4 border-b-primary"
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.span>
            ))}
          </motion.span>
        </span>
      </AnimatePresence>
    </div>
  );
};
