import React from 'react';
import { Volume2, VolumeX, Sparkles, Home, Share2 } from 'lucide-react';
import { useBirthdayStore } from '../../store/birthdayStore';

export default function FloatingNav({ toggleAudio, isPlayingAudio, onShareClick }) {
  const currentScene = useBirthdayStore(state => state.currentScene);
  const isRecipientView = useBirthdayStore(state => state.isRecipientView);
  const setCurrentScene = useBirthdayStore(state => state.setCurrentScene);

  return (
    <div className="fixed top-4 left-0 right-0 z-50 px-4 flex justify-between items-center pointer-events-none">
      {/* Left side: Brand or Home */}
      <div className="pointer-events-auto flex items-center space-x-2">
        <button
          onClick={() => setCurrentScene(1)}
          className="glass-card p-2.5 rounded-full hover:scale-105 active:scale-95 transition-all text-pink-300 hover:text-white flex items-center gap-2 px-4 text-xs font-semibold tracking-wider uppercase"
        >
          <Sparkles className="w-4 h-4 text-pink-400 animate-spin" style={{ animationDuration: '8s' }} />
          <span className="hidden sm:inline">Moment Magical</span>
        </button>
      </div>

      {/* Center: Recipient View Scene Progress Dots */}
      {isRecipientView && currentScene >= 4 && (
        <div className="pointer-events-auto glass-card px-4 py-2 rounded-full flex items-center space-x-2">
          {[4, 5, 6, 7, 8, 9].map((sceneNum) => (
            <button
              key={sceneNum}
              onClick={() => setCurrentScene(sceneNum)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                currentScene === sceneNum 
                  ? 'bg-pink-400 scale-125 shadow-[0_0_10px_#ff6eb4]' 
                  : 'bg-white/20 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      )}

      {/* Right side: Controls */}
      <div className="pointer-events-auto flex items-center space-x-2">
        {onShareClick && (
          <button
            onClick={onShareClick}
            className="glass-card p-2.5 rounded-full hover:scale-105 active:scale-95 transition-all text-yellow-300 hover:text-white"
            title="Share Surprise"
          >
            <Share2 className="w-5 h-5" />
          </button>
        )}

        <button
          onClick={toggleAudio}
          className={`glass-card p-2.5 rounded-full hover:scale-105 active:scale-95 transition-all ${
            isPlayingAudio ? 'text-pink-400 shadow-[0_0_15px_rgba(255,110,180,0.5)]' : 'text-white/60'
          }`}
          title={isPlayingAudio ? 'Mute Music' : 'Play Music'}
        >
          {isPlayingAudio ? <Volume2 className="w-5 h-5 animate-pulse" /> : <VolumeX className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}
