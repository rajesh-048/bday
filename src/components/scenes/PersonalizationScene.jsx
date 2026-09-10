import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, Upload, Trash2, Check, ArrowRight, ArrowLeft, Wand2, Image as ImageIcon, Music, Palette } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import GiftBox3D from '../three/GiftBox3D';
import { useBirthdayStore, THEMES } from '../../store/birthdayStore';

const AI_MESSAGE_PROMPTS = {
  emotional: "Dear [Name], some people make the world brighter just by being in it. You are truly one of a kind. Wishing you endless happiness, health, and love on your special day! ❤️",
  funny: "Happy Birthday [Name]! 🎉 You're not getting older, you're just leveling up! May your day be filled with cake, laughter, and zero adulting responsibilities today!",
  poetic: "Like stars that illuminate the night, your presence brings warmth and light to every moment. Happy Birthday, [Name] 🌸 May your year be as extraordinary as you are.",
  short: "To [Name], wishing you the happiest birthday filled with unforgettable memories and pure joy! 🎂✨"
};

export default function PersonalizationScene({ playEffect }) {
  const {
    recipientName, setRecipientName,
    senderName, setSenderName,
    message, setMessage,
    photos, addPhoto, removePhoto,
    theme, setTheme,
    setCurrentScene
  } = useBirthdayStore();

  const [activeTab, setActiveTab] = useState(1); // 1: Names & Message, 2: Photos, 3: Theme
  const [aiLoading, setAiLoading] = useState(false);

  const handleAiGenerate = (mood) => {
    setAiLoading(true);
    playEffect('sparkle');
    setTimeout(() => {
      const template = AI_MESSAGE_PROMPTS[mood] || AI_MESSAGE_PROMPTS.emotional;
      const formatted = template.replace(/\[Name\]/g, recipientName || 'Friend');
      setMessage(formatted);
      setAiLoading(false);
    }, 500);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        addPhoto({
          id: Date.now() + Math.random(),
          url: uploadEvent.target.result,
          caption: 'Special Memory ❤️'
        });
        playEffect('pop');
      };
      reader.readAsDataURL(file);
    });
  };

  const handleGenerateClick = () => {
    playEffect('sparkle');
    setCurrentScene(3); // Go to Share Scene
  };

  return (
    <div className="relative min-h-screen pt-20 pb-16 px-4 z-10 max-w-6xl mx-auto flex flex-col justify-center">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-2">
          Personalize the Magic ✨
        </h2>
        <p className="text-white/60 text-sm sm:text-base max-w-md mx-auto">
          Craft every detail of the surprise. Your recipient will experience this exact personalized 3D world.
        </p>
      </div>

      {/* Progress Tabs */}
      <div className="flex justify-center items-center gap-2 mb-8">
        {[
          { id: 1, label: 'Message & Names', icon: Heart },
          { id: 2, label: 'Photos', icon: ImageIcon },
          { id: 3, label: 'Theme', icon: Palette }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-pink-500 text-white shadow-[0_0_20px_rgba(255,110,180,0.4)] scale-105'
                  : 'glass-card text-white/60 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Grid: Form Left, Live 3D Preview Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Forms */}
        <GlassCard className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {activeTab === 1 && (
              <motion.div
                key="tab1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-pink-300 mb-2">
                    🎂 Birthday Person's Name
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="e.g. Raji"
                    className="w-full px-4 py-3 rounded-xl glass-input text-lg font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-pink-300 mb-2">
                    💌 Your Name (Sender)
                  </label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="e.g. With love from Alex"
                    className="w-full px-4 py-3 rounded-xl glass-input text-base"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-pink-300">
                      📝 Personal Letter Message
                    </label>
                    {/* AI Generator button */}
                    <span className="text-[11px] text-yellow-300 flex items-center gap-1 font-medium">
                      <Wand2 className="w-3 h-3 animate-pulse" /> AI Assistant
                    </span>
                  </div>

                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write a heartwarming message..."
                    className="w-full px-4 py-3 rounded-xl glass-input text-sm leading-relaxed"
                  />

                  {/* AI Mood Pills */}
                  <div className="mt-3">
                    <p className="text-[11px] text-white/50 mb-2">Generate AI Message Preset:</p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { key: 'emotional', label: '❤️ Emotional' },
                        { key: 'funny', label: '😂 Funny' },
                        { key: 'poetic', label: '✨ Poetic' },
                        { key: 'short', label: '🎈 Short & Sweet' }
                      ].map((preset) => (
                        <button
                          key={preset.key}
                          type="button"
                          onClick={() => handleAiGenerate(preset.key)}
                          disabled={aiLoading}
                          className="px-3 py-1.5 rounded-lg glass-card text-xs hover:border-pink-400 hover:text-pink-300 transition-all text-white/80"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setActiveTab(2)}
                    className="px-6 py-3 rounded-xl bg-pink-500 text-white font-semibold flex items-center gap-2 hover:bg-pink-600 transition-all"
                  >
                    <span>Next: Add Photos</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 2 && (
              <motion.div
                key="tab2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-pink-300 mb-2">
                    📸 Memory Gallery Photos (Up to 10)
                  </label>
                  <p className="text-xs text-white/60 mb-4">
                    These photos will float in the 3D memory wall and surround the personal letter.
                  </p>

                  {/* Upload Area */}
                  <label className="border-2 border-dashed border-pink-400/40 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-pink-400 hover:bg-pink-500/10 transition-all text-center group">
                    <Upload className="w-8 h-8 text-pink-400 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium text-white mb-1">Click or drag photos here</span>
                    <span className="text-xs text-white/40">PNG, JPG, WebP supported</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Photo Previews List */}
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-60 overflow-y-auto pr-1">
                  {photos.map((photo) => (
                    <div key={photo.id} className="relative group rounded-xl overflow-hidden aspect-square border border-white/20">
                      <img src={photo.url} alt="Uploaded" className="w-full h-full object-cover" />
                      <button
                        onClick={() => removePhoto(photo.id)}
                        className="absolute top-1 right-1 p-1 rounded-full bg-red-600/80 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setActiveTab(1)}
                    className="px-5 py-2.5 rounded-xl glass-card text-white text-sm"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab(3)}
                    className="px-6 py-3 rounded-xl bg-pink-500 text-white font-semibold flex items-center gap-2 hover:bg-pink-600 transition-all text-sm"
                  >
                    <span>Next: Pick Theme</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 3 && (
              <motion.div
                key="tab3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-pink-300 mb-4">
                    🎨 Select Experience Visual Theme
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.entries(THEMES).map(([key, t]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          setTheme(key);
                          playEffect('pop');
                        }}
                        className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden ${
                          theme === key
                            ? 'border-pink-400 bg-pink-500/20 shadow-[0_0_25px_rgba(255,110,180,0.3)]'
                            : 'border-white/10 glass-card hover:border-white/30'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-sm text-white">{t.name}</span>
                          {theme === key && <Check className="w-4 h-4 text-pink-400" />}
                        </div>
                        <div className={`h-3 w-full rounded-full bg-gradient-to-r ${t.bgGradient}`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit / Generate Button */}
                <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setActiveTab(2)}
                    className="px-5 py-2.5 rounded-xl glass-card text-white text-sm"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleGenerateClick}
                    className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold shadow-[0_0_30px_rgba(255,110,180,0.6)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 text-base"
                  >
                    <Sparkles className="w-5 h-5 text-yellow-300" />
                    <span>Generate Surprise Link</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>

        {/* Right Column: Live 3D Preview Panel */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <GlassCard glow className="w-full text-center py-6">
            <span className="text-[11px] font-semibold tracking-widest uppercase text-pink-300 block mb-1">
              Live 3D Preview
            </span>
            <h3 className="font-serif text-2xl font-bold text-white mb-2">
              For {recipientName || 'Recipient'} 🎂
            </h3>
            
            {/* Live 3D Gift canvas */}
            <div className="my-2">
              <GiftBox3D isOpened={false} onOpen={() => {}} />
            </div>

            <p className="text-xs text-white/50 italic px-4">
              "{message.slice(0, 70)}..."
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
