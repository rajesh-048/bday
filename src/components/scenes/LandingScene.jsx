import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, ArrowRight, Play, Gift, Star } from 'lucide-react';
import GiftBox3D from '../three/GiftBox3D';
import { useBirthdayStore } from '../../store/birthdayStore';

export default function LandingScene({ playEffect }) {
  const setScene = useBirthdayStore(state => state.setCurrentScene);
  const setIsRecipientView = useBirthdayStore(state => state.setIsRecipientView);

  const handleStartCreate = () => {
    playEffect('sparkle');
    setIsRecipientView(false);
    setScene(2);
  };

  const handlePreviewSurprise = () => {
    playEffect('pop');
    setIsRecipientView(true);
    setScene(4);
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center px-4 py-16 z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="w-full max-w-xl text-center"
      >
        {/* Top badge */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border-pink-500/30 text-pink-300 text-xs font-semibold uppercase tracking-widest mb-6"
        >
          <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
          <span>Interactive 3D Experience</span>
          <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
        </motion.div>

        {/* 3D Gift centerpiece */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="my-2"
        >
          <GiftBox3D isOpened={false} onOpen={handlePreviewSurprise} />
        </motion.div>

        {/* Hero title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-4 leading-tight"
        >
          Create a Birthday Memory <br />
          <span className="text-gradient-pink italic font-serif">They'll Never Forget ✨</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-slate-300 text-base sm:text-lg max-w-md mx-auto mb-8 font-light leading-relaxed"
        >
          Turn your feelings into an interactive 3D world — with a birthday song, candle-blowing, and a handwritten letter.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4"
        >
          <button
            onClick={handleStartCreate}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white font-semibold shadow-[0_0_30px_rgba(255,110,180,0.5)] hover:shadow-[0_0_45px_rgba(255,110,180,0.8)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 text-base group"
          >
            <Gift className="w-5 h-5 text-yellow-300" />
            <span>Create Your Surprise</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={handlePreviewSurprise}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl glass-card hover:bg-white/10 text-white font-medium hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 text-base border-white/20"
          >
            <Play className="w-4 h-4 text-pink-400 fill-pink-400" />
            <span>See Demo Preview</span>
          </button>
        </motion.div>

        {/* Feature highlights */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center px-4"
        >
          {[
            { icon: '🎂', label: '3D Cake & Candles' },
            { icon: '🎵', label: 'Birthday Song' },
            { icon: '💌', label: '3D Letter Envelope' },
            { icon: '📸', label: 'Polaroid Memories' },
          ].map((feat, i) => (
            <div
              key={i}
              className="glass-card rounded-xl py-3 px-2 text-xs text-white/60 font-medium"
            >
              <span className="text-xl block mb-1">{feat.icon}</span>
              {feat.label}
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
