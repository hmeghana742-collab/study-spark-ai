import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Pause,
  Play,
  RotateCcw,
  SkipForward,
  SkipBack,
  Sparkles,
  Radio,
  Sliders,
  X,
} from 'lucide-react';
import { LearningModule } from '../types';

export interface NarrationSection {
  id: string;
  title: string;
  text: string;
}

interface AudioNarratorProps {
  module: LearningModule;
  activeSectionId: string | null;
  onActiveSectionChange: (sectionId: string | null) => void;
}

export const buildLessonSections = (module: LearningModule): NarrationSection[] => {
  const sections: NarrationSection[] = [];

  // 1. Overview & Big Picture
  sections.push({
    id: 'overview',
    title: 'The Solution & Big Picture',
    text: `Question: ${module.title}. ${
      module.directSolution ? `Direct solution: ${module.directSolution}. ` : ''
    }In a nutshell: ${module.oneLiner}. ${module.bigPicture}`,
  });

  // 2. The Core Analogy
  if (module.analogy) {
    sections.push({
      id: 'analogy',
      title: 'The Core Analogy',
      text: `Here is the core analogy: ${module.analogy.title}. ${module.analogy.story}. The key takeaway to remember is: ${module.analogy.keyTakeaway}`,
    });
  }

  // 3. Step-by-Step Breakdown
  if (module.keySteps && module.keySteps.length > 0) {
    const stepsText = module.keySteps
      .map(
        (s) =>
          `Step ${s.stepNumber}: ${s.title}. ${s.explanation}. Key insight: ${s.keyInsight}.`
      )
      .join(' ');
    sections.push({
      id: 'steps',
      title: 'Step-by-Step Mechanism',
      text: `Here is the step-by-step mechanism. ${stepsText}`,
    });
  }

  // 4. Real World Examples
  if (module.realWorldExamples && module.realWorldExamples.length > 0) {
    const examplesText = module.realWorldExamples
      .map((ex, i) => `Example ${i + 1}: ${ex.title}. Scenario: ${ex.scenario}. Application: ${ex.application}.`)
      .join(' ');
    sections.push({
      id: 'examples',
      title: 'Real-World Examples',
      text: `Now, real-world examples in action. ${examplesText}`,
    });
  }

  // 5. Common Misconceptions
  if (module.commonMistakes && module.commonMistakes.length > 0) {
    const mistakesText = module.commonMistakes
      .map((m) => `Myth: ${m.myth}. Reality: ${m.reality}. Why it confuses people: ${m.whyItConfusesPeople}.`)
      .join(' ');
    sections.push({
      id: 'misconceptions',
      title: 'Common Misconceptions',
      text: `Common misconceptions to watch out for. ${mistakesText}`,
    });
  }

  // 6. Cheat Sheet & Golden Rule
  if (module.cheatSheet) {
    const termsText = (module.cheatSheet.keyTerms || [])
      .map((k) => `${k.term}: ${k.definition}`)
      .join('. ');
    sections.push({
      id: 'cheatsheet',
      title: 'Golden Rule & Cheat Sheet',
      text: `Finally, the golden rule to keep in mind: ${module.cheatSheet.goldenRule}. ${
        module.cheatSheet.formulaOrRule ? `Formula: ${module.cheatSheet.formulaOrRule}.` : ''
      } Key terms: ${termsText}.`,
    });
  }

  return sections;
};

export const AudioNarrator: React.FC<AudioNarratorProps> = ({
  module,
  activeSectionId,
  onActiveSectionChange,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [rate, setRate] = useState<number>(1.0);
  const [voiceEngine, setVoiceEngine] = useState<'browser' | 'ai'>('browser');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  const sectionsRef = useRef<NarrationSection[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioElemRef = useRef<HTMLAudioElement | null>(null);

  // Update sections whenever module changes
  useEffect(() => {
    sectionsRef.current = buildLessonSections(module);
    stopNarration();
  }, [module]);

  // Load available browser voices
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const updateVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
      };
      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
    return () => {
      stopNarration();
    };
  }, []);

  const stopNarration = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (audioElemRef.current) {
      audioElemRef.current.pause();
      audioElemRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setIsPaused(false);
    setIsAiLoading(false);
    onActiveSectionChange(null);
  };

  const playSection = async (index: number) => {
    const sections = sectionsRef.current;
    if (index < 0 || index >= sections.length) {
      stopNarration();
      return;
    }

    setCurrentSectionIndex(index);
    const targetSection = sections[index];
    onActiveSectionChange(targetSection.id);
    setIsPlaying(true);
    setIsPaused(false);

    // Scroll section into view gently if element exists
    const el = document.getElementById(`section-${targetSection.id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    if (voiceEngine === 'ai') {
      // High fidelity Gemini TTS via /api/tts
      setIsAiLoading(true);
      try {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
        const res = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: targetSection.text,
            voiceName: 'Kore',
          }),
        });
        const data = await res.json();
        if (data.success && data.audioBase64) {
          if (audioElemRef.current) {
            audioElemRef.current.pause();
          }
          const audio = new Audio(`data:audio/wav;base64,${data.audioBase64}`);
          audio.playbackRate = rate;
          audioElemRef.current = audio;

          audio.onended = () => {
            // Proceed to next section
            if (index + 1 < sections.length) {
              playSection(index + 1);
            } else {
              stopNarration();
            }
          };

          audio.onerror = () => {
            // Fallback to browser synthesis
            fallbackBrowserSpeak(targetSection.text, index);
          };

          await audio.play();
          setIsAiLoading(false);
          return;
        }
      } catch (err) {
        console.warn('AI TTS failed, falling back to browser voice:', err);
      }
      setIsAiLoading(false);
    }

    // Default: Browser Web Speech API
    fallbackBrowserSpeak(targetSection.text, index);
  };

  const fallbackBrowserSpeak = (text: string, index: number) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    const cleanText = text.replace(/[*_#`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = rate;

    const voices = availableVoices.length > 0 ? availableVoices : window.speechSynthesis.getVoices();
    const preferredVoice =
      voices.find(
        (v) =>
          v.lang.startsWith('en') &&
          (v.name.includes('Natural') ||
            v.name.includes('Google') ||
            v.name.includes('Samantha') ||
            v.name.includes('Daniel') ||
            v.name.includes('Alex'))
      ) || voices.find((v) => v.lang.startsWith('en'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => {
      const sections = sectionsRef.current;
      if (index + 1 < sections.length) {
        playSection(index + 1);
      } else {
        stopNarration();
      }
    };

    utterance.onerror = () => {
      stopNarration();
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      if (isPaused) {
        // Resume
        if (voiceEngine === 'ai' && audioElemRef.current) {
          audioElemRef.current.play();
        } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.resume();
        }
        setIsPaused(false);
      } else {
        // Pause
        if (voiceEngine === 'ai' && audioElemRef.current) {
          audioElemRef.current.pause();
        } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.pause();
        }
        setIsPaused(true);
      }
    } else {
      // Start from beginning or active section
      const startIndex = activeSectionId
        ? Math.max(
            0,
            sectionsRef.current.findIndex((s) => s.id === activeSectionId)
          )
        : 0;
      playSection(startIndex);
    }
  };

  const handleNextSection = () => {
    if (currentSectionIndex + 1 < sectionsRef.current.length) {
      playSection(currentSectionIndex + 1);
    }
  };

  const handlePrevSection = () => {
    if (currentSectionIndex - 1 >= 0) {
      playSection(currentSectionIndex - 1);
    }
  };

  const cycleRate = () => {
    const rates = [0.85, 1.0, 1.25, 1.5];
    const nextIndex = (rates.indexOf(rate) + 1) % rates.length;
    const newRate = rates[nextIndex];
    setRate(newRate);
    if (audioElemRef.current) {
      audioElemRef.current.playbackRate = newRate;
    }
    if (isPlaying && !isPaused && voiceEngine === 'browser') {
      // Re-trigger current section with updated rate
      playSection(currentSectionIndex);
    }
  };

  const currentSection = sectionsRef.current[currentSectionIndex];

  return (
    <>
      {/* Top Banner Control Button */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleTogglePlay}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
            isPlaying
              ? 'bg-amber-500 text-white shadow-amber-500/30 ring-2 ring-amber-300'
              : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-amber-500/20'
          }`}
          title="Read the entire explanation aloud"
        >
          {isPlaying ? (
            isPaused ? (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Resume Reading</span>
              </>
            ) : (
              <>
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-80"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                </span>
                <span>Reading Explanation...</span>
              </>
            )
          ) : (
            <>
              <Volume2 className="w-4 h-4" />
              <span>Read Explanation Aloud</span>
            </>
          )}
        </button>

        {isPlaying && (
          <button
            onClick={stopNarration}
            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition"
            title="Stop audio narration"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Docked Sticky Bottom Audio Player when playing */}
      {isPlaying && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4 animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-stone-900/95 backdrop-blur-md text-white rounded-2xl p-3 sm:p-4 shadow-2xl border border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Section Info & Progress */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                <Volume2 className="w-5 h-5 animate-pulse" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300">
                    Section {currentSectionIndex + 1} of {sectionsRef.current.length}
                  </span>
                  {isAiLoading && (
                    <span className="text-[10px] text-amber-300 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                      Generating voice...
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-bold text-white truncate">
                  {currentSection?.title || 'Explaining Lesson'}
                </h4>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Prev */}
              <button
                onClick={handlePrevSection}
                disabled={currentSectionIndex === 0}
                className="p-1.5 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800 disabled:opacity-40 transition"
                title="Previous section"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              {/* Play / Pause */}
              <button
                onClick={handleTogglePlay}
                className="w-9 h-9 rounded-xl bg-amber-500 hover:bg-amber-400 text-white flex items-center justify-center font-bold transition shadow-md shadow-amber-500/30"
              >
                {isPaused ? <Play className="w-4 h-4 fill-white" /> : <Pause className="w-4 h-4" />}
              </button>

              {/* Next */}
              <button
                onClick={handleNextSection}
                disabled={currentSectionIndex + 1 >= sectionsRef.current.length}
                className="p-1.5 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800 disabled:opacity-40 transition"
                title="Next section"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              {/* Speed */}
              <button
                onClick={cycleRate}
                className="px-2 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 text-xs font-bold transition ml-1"
                title="Change speed"
              >
                {rate}x
              </button>

              {/* Voice toggle: browser vs Gemini AI */}
              <button
                onClick={() => {
                  const nextEngine = voiceEngine === 'browser' ? 'ai' : 'browser';
                  setVoiceEngine(nextEngine);
                  playSection(currentSectionIndex);
                }}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                  voiceEngine === 'ai'
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                    : 'bg-stone-800 text-stone-300 hover:text-white'
                }`}
                title="Toggle between Browser voice and Studio AI Teacher voice"
              >
                <Sparkles className="w-3 h-3" />
                <span>{voiceEngine === 'ai' ? 'Studio Voice' : 'Standard'}</span>
              </button>

              {/* Close */}
              <button
                onClick={stopNarration}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition ml-1"
                title="Close player"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
