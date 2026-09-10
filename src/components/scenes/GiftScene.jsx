import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Gift, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import GiftBox3D from '../three/GiftBox3D';
import { useBirthdayStore } from '../../store/birthdayStore';

export default function GiftScene({ playEffect }) {
  const { recipientName, nextScene } = useBirthdayStore();
  const [isOpened, setIsOpened] = useState(false);

  const handleOpenGift = () => {
    if (isOpened) return;
    setIsOpened(true);
    playEffect('sparkle');

    // Multi-burst confetti
    const colors = ['#ff6eb4', '#c084fc', '#fbbf24', '#60a5fa', '#ff1493'];

    setTimeout(() => {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.55 }, colors });
    }, 200);

    setTimeout(() => {
      confetti({ particleCount: 60, spread: 100, origin: { y: 0.45 }, colors });
    }, 600);

    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 120,
        origin: { y: 0.5 },
        colors,
        shapes: ['circle'],
        scalar: 1.2,
      });
    }, 1000);

    // Transition after celebration
    setTimeout(() => nextScene(), 3200);
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center px-4 py-16 z-10 text-center">
      {/* Floating sparkle decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 100, x: `${15 + i * 14}vw` }}
            animate={{ opacity: [0, 0.8, 0], y: -50 }}
            transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.8 }}
            className="absolute text-2xl"
          >
            {['✨', '💫', '⭐', '🌟', '💖', '✨'][i]}
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-block px-4 py-1.5 rounded-full glass-card-glow text-pink-300 text-xs font-semibold uppercase tracking-widest mb-4"
        >
          🎁 A surprise for {recipientName}
        </motion.span>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-2 leading-tight">
          {isOpened ? (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
              Something Special Unfolds... ✨
            </motion.span>
          ) : (
            "Tap The Gift To Open 🎁"
          )}
        </h1>
        <p className="text-white/60 text-sm mb-4">
          {isOpened ? "Get ready for the celebration of the year..." : "A magical 3D surprise is waiting just for you."}
        </p>

        {/* 3D Gift Box */}
        <div className="my-2">
          <GiftBox3D isOpened={isOpened} onOpen={handleOpenGift} />
        </div>

        {/* CTA Button */}
        <AnimatePresence>
          {!isOpened && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={handleOpenGift}
              className="mt-4 px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white font-bold shadow-[0_0_30px_rgba(255,110,180,0.6)] hover:shadow-[0_0_45px_rgba(255,110,180,0.9)] hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2 text-base"
            >
              <Gift className="w-5 h-5 text-yellow-300 animate-bounce" />
              <span>Open Your Surprise</span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Loading message after opened */}
        <AnimatePresence>
          {isOpened && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              className="mt-6 flex items-center justify-center gap-2 text-yellow-300 font-medium text-sm"
            >
              <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '3s' }} />
              <span>Preparing your celebration...</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
