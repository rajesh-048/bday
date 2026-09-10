import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Mail, ArrowRight } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import Envelope3D from '../three/Envelope3D';
import { useBirthdayStore } from '../../store/birthdayStore';

export default function LetterScene({ playEffect }) {
  const { recipientName, senderName, message, photos, nextScene } = useBirthdayStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenLetter = () => {
    if (isOpen) return;
    setIsOpen(true);
    playEffect('sparkle');
  };

  // Animate message text letter by letter effect via staggered word spans
  const words = message.split(' ');

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center px-4 py-16 z-10 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full"
      >
        <AnimatePresence mode="wait">
          {!isOpen ? (
            <motion.div key="envelope" exit={{ opacity: 0, scale: 0.9 }}>
              <span className="inline-block px-4 py-1 rounded-full glass-card text-pink-300 text-xs font-semibold uppercase tracking-widest mb-4">
                💌 Personal Letter
              </span>

              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-2">
                A Special Note For <span className="text-gradient-pink italic">{recipientName}</span>
              </h1>
              <p className="text-white/60 text-sm mb-4">
                Tap the envelope to unseal your letter.
              </p>

              <Envelope3D isOpen={isOpen} onOpen={handleOpenLetter} />

              <button
                onClick={handleOpenLetter}
                className="mt-4 px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold shadow-[0_0_30px_rgba(255,110,180,0.5)] hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2 text-base"
              >
                <Mail className="w-5 h-5 text-yellow-300" />
                <span>Open Letter ✉️</span>
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="letter"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              {/* Floating side photos */}
              {photos[0] && (
                <motion.div
                  initial={{ opacity: 0, x: -50, rotate: -12 }}
                  animate={{ opacity: 1, x: 0, rotate: -6 }}
                  transition={{ delay: 0.5 }}
                  className="hidden lg:block absolute -left-24 top-8 w-32 shadow-2xl rounded-xl overflow-hidden border-2 border-white/20"
                >
                  <img src={photos[0].url} alt="Memory" className="w-full h-32 object-cover" />
                </motion.div>
              )}
              {photos[1] && (
                <motion.div
                  initial={{ opacity: 0, x: 50, rotate: 12 }}
                  animate={{ opacity: 1, x: 0, rotate: 5 }}
                  transition={{ delay: 0.7 }}
                  className="hidden lg:block absolute -right-24 top-16 w-32 shadow-2xl rounded-xl overflow-hidden border-2 border-white/20"
                >
                  <img src={photos[1].url} alt="Memory" className="w-full h-32 object-cover" />
                </motion.div>
              )}

              {/* Letter card */}
              <GlassCard glow className="p-8 sm:p-12 text-left relative overflow-hidden">
                {/* Subtle paper texture overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,110,180,0.05),transparent_50%)] pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-6 border-b border-pink-400/30 pb-4">
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="font-serif italic text-pink-300 text-xl font-bold"
                    >
                      Dear {recipientName},
                    </motion.span>
                    <Heart className="w-6 h-6 text-pink-400 fill-pink-400 animate-pulse" />
                  </div>

                  {/* Staggered word reveal for handwriting feel */}
                  <p className="font-handwritten text-2xl sm:text-3xl text-pink-100 leading-relaxed mb-8 font-medium tracking-wide">
                    "
                    {words.map((word, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + i * 0.06 }}
                        className="inline-block mr-[0.3em]"
                      >
                        {word}
                      </motion.span>
                    ))}
                    "
                  </p>

                  <div className="flex justify-between items-center pt-4 border-t border-pink-400/30">
                    <span className="text-xs text-white/40">Written with love</span>
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.5 }}
                      className="font-handwritten text-xl text-yellow-300 font-bold"
                    >
                      — {senderName} ❤️
                    </motion.span>
                  </div>
                </div>
              </GlassCard>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2 }}
                onClick={() => {
                  playEffect('pop');
                  nextScene();
                }}
                className="mt-8 px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold shadow-[0_0_30px_rgba(255,110,180,0.6)] hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2 text-base"
              >
                <span>See Our Memories 📸</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
