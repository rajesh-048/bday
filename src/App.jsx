import React, { useEffect, useState, lazy, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useBirthdayStore, THEMES } from './store/birthdayStore';
import { useAudio } from './hooks/useAudio';

import ParticleCanvas from './components/three/ParticleCanvas';
import FloatingNav from './components/ui/FloatingNav';
import LoadingScreen from './components/ui/LoadingScreen';

// Lazy-load heavy scene components for faster initial paint
const LandingScene = lazy(() => import('./components/scenes/LandingScene'));
const PersonalizationScene = lazy(() => import('./components/scenes/PersonalizationScene'));
const ShareScene = lazy(() => import('./components/scenes/ShareScene'));
const GiftScene = lazy(() => import('./components/scenes/GiftScene'));
const BirthdayScene = lazy(() => import('./components/scenes/BirthdayScene'));
const WishScene = lazy(() => import('./components/scenes/WishScene'));
const LetterScene = lazy(() => import('./components/scenes/LetterScene'));
const MemoriesScene = lazy(() => import('./components/scenes/MemoriesScene'));
const FinalRevealScene = lazy(() => import('./components/scenes/FinalRevealScene'));

export default function App() {
  const currentScene = useBirthdayStore(state => state.currentScene);
  const themeKey = useBirthdayStore(state => state.theme);
  const loadFromUrl = useBirthdayStore(state => state.loadFromUrl);
  const setCurrentScene = useBirthdayStore(state => state.setCurrentScene);

  const {
    isPlayingAudio,
    togglePlay,
    playEffect,
    playBirthdaySong,
    stopBirthdaySong,
  } = useAudio();

  const [isInitLoading, setIsInitLoading] = useState(true);

  useEffect(() => {
    const hasSurprise = loadFromUrl();
    if (hasSurprise) {
      console.log('🎁 Surprise loaded from URL!');
    }
    // Show loading screen for at least 1.5s to let assets preload
    const timer = setTimeout(() => setIsInitLoading(false), 1800);
    return () => clearTimeout(timer);
  }, [loadFromUrl]);

  const activeTheme = THEMES[themeKey] || THEMES['royal-purple'];

  // Audio props bundle to pass to scenes
  const audioProps = { playEffect, playBirthdaySong, stopBirthdaySong };

  const renderScene = () => {
    switch (currentScene) {
      case 1:  return <LandingScene {...audioProps} />;
      case 2:  return <PersonalizationScene {...audioProps} />;
      case 3:  return <ShareScene {...audioProps} />;
      case 4:  return <GiftScene {...audioProps} />;
      case 5:  return <BirthdayScene {...audioProps} />;
      case 6:  return <WishScene {...audioProps} />;
      case 7:  return <LetterScene {...audioProps} />;
      case 8:  return <MemoriesScene {...audioProps} />;
      case 9:  return <FinalRevealScene {...audioProps} onShareClick={() => setCurrentScene(3)} />;
      default: return <LandingScene {...audioProps} />;
    }
  };

  // Show loading screen on initial load
  if (isInitLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className={`relative min-h-screen bg-gradient-to-br ${activeTheme.bgGradient} text-white overflow-hidden transition-colors duration-700`}>
      {/* 3D Background Particles (lightweight) */}
      <ParticleCanvas showHearts={currentScene >= 4} />

      {/* Floating Navigation */}
      <FloatingNav
        toggleAudio={togglePlay}
        isPlayingAudio={isPlayingAudio}
        onShareClick={currentScene >= 4 ? () => setCurrentScene(3) : null}
      />

      {/* Main Scene Content */}
      <main className="relative z-10 min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScene}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="min-h-screen"
          >
            <Suspense fallback={
              <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-pink-400 border-t-transparent rounded-full animate-spin" />
              </div>
            }>
              {renderScene()}
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
