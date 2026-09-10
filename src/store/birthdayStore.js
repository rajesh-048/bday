import { create } from 'zustand';

// Sample fallback memory photos (High quality Unsplash images)
const DEFAULT_PHOTOS = [
  { id: 1, url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80', caption: 'Moments of joy ✨' },
  { id: 2, url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80', caption: 'Celebrations & Smiles 🎉' },
  { id: 3, url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80', caption: 'A memory worth keeping ❤️' },
  { id: 4, url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80', caption: 'Shining bright forever ✨' }
];

export const THEMES = {
  'royal-purple': {
    name: 'Royal Purple',
    bgGradient: 'from-[#0a0618] via-[#1a0836] to-[#080415]',
    accent: '#ff6eb4',
    glow: 'rgba(255, 110, 180, 0.5)',
    cardBorder: 'rgba(255, 110, 180, 0.3)'
  },
  'rose-gold': {
    name: 'Rose Gold',
    bgGradient: 'from-[#1c0b16] via-[#331326] to-[#12050e]',
    accent: '#f472b6',
    glow: 'rgba(244, 114, 182, 0.5)',
    cardBorder: 'rgba(244, 114, 182, 0.3)'
  },
  'midnight-blue': {
    name: 'Midnight Sapphire',
    bgGradient: 'from-[#030b1e] via-[#0a1e45] to-[#020714]',
    accent: '#60a5fa',
    glow: 'rgba(96, 165, 250, 0.5)',
    cardBorder: 'rgba(96, 165, 250, 0.3)'
  },
  'sunset-glow': {
    name: 'Sunset Magic',
    bgGradient: 'from-[#1a0814] via-[#3d1225] to-[#14040a]',
    accent: '#fb923c',
    glow: 'rgba(251, 146, 60, 0.5)',
    cardBorder: 'rgba(251, 146, 60, 0.3)'
  }
};

export const useBirthdayStore = create((set, get) => ({
  // Form Data
  recipientName: 'Raji',
  senderName: 'Your Bestie',
  message: 'Some people make ordinary days feel special. You are one of those people. Happy Birthday! May your year ahead be filled with unlimited smiles, endless laughter, and beautiful surprises! ❤️',
  photos: DEFAULT_PHOTOS,
  theme: 'royal-purple',
  music: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=piano-moment-11447.mp3', // Gentle ambient piano
  
  // Navigation & Scene States
  currentScene: 1, // 1 to 9
  isRecipientView: false,
  isPlayingAudio: false,
  isWishBlown: false,
  isGiftOpened: false,
  isLetterOpened: false,

  // Actions
  setRecipientName: (name) => set({ recipientName: name }),
  setSenderName: (name) => set({ senderName: name }),
  setMessage: (msg) => set({ message: msg }),
  setPhotos: (photos) => set({ photos }),
  addPhoto: (photo) => set((state) => ({ photos: [...state.photos, photo] })),
  removePhoto: (id) => set((state) => ({ photos: state.photos.filter(p => p.id !== id) })),
  setTheme: (theme) => set({ theme }),
  setMusic: (music) => set({ music }),
  
  setCurrentScene: (scene) => set({ currentScene: scene }),
  nextScene: () => set((state) => ({ currentScene: Math.min(state.currentScene + 1, 9) })),
  prevScene: () => set((state) => ({ currentScene: Math.max(state.currentScene - 1, 1) })),
  
  setIsRecipientView: (isRecipient) => set({ isRecipientView: isRecipient }),
  setIsPlayingAudio: (isPlaying) => set({ isPlayingAudio: isPlaying }),
  setIsWishBlown: (blown) => set({ isWishBlown: blown }),
  setIsGiftOpened: (opened) => set({ isGiftOpened: opened }),
  setIsLetterOpened: (opened) => set({ isLetterOpened: opened }),

  // Share Link Helper (Encodes state into base64 URL parameter)
  getShareableUrl: () => {
    const state = get();
    const data = {
      r: state.recipientName,
      s: state.senderName,
      m: state.message,
      t: state.theme,
      p: state.photos.map(p => ({ url: p.url, caption: p.caption }))
    };
    try {
      const json = JSON.stringify(data);
      const encoded = btoa(encodeURIComponent(json));
      return `${window.location.origin}${window.location.pathname}?surprise=${encoded}#gift`;
    } catch (e) {
      console.error("Encoding error", e);
      return window.location.href;
    }
  },

  // Load from URL parameter if present
  loadFromUrl: () => {
    const params = new URLSearchParams(window.location.search);
    const surpriseData = params.get('surprise');
    if (surpriseData) {
      try {
        const decoded = decodeURIComponent(atob(surpriseData));
        const data = JSON.parse(decoded);
        set({
          recipientName: data.r || 'Special One',
          senderName: data.s || 'Someone special',
          message: data.m || 'Happy Birthday!',
          theme: data.t || 'royal-purple',
          photos: data.p && data.p.length > 0 ? data.p.map((p, idx) => ({ id: idx, url: p.url, caption: p.caption })) : DEFAULT_PHOTOS,
          isRecipientView: true,
          currentScene: 4 // Jump directly to Gift Scene for recipient!
        });
        return true;
      } catch (e) {
        console.error("Failed to parse share URL", e);
      }
    }
    return false;
  }
}));
