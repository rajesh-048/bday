import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, Sparkles, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import BirthdayCake3D from '../three/BirthdayCake3D';
import { useBirthdayStore } from '../../store/birthdayStore';

export default function WishScene({ playEffect }) {
  const { recipientName, nextScene } = useBirthdayStore();
  const [isLit, setIsLit] = useState(true);
  const [showFireworks, setShowFireworks] = useState(false);

  const handleBlowOut = () => {
    if (!isLit) return;
    setIsLit(false);
    playEffect('blow');

    // Delayed fireworks after candles go out
    setTimeout(() => {
      setShowFireworks(true);
      playEffect('chime');

      // Starburst fireworks confetti
      const colors = ['#fbbf24', '#ff6eb4', '#60a5fa', '#c084fc', '#ffffff'];
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.4 }, colors, startVelocity: 45 });

      setTimeout(() => {
        confetti({ particleCount: 60, spread: 80, origin: { y: 0.5 }, colors });
      }, 400);

      setTimeout(() => {
        confetti({ particleCount: 100, spread: 120, origin: { y: 0.45 }, colors, shapes: ['star'], scalar: 1.3 });
      }, 800);
    }, 600);

    // Auto transition
    setTimeout(() => nextScene(), 4000);
  };

  return (
    <div className={`relative min-h-screen flex flex-col justify-center items-center px-4 py-16 z-10 text-center transition-all duration-1000 ${
      !isLit ? 'bg-black/70' : ''
    }`}>
      {/* Floating stars when dark */}
      {!isLit && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.5, 1] }}
              transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: i * 0.2 }}
              className="absolute text-yellow-200 text-xs"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            >
              ✦
            </motion.div>
          ))}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full"
      >
        <span className="inline-block px-4 py-1.5 rounded-full glass-card text-yellow-300 text-xs font-semibold uppercase tracking-widest mb-4">
          🕯️ Make A Wish
        </span>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-2">
          {isLit ? (
            <>Close your eyes...<br /><span className="text-gradient-gold">Make a wish ✨</span></>
          ) : showFireworks ? (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
              🌟 Your Wish Is Set Free! 🌟
            </motion.span>
          ) : (
            "..."
          )}
        </h1>

        <p className="text-white/60 text-sm mb-4">
          {isLit
            ? `${recipientName}, tap the candles or button to blow them out.`
            : "May all your dreams come true! ❤️"
          }
        </p>

        {/* 3D Cake */}
        <div className="my-2">
          <BirthdayCake3D isLit={isLit} onBlow={handleBlowOut} />
        </div>

        {/* Blow Button */}
        <AnimatePresence>
          {isLit ? (
            <motion.button
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={handleBlowOut}
              className="mt-4 px-8 py-4 rounded-2xl bg-gradient-to-r from-yellow-500 via-amber-500 to-pink-500 text-white font-bold shadow-[0_0_30px_rgba(251,191,36,0.6)] hover:shadow-[0_0_45px_rgba(251,191,36,0.8)] hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2 text-base"
            >
              <Wind className="w-5 h-5 animate-pulse" />
              <span>Blow Out Candles 💨</span>
            </motion.button>
          ) : showFireworks ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 flex items-center justify-center gap-2 text-yellow-300/80 text-sm font-medium"
            >
              <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '3s' }} />
              <span>Opening your personal letter...</span>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
