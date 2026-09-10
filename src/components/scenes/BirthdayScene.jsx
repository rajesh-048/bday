import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, PartyPopper, Cake, Music } from 'lucide-react';
import confetti from 'canvas-confetti';
import GlassCard from '../ui/GlassCard';
import { useBirthdayStore } from '../../store/birthdayStore';

export default function BirthdayScene({ playEffect, playBirthdaySong, stopBirthdaySong }) {
  const { recipientName, nextScene } = useBirthdayStore();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // 🎵 Start the birthday song as soon as this scene opens!
    playBirthdaySong();

    // Celebration confetti - staggered burst
    const burstConfetti = () => {
      const duration = 3500;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({ particleCount: 2, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#ff6eb4', '#c084fc', '#fbbf24'] });
        confetti({ particleCount: 2, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#ff6eb4', '#c084fc', '#fbbf24'] });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
    };

    burstConfetti();

    // Delayed content reveal for dramatic effect
    const timer = setTimeout(() => setShowContent(true), 600);

    return () => {
      clearTimeout(timer);
      stopBirthdaySong();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleYesClick = () => {
    playEffect('chime');
    nextScene();
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center px-4 py-16 z-10 text-center">
      {/* Floating decorative emoji balloons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {['🎈', '🎊', '🎉', '🎈', '🎊', '🎈', '🎉'].map((emoji, i) => (
          <motion.span
            key={i}
            initial={{ y: '110vh', x: `${10 + i * 12}vw`, opacity: 0.7 }}
            animate={{ y: '-10vh' }}
            transition={{ duration: 6 + i * 1.5, repeat: Infinity, ease: 'linear', delay: i * 0.7 }}
            className="absolute text-3xl sm:text-4xl"
          >
            {emoji}
          </motion.span>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="max-w-lg w-full"
      >
        <GlassCard glow className="p-8 sm:p-10">
          {/* Party Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 250, delay: 0.2 }}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500/30 to-purple-500/30 border border-pink-400/50 flex items-center justify-center mx-auto mb-5 shadow-[0_0_40px_rgba(255,110,180,0.6)]"
          >
            <PartyPopper className="w-10 h-10 text-pink-300" />
          </motion.div>

          {/* Music indicator badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-400/30 mb-4"
          >
            <Music className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
            <span className="text-[11px] text-yellow-300 font-medium">♪ Happy Birthday Song Playing</span>
          </motion.div>

          {/* Celebration Badge */}
          <span className="block text-xs uppercase tracking-widest text-pink-300/80 font-semibold mb-3">
            ✨ Celebration Time ✨
          </span>

          {/* Main Heading */}
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-3 leading-tight">
            Happy Birthday,
          </h1>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-gradient-pink font-serif text-5xl sm:text-6xl font-bold italic mb-6"
          >
            {recipientName}! 🎂
          </motion.h2>

          {showContent && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <p className="text-white/70 text-base mb-8 font-light leading-relaxed max-w-sm mx-auto">
                Today is your special day! 🌟 The whole universe is celebrating YOU. Ready for a surprise that will make you smile?
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleYesClick}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white font-bold shadow-[0_0_30px_rgba(255,110,180,0.6)] hover:shadow-[0_0_45px_rgba(255,110,180,0.9)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 text-lg group"
                >
                  <span>YES ✨ Show Me!</span>
                  <Heart className="w-5 h-5 text-pink-200 fill-pink-200 group-hover:animate-bounce" />
                </button>

                <button
                  onClick={handleYesClick}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-xl glass-card text-white/50 hover:text-white text-sm transition-all"
                >
                  Maybe Later
                </button>
              </div>
            </motion.div>
          )}
        </GlassCard>
      </motion.div>
    </div>
  );
}
