"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const AnimatedText = ({ text }: { text: string }) => {
  return (
    <div className="flex">
      {text.split("").map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.05 }}
          className="inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </div>
  );
};

const Button = ({
  children,
  primary = false,
}: {
  children: React.ReactNode;
  primary?: boolean;
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`px-8 py-3 rounded-full text-lg font-semibold transition-all ${
        primary
          ? "bg-white text-purple-700 hover:bg-opacity-90"
          : "bg-transparent border-2 border-white text-white hover:bg-white hover:text-purple-700"
      }`}
    >
      {children}
    </motion.button>
  );
};

const BackgroundAnimation = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white/10 animate-bounce"
          style={{
            width: `${Math.random() * 10 + 5}px`,
            height: `${Math.random() * 10 + 5}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  );
};

export default function CoolBlogLanding() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative h-screen w-full bg-gradient-to-br from-purple-700 via-pink-600 to-orange-500 flex flex-col items-center justify-center overflow-hidden">
      <BackgroundAnimation />

      <div className="relative z-10 text-center space-y-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
            <AnimatedText text="Welcome to Brainwave" />
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8">
            Where ideas flourish and stories captivate
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 justify-center"
        >
          <div onClick={() => router.push("/Signup")}>
            <Button primary>Sign Up</Button>
          </div>
          <div onClick={() => router.push("/Login")}>
            <Button primary>Sign In</Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
