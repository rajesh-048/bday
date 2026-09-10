import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Sparkles, Eye, ArrowLeft, Heart, Share2, QrCode } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import { useBirthdayStore } from '../../store/birthdayStore';

export default function ShareScene({ playEffect }) {
  const { getShareableUrl, setCurrentScene, setIsRecipientView, recipientName } = useBirthdayStore();
  const [copied, setCopied] = useState(false);
  const shareUrl = getShareableUrl();

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    playEffect('sparkle');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleTestRecipientFlow = () => {
    playEffect('pop');
    setIsRecipientView(true);
    setCurrentScene(4); // Jump directly to Gift Scene!
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center px-4 py-16 z-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg text-center"
      >
        <GlassCard glow className="p-8">
          <div className="w-16 h-16 rounded-full bg-pink-500/20 border border-pink-400/40 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(255,110,180,0.5)]">
            <Sparkles className="w-8 h-8 text-yellow-300 animate-spin" style={{ animationDuration: '6s' }} />
          </div>

          <h2 className="font-serif text-3xl font-bold text-white mb-2">
            Surprise Created! 🎉
          </h2>
          <p className="text-white/60 text-sm mb-6">
            Your personalized 3D world for <strong className="text-pink-300">{recipientName}</strong> is ready to share!
          </p>

          {/* Share Link Box */}
          <div className="relative mb-6">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="w-full px-4 py-3.5 pr-28 rounded-xl glass-input text-xs font-mono text-pink-200 select-all"
            />
            <button
              onClick={handleCopy}
              className="absolute right-1.5 top-1.5 bottom-1.5 px-4 rounded-lg bg-pink-500 text-white font-medium text-xs flex items-center gap-1.5 hover:bg-pink-600 transition-all shadow-[0_0_15px_rgba(255,110,180,0.4)]"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-300" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleTestRecipientFlow}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold shadow-[0_0_30px_rgba(255,110,180,0.5)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 text-base"
            >
              <Eye className="w-5 h-5 text-yellow-300" />
              <span>Experience The Surprise (Recipient View)</span>
            </button>

            <button
              onClick={() => setCurrentScene(2)}
              className="w-full py-3 rounded-xl glass-card text-white/70 hover:text-white text-sm flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Edit Details</span>
            </button>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
