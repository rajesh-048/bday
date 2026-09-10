import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Maximize2, Heart } from 'lucide-react';
import { useBirthdayStore } from '../../store/birthdayStore';

export default function MemoriesScene({ playEffect }) {
  const { photos, nextScene } = useBirthdayStore();
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo);
    playEffect('sparkle');
  };

  const rotations = [-5, 3, -2, 5, -4, 3, -1, 4];

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center px-4 py-20 z-10 text-center">
      <div className="max-w-4xl w-full">
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-4 py-1.5 rounded-full glass-card text-pink-300 text-xs font-semibold uppercase tracking-widest mb-3"
        >
          📸 Memory Gallery
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-serif text-3xl sm:text-5xl font-bold text-white mb-3"
        >
          Our Precious <span className="text-gradient-pink italic">Memories</span> ✨
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-white/50 text-sm max-w-md mx-auto mb-10"
        >
          Every photo is a chapter of our story. Tap to view full size.
        </motion.p>

        {/* Polaroid Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 sm:gap-6 px-2">
          {photos.map((photo, idx) => (
            <motion.div
              key={photo.id || idx}
              initial={{ opacity: 0, y: 40, rotate: rotations[idx % rotations.length] }}
              animate={{ opacity: 1, y: 0, rotate: rotations[idx % rotations.length] }}
              transition={{ delay: 0.15 + idx * 0.12, duration: 0.5, ease: 'easeOut' }}
              whileHover={{ scale: 1.08, rotate: 0, zIndex: 50, transition: { duration: 0.25 } }}
              onClick={() => handlePhotoClick(photo)}
              className="polaroid cursor-pointer rounded-lg group relative"
            >
              <div className="w-full aspect-square overflow-hidden rounded-md mb-2 relative bg-slate-100">
                <img
                  src={photo.url}
                  alt={photo.caption || 'Memory'}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3">
                  <Maximize2 className="w-5 h-5 text-white drop-shadow-lg" />
                </div>
              </div>
              <p className="font-handwritten text-base text-slate-700 font-bold truncate px-1">
                {photo.caption || `Memory #${idx + 1}`}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Caption bar */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 + photos.length * 0.12 }}
          className="mt-8 text-white/40 text-xs font-light italic"
        >
          "A memory worth keeping forever." ❤️
        </motion.p>

        {/* Continue */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 + photos.length * 0.12 }}
          className="mt-8"
        >
          <button
            onClick={() => {
              playEffect('chime');
              nextScene();
            }}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold shadow-[0_0_30px_rgba(255,110,180,0.6)] hover:shadow-[0_0_45px_rgba(255,110,180,0.9)] hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2 text-base"
          >
            <span>Final Surprise ✨</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>

      {/* Full-screen Lightbox */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.75, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.75, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="polaroid max-w-lg w-full rounded-2xl p-4 relative"
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute -top-3 -right-3 p-2 rounded-full bg-pink-500 text-white shadow-lg hover:bg-pink-600 transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <img
                src={selectedPhoto.url}
                alt="Memory"
                className="w-full max-h-[65vh] object-contain rounded-xl mb-3"
              />

              <div className="flex items-center justify-center gap-2">
                <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
                <p className="font-handwritten text-xl text-slate-800 font-bold">
                  {selectedPhoto.caption || 'A moment to treasure ❤️'}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
