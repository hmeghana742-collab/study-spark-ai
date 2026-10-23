import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Pause, Play, RotateCcw } from 'lucide-react';

interface SpeechPlayerProps {
  textToRead: string;
  topicTitle: string;
}

export const SpeechPlayer: React.FC<SpeechPlayerProps> = ({ textToRead, topicTitle }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState<number>(1.0);
  const [supported, setSupported] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSupported(true);
    }
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // When text changes, stop any previous speech
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    }
  }, [textToRead]);

  if (!supported) return null;

  const handlePlay = () => {
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    window.speechSynthesis.cancel();

    // Prepare text clean of markup or repetitive code symbols
    const cleanText = `${topicTitle}. ${textToRead}`.replace(/[#*_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = rate;

    // Pick a natural English voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice =
      voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Alex'))) ||
      voices.find((v) => v.lang.startsWith('en'));
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    if (isPlaying && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  const cycleRate = () => {
    const rates = [0.85, 1.0, 1.25];
    const nextIndex = (rates.indexOf(rate) + 1) % rates.length;
    const newRate = rates[nextIndex];
    setRate(newRate);
    if (isPlaying) {
      // Re-trigger with new rate
      handlePlay();
    }
  };

  return (
    <div className="flex items-center gap-2 bg-amber-100/70 hover:bg-amber-100 border border-amber-300/80 rounded-xl px-3 py-1.5 transition text-xs font-medium text-amber-900 shadow-xs">
      {!isPlaying ? (
        <button
          onClick={handlePlay}
          className="flex items-center gap-1.5 font-bold hover:text-amber-950 transition"
          title="Listen to this lesson read aloud"
        >
          <Volume2 className="w-4 h-4 text-amber-700" />
          <span>Listen to Lesson</span>
        </button>
      ) : (
        <div className="flex items-center gap-1.5">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600"></span>
          </span>
          <span className="font-bold text-[11px] text-amber-900">
            {isPaused ? 'Paused' : 'Playing Audio'}
          </span>
          {isPaused ? (
            <button
              onClick={handlePlay}
              className="p-1 hover:bg-amber-200 rounded text-amber-800 transition"
              title="Resume"
            >
              <Play className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="p-1 hover:bg-amber-200 rounded text-amber-800 transition"
              title="Pause"
            >
              <Pause className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={handleStop}
            className="p-1 hover:bg-amber-200 rounded text-amber-800 transition"
            title="Stop audio"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Speed multiplier toggle */}
      <button
        onClick={cycleRate}
        className="ml-1 px-1.5 py-0.5 rounded bg-amber-200/80 hover:bg-amber-300 text-[10px] font-bold text-amber-900"
        title="Toggle audio speed"
      >
        {rate}x
      </button>
    </div>
  );
};
