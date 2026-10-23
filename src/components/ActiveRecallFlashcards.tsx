import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCw, Layers, Sparkles } from 'lucide-react';
import { Flashcard } from '../types';

interface ActiveRecallFlashcardsProps {
  flashcards: Flashcard[];
}

export const ActiveRecallFlashcards: React.FC<ActiveRecallFlashcardsProps> = ({ flashcards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  if (!flashcards || flashcards.length === 0) return null;

  const current = flashcards[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-amber-200/90 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-bold">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-base text-stone-900">Active Recall Flashcards</h3>
            <p className="text-xs text-stone-500">Test your memory by flipping before checking the answer</p>
          </div>
        </div>

        <div className="text-xs font-bold text-stone-500 bg-stone-100 px-2.5 py-1 rounded-full">
          Card {currentIndex + 1} of {flashcards.length}
        </div>
      </div>

      {/* The Flashcard Body */}
      <div
        onClick={handleFlip}
        className="cursor-pointer group relative min-h-[180px] sm:min-h-[210px] rounded-xl border-2 border-dashed border-amber-300 hover:border-amber-400 bg-gradient-to-br from-amber-50/60 to-orange-50/40 p-6 flex flex-col justify-between transition-all duration-300 shadow-xs hover:shadow-md"
      >
        {/* Category tag & Flip indicator */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white border border-amber-200 text-amber-800 shadow-2xs">
            {current.category || 'Concept'}
          </span>
          <span className="flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full group-hover:bg-amber-200 transition">
            <RotateCw className="w-3 h-3" />
            {isFlipped ? 'Click to show front' : 'Click to flip'}
          </span>
        </div>

        {/* Question / Answer text */}
        <div className="py-4 text-center my-auto">
          {!isFlipped ? (
            <div className="animate-in fade-in duration-200">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 block mb-1">
                Prompt / Question
              </span>
              <p className="text-lg sm:text-xl font-bold text-stone-900 leading-snug">
                {current.front}
              </p>
            </div>
          ) : (
            <div className="animate-in fade-in duration-200">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block mb-1">
                Explanation & Key Answer
              </span>
              <p className="text-base sm:text-lg font-medium text-stone-800 leading-relaxed">
                {current.back}
              </p>
            </div>
          )}
        </div>

        {/* Bottom hint */}
        <div className="text-center">
          <span className="text-[11px] text-stone-400 font-medium">
            {!isFlipped ? '🧠 Think of the answer, then click to check' : '✨ Well done! Click next to continue'}
          </span>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={handlePrev}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-700 text-xs font-semibold transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <button
          onClick={handleFlip}
          className="flex items-center gap-1 px-4 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200/90 text-amber-900 text-xs font-bold transition"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>{isFlipped ? 'Show Question' : 'Flip Card'}</span>
        </button>

        <button
          onClick={handleNext}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-700 text-xs font-semibold transition"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
