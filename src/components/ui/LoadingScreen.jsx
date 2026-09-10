import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#080415]">
      {/* Animated gradient orb */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        className="w-28 h-28 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 blur-xl opacity-60 absolute"
      />

      {/* Center icon */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
        className="relative z-10 mb-6"
      >
        <Sparkles className="w-12 h-12 text-yellow-300 drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]" />
      </motion.div>

      {/* Text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-white/70 text-sm font-medium tracking-wider uppercase"
      >
        Creating your magical experience...
      </motion.p>

      {/* Progress bar */}
      <div className="mt-4 w-48 h-1 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 2.5, ease: 'easeInOut' }}
          className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
        />
      </div>
    </div>
  );
}
