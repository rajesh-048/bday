import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, RotateCcw, Share2, Plus, Sparkles, Music } from 'lucide-react';
import confetti from 'canvas-confetti';
import GlassCard from '../ui/GlassCard';
import { useBirthdayStore } from '../../store/birthdayStore';

export default function FinalRevealScene({ playEffect, playBirthdaySong, onShareClick }) {
  const { recipientName, senderName, setCurrentScene, setIsRecipientView } = useBirthdayStore();

  useEffect(() => {
    // Grand finale fireworks — 3 waves
    const colors = ['#ff6eb4', '#c084fc', '#fbbf24', '#60a5fa', '#ffffff'];

    const wave = (delay, count, opts = {}) => {
      setTimeout(() => {
        confetti({
          particleCount: count,
          origin: { y: 0.6 },
          colors,
          ...opts,
        });
      }, delay);
    };

    wave(0, 80, { spread: 26, startVelocity: 55 });
    wave(200, 60, { spread: 60 });
    wave(500, 100, { spread: 100, decay: 0.91, scalar: 0.8 });
    wave(800, 40, { spread: 120, startVelocity: 25, scalar: 1.2 });
    wave(1200, 60, { spread: 160, shapes: ['star'], scalar: 1.5 });

    playEffect('chime');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleReplay = () => {
    playEffect('sparkle');
    setCurrentScene(4);
  };

  const handleCreateAnother = () => {
    playEffect('pop');
    setIsRecipientView(false);
    setCurrentScene(1);
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center px-4 py-16 z-10 text-center">
      {/* Floating tiny stars background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0.3, 0.9, 0] }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              delay: i * 0.3,
            }}
            className="absolute text-yellow-200"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${6 + Math.random() * 8}px`,
            }}
          >
            ✦
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="max-w-lg w-full"
      >
        <GlassCard glow className="p-8 sm:p-12 relative overflow-hidden">
          {/* Radial glow overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,110,180,0.15),transparent_60%)] pointer-events-none" />

          <div className="relative z-10">
            {/* Heart icon */}
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500/20 to-red-500/20 border border-pink-400/50 flex items-center justify-center mx-auto mb-6 shadow-[0_0_50px_rgba(255,110,180,0.7)]"
            >
              <Heart className="w-10 h-10 text-pink-400 fill-pink-400" />
            </motion.div>

            <span className="text-xs uppercase tracking-widest text-pink-300/70 font-semibold mb-2 block">
              The Magic Continues
            </span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-serif text-4xl sm:text-5xl font-bold text-white mb-3 leading-tight"
            >
              You Are Truly <br />
              <span className="text-gradient-pink italic">Special ❤️</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-white/70 text-base mb-2 font-light"
            >
              This little interactive world was created just for you,{' '}
              <strong className="text-pink-300">{recipientName}</strong>.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="text-yellow-300 font-handwritten text-2xl mb-8"
            >
              — With all my love, {senderName} 💛
            </motion.p>

            {/* Action CTAs */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="space-y-3 pt-4 border-t border-white/10"
            >
              <button
                onClick={handleReplay}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white font-bold shadow-[0_0_30px_rgba(255,110,180,0.6)] hover:shadow-[0_0_45px_rgba(255,110,180,0.9)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 text-base"
              >
                <RotateCcw className="w-5 h-5 text-yellow-300" />
                <span>Replay Surprise Experience 🎁</span>
              </button>

              {onShareClick && (
                <button
                  onClick={onShareClick}
                  className="w-full py-3.5 rounded-xl glass-card text-white font-medium hover:bg-white/10 text-sm flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4 text-pink-400" />
                  <span>Share This Surprise</span>
                </button>
              )}

              <button
                onClick={handleCreateAnother}
                className="w-full py-3.5 rounded-xl glass-card text-white/60 hover:text-white text-sm flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create A Surprise For Someone Else</span>
              </button>
            </motion.div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
