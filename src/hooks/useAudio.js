import { useEffect, useRef, useState, useCallback } from 'react';
import { Howl, Howler } from 'howler';
import { useBirthdayStore } from '../store/birthdayStore';

// ── Audio URLs ──
// Ambient background music (gentle piano)
const AMBIENT_URL = 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=piano-moment-11447.mp3';
// Happy Birthday song (instrumental)
const BIRTHDAY_SONG_URL = 'https://cdn.pixabay.com/download/audio/2024/11/04/audio_4956b08880.mp3?filename=happy-birthday-to-you-acoustic-guitar-274789.mp3';

export function useAudio() {
  const isPlayingAudio = useBirthdayStore(state => state.isPlayingAudio);
  const setIsPlayingAudio = useBirthdayStore(state => state.setIsPlayingAudio);

  const ambientRef = useRef(null);
  const birthdaySongRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // ── Initialize audio instances once ──
  useEffect(() => {
    // Lower global volume for smooth experience
    Howler.volume(0.6);

    ambientRef.current = new Howl({
      src: [AMBIENT_URL],
      html5: true,
      loop: true,
      volume: 0.25,
      preload: true,
      onload: () => setIsLoaded(true),
      onplayerror: function() {
        ambientRef.current.once('unlock', () => ambientRef.current.play());
      }
    });

    birthdaySongRef.current = new Howl({
      src: [BIRTHDAY_SONG_URL],
      html5: true,
      loop: false,
      volume: 0.55,
      preload: true,
      onend: () => {
        // When birthday song finishes, resume ambient quietly
        if (ambientRef.current && isPlayingAudio) {
          ambientRef.current.volume(0.25);
          if (!ambientRef.current.playing()) {
            ambientRef.current.play();
          }
        }
      }
    });

    return () => {
      if (ambientRef.current) ambientRef.current.unload();
      if (birthdaySongRef.current) birthdaySongRef.current.unload();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Toggle all audio ──
  const togglePlay = useCallback(() => {
    if (isPlayingAudio) {
      // Pause everything
      if (ambientRef.current) ambientRef.current.pause();
      if (birthdaySongRef.current) birthdaySongRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      // Play ambient
      if (ambientRef.current && !ambientRef.current.playing()) {
        ambientRef.current.play();
      }
      setIsPlayingAudio(true);
    }
  }, [isPlayingAudio, setIsPlayingAudio]);

  // ── Play birthday song (cross-fade from ambient) ──
  const playBirthdaySong = useCallback(() => {
    if (!birthdaySongRef.current) return;

    // Fade out ambient
    if (ambientRef.current && ambientRef.current.playing()) {
      ambientRef.current.fade(0.25, 0.05, 800);
    }

    // Start birthday song
    birthdaySongRef.current.seek(0);
    birthdaySongRef.current.play();
    birthdaySongRef.current.fade(0, 0.55, 600);
    setIsPlayingAudio(true);
  }, [setIsPlayingAudio]);

  // ── Stop birthday song and resume ambient ──
  const stopBirthdaySong = useCallback(() => {
    if (birthdaySongRef.current && birthdaySongRef.current.playing()) {
      birthdaySongRef.current.fade(0.55, 0, 600);
      setTimeout(() => {
        if (birthdaySongRef.current) birthdaySongRef.current.stop();
      }, 600);
    }
    // Restore ambient
    if (ambientRef.current) {
      ambientRef.current.fade(0.05, 0.25, 800);
      if (!ambientRef.current.playing()) {
        ambientRef.current.play();
      }
    }
  }, []);

  // ── Sound effects via Web Audio (instant, no file loading) ──
  const playEffect = useCallback((type) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();

      if (type === 'pop') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      }

      if (type === 'sparkle') {
        const notes = [587.33, 880, 1174.66]; // D5, A5, D6
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
          gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.2);
          osc.start(ctx.currentTime + i * 0.08);
          osc.stop(ctx.currentTime + i * 0.08 + 0.2);
        });
      }

      if (type === 'blow') {
        const bufSize = ctx.sampleRate * 0.4;
        const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;

        const noise = ctx.createBufferSource();
        noise.buffer = buf;
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(700, ctx.currentTime);
        filter.frequency.linearRampToValueAtTime(150, ctx.currentTime + 0.4);
        const gain = ctx.createGain();
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        noise.start();
      }

      if (type === 'chime') {
        const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
        freqs.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
          gain.gain.setValueAtTime(0.12, ctx.currentTime + i * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.4);
          osc.start(ctx.currentTime + i * 0.12);
          osc.stop(ctx.currentTime + i * 0.12 + 0.4);
        });
      }

    } catch (e) {
      // Silently fail – sound effects are non-critical
    }
  }, []);

  return {
    isPlayingAudio,
    isLoaded,
    togglePlay,
    playEffect,
    playBirthdaySong,
    stopBirthdaySong,
  };
}
