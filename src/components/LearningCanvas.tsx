import React, { useState } from 'react';
import {
  Sparkles,
  Bookmark,
  BookmarkCheck,
  Award,
  CheckCircle2,
  Circle,
  Copy,
  Printer,
  Volume2,
  VolumeX,
  Lightbulb,
  ArrowRight,
  BookOpen,
  AlertTriangle,
  HelpCircle,
  Zap,
  RotateCw,
  Check,
  Compass,
  GraduationCap,
  Microscope,
} from 'lucide-react';
import { LearningModule, LearnerProfile } from '../types';
import { AudioNarrator } from './AudioNarrator';
import { ActiveRecallFlashcards } from './ActiveRecallFlashcards';
import { InteractiveQuiz } from './InteractiveQuiz';
import { FollowUpChat } from './FollowUpChat';
import { EducatorToolkitCard } from './EducatorToolkitCard';
import { ScholarDepthCard } from './ScholarDepthCard';

interface LearningCanvasProps {
  module: LearningModule;
  profile: LearnerProfile;
  isSaved: boolean;
  isMastered: boolean;
  isEnhancing?: boolean;
  onToggleSave: () => void;
  onToggleMaster: () => void;
  onRegenerateWithStyle?: (style: any) => void;
}

export const LearningCanvas: React.FC<LearningCanvasProps> = ({
  module,
  profile,
  isSaved,
  isMastered,
  isEnhancing = false,
  onToggleSave,
  onToggleMaster,
}) => {
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [copied, setCopied] = useState(false);
  const [simplerModalOpen, setSimplerModalOpen] = useState(false);
  const [simplerContent, setSimplerContent] = useState<string | null>(null);
  const [simplifying, setSimplifying] = useState(false);

  // Active section for audio reading
  const [activeAudioSection, setActiveAudioSection] = useState<string | null>(null);

  const toggleStep = (stepNumber: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepNumber]: !prev[stepNumber],
    }));
  };

  const handleCopySummary = () => {
    const text = `📚 ${module.title}\n\n💡 One-Liner: ${module.oneLiner}\n\n🌟 Big Picture:\n${module.bigPicture}\n\n🧩 Analogy (${module.analogy.title}):\n${module.analogy.story}\nKey Takeaway: ${module.analogy.keyTakeaway}\n\n⚡ Golden Rule: ${module.cheatSheet.goldenRule}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSimplifyFurther = async () => {
    setSimplerModalOpen(true);
    if (!simplerContent) {
      setSimplifying(true);
      try {
        const res = await fetch('/api/simplify-further', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            topic: module.topic,
            type: 'simpler_analogy',
          }),
        });
        const data = await res.json();
        setSimplerContent(data.text || 'Unable to simplify further at this moment.');
      } catch (err) {
        setSimplerContent('Could not fetch extra simple analogy right now.');
      } finally {
        setSimplifying(false);
      }
    }
  };

  const completedStepsCount = Object.values(completedSteps).filter(Boolean).length;
  const totalSteps = module.keySteps?.length || 0;

  // Quick read a single section immediately
  const handleQuickRead = (sectionId: string, textToRead: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (activeAudioSection === sectionId) {
      window.speechSynthesis.cancel();
      setActiveAudioSection(null);
      return;
    }

    window.speechSynthesis.cancel();
    setActiveAudioSection(sectionId);

    const utterance = new SpeechSynthesisUtterance(textToRead.replace(/[*_#`]/g, ''));
    utterance.rate = 1.0;

    const voices = window.speechSynthesis.getVoices();
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

    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onend = () => setActiveAudioSection(null);
    utterance.onerror = () => setActiveAudioSection(null);

    window.speechSynthesis.speak(utterance);
  };

  const [viewPerspective, setViewPerspective] = useState<'all' | 'student' | 'educator' | 'scholar'>(
    profile.role === 'professor' ? 'educator' : profile.role === 'researcher' ? 'scholar' : 'all'
  );

  return (
    <div className="max-w-5xl mx-auto px-4 pb-28 space-y-8 animate-in fade-in duration-300">
      {/* Top Action Bar & Title Card */}
      <div
        id="section-overview"
        className={`bg-white rounded-3xl p-6 sm:p-8 border shadow-md shadow-amber-900/5 relative overflow-hidden transition-all duration-300 ${
          activeAudioSection === 'overview'
            ? 'border-amber-500 ring-4 ring-amber-300/40 bg-amber-50/20'
            : 'border-amber-200/90'
        }`}
      >
        {/* Glow ambient accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-amber-200/40 via-orange-100/20 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200/80 pb-6 mb-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 border border-amber-300">
                {module.topic}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-stone-100 text-stone-600">
                Level: {module.learnerLevel.replace('_', ' ')}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-stone-100 text-stone-600">
                Style: {module.learningStyle}
              </span>
              {isEnhancing ? (
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-ping"></span>
                  ⚡ Instant Solution (AI Refining...)
                </span>
              ) : (
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                  ⚡ Instant Solution Ready
                </span>
              )}
              {activeAudioSection === 'overview' && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-500 text-white flex items-center gap-1 animate-pulse">
                  <Volume2 className="w-3.5 h-3.5" />
                  Now Reading
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              {module.title}
            </h2>

            <p className="text-base text-amber-900/90 font-medium leading-relaxed bg-amber-50/70 p-3 rounded-xl border border-amber-200/60">
              <span className="font-bold text-amber-800">In a nutshell: </span>
              {module.oneLiner}
            </p>

            {module.directSolution && (
              <div className="bg-gradient-to-r from-emerald-50 via-teal-50/70 to-emerald-50/50 border-2 border-emerald-400/80 rounded-2xl p-4 shadow-xs mt-3">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow-2xs">
                    ✓
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    Direct Solution / Final Answer
                  </span>
                </div>
                <div className="text-base sm:text-lg font-bold text-emerald-950 font-mono sm:font-sans whitespace-pre-wrap leading-relaxed">
                  {module.directSolution}
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap md:flex-col items-end gap-2.5 shrink-0">
            {/* Audio narrator for the entire explanation */}
            <AudioNarrator
              module={module}
              activeSectionId={activeAudioSection}
              onActiveSectionChange={(id) => setActiveAudioSection(id)}
            />

            <div className="flex items-center gap-2">
              {/* Bookmark toggle */}
              <button
                onClick={onToggleSave}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition ${
                  isSaved
                    ? 'bg-amber-100 border-amber-300 text-amber-900'
                    : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-700'
                }`}
                title={isSaved ? 'Remove from saved' : 'Save this lesson'}
              >
                {isSaved ? (
                  <BookmarkCheck className="w-4 h-4 text-amber-600" />
                ) : (
                  <Bookmark className="w-4 h-4 text-stone-400" />
                )}
                <span>{isSaved ? 'Saved' : 'Save'}</span>
              </button>

              {/* Mastered toggle */}
              <button
                onClick={onToggleMaster}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition ${
                  isMastered
                    ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                    : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-700'
                }`}
                title={isMastered ? 'Mark as Needs Review' : 'Mark as Mastered'}
              >
                <Award
                  className={`w-4 h-4 ${isMastered ? 'text-emerald-600' : 'text-stone-400'}`}
                />
                <span>{isMastered ? 'Mastered!' : 'Mastered?'}</span>
              </button>

              {/* Simplify further */}
              <button
                onClick={handleSimplifyFurther}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-800 text-xs font-bold transition"
                title="Explain like I'm even younger"
              >
                <Zap className="w-3.5 h-3.5 text-orange-600" />
                <span>Simpler Analogy</span>
              </button>

              {/* Copy Summary */}
              <button
                onClick={handleCopySummary}
                className="p-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-600 transition"
                title="Copy Lesson Summary"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>

              {/* Print */}
              <button
                onClick={handlePrint}
                className="p-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-600 transition hidden sm:block"
                title="Print or Save as PDF"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Section 1: The Big Picture */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-stone-900 font-bold text-base">
              <Compass className="w-5 h-5 text-amber-600" />
              <h3>The Big Picture: Why It Matters</h3>
            </div>
            <button
              onClick={() =>
                handleQuickRead(
                  'overview',
                  `The Big Picture of ${module.title}. In a nutshell: ${module.oneLiner}. ${module.bigPicture}`
                )
              }
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-semibold transition ${
                activeAudioSection === 'overview'
                  ? 'bg-amber-500 text-white border-amber-600'
                  : 'bg-stone-50 hover:bg-amber-100 text-stone-700 border-stone-200'
              }`}
              title="Listen to this section"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{activeAudioSection === 'overview' ? 'Stop' : 'Listen'}</span>
            </button>
          </div>
          <div className="text-sm sm:text-base text-stone-700 leading-relaxed space-y-3 font-normal">
            {module.bigPicture.split('\n\n').map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Perspective Switcher Tabs: Student, Educator, Scholar */}
      <div className="bg-white/80 backdrop-blur-sm p-1.5 rounded-2xl border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-1.5">
        <button
          onClick={() => setViewPerspective('all')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            viewPerspective === 'all'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Full Overview</span>
        </button>

        <button
          onClick={() => setViewPerspective('student')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            viewPerspective === 'student'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'text-stone-600 hover:bg-amber-50'
          }`}
        >
          <span className="text-sm">🎒</span>
          <span>Student Breakdown</span>
        </button>

        <button
          onClick={() => setViewPerspective('educator')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            viewPerspective === 'educator'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-stone-600 hover:bg-indigo-50'
          }`}
        >
          <GraduationCap className="w-4 h-4 text-indigo-400" />
          <span>Professor & Educator Kit</span>
        </button>

        <button
          onClick={() => setViewPerspective('scholar')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            viewPerspective === 'scholar'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-stone-600 hover:bg-slate-100'
          }`}
        >
          <Microscope className="w-4 h-4 text-emerald-400" />
          <span>Scholar Depth & Proofs</span>
        </button>
      </div>

      {/* Educator Toolkit Card (Professor View) */}
      {(viewPerspective === 'educator' || viewPerspective === 'all') && module.educatorKit && (
        <EducatorToolkitCard educatorKit={module.educatorKit} topicTitle={module.title} />
      )}

      {/* Scholar Depth Card (Researcher View) */}
      {(viewPerspective === 'scholar' || viewPerspective === 'all') && module.scholarDepth && (
        <ScholarDepthCard scholarDepth={module.scholarDepth} topicTitle={module.title} />
      )}

      {/* Student View Elements */}
      {(viewPerspective === 'student' || viewPerspective === 'all') && (
        <>

      {/* Section 2: The Core Analogy (Feature Metaphor Card) */}
      <div
        id="section-analogy"
        className={`bg-gradient-to-br from-amber-50 via-orange-50/70 to-amber-100/50 rounded-3xl p-6 sm:p-8 border-2 shadow-sm relative overflow-hidden transition-all duration-300 ${
          activeAudioSection === 'analogy'
            ? 'border-amber-500 ring-4 ring-amber-300/40 bg-amber-100/60'
            : 'border-amber-300'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-xs">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
                Core Intuition & Analogy
              </span>
              <h3 className="font-extrabold text-lg sm:text-xl text-stone-900">
                {module.analogy.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                handleQuickRead(
                  'analogy',
                  `The Core Analogy: ${module.analogy.title}. ${module.analogy.story}. Key takeaway: ${module.analogy.keyTakeaway}`
                )
              }
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-semibold transition ${
                activeAudioSection === 'analogy'
                  ? 'bg-amber-500 text-white border-amber-600'
                  : 'bg-white hover:bg-amber-100 text-stone-700 border-amber-200'
              }`}
              title="Listen to the analogy"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{activeAudioSection === 'analogy' ? 'Stop' : 'Listen'}</span>
            </button>
            <span className="text-2xl select-none hidden sm:inline">🧩</span>
          </div>
        </div>

        <p className="text-sm sm:text-base text-stone-800 leading-relaxed mb-4 bg-white/70 p-4 rounded-2xl border border-amber-200/80 shadow-2xs font-normal">
          {module.analogy.story}
        </p>

        <div className="flex items-start gap-2.5 bg-amber-200/60 p-3.5 rounded-xl border border-amber-300/80 text-xs sm:text-sm text-amber-950 font-medium">
          <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Why this clicks: </span>
            <span>{module.analogy.keyTakeaway}</span>
          </div>
        </div>
      </div>

      {/* Section 3: Step-by-Step Breakdown */}
      {module.keySteps && module.keySteps.length > 0 && (
        <div
          id="section-steps"
          className={`bg-white rounded-3xl p-6 sm:p-8 border shadow-sm space-y-6 transition-all duration-300 ${
            activeAudioSection === 'steps'
              ? 'border-amber-500 ring-4 ring-amber-300/40 bg-amber-50/20'
              : 'border-amber-200/90'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                <span className="text-lg">🪜</span>
              </div>
              <div>
                <h3 className="font-extrabold text-lg sm:text-xl text-stone-900">
                  Step-by-Step Mechanism
                </h3>
                <p className="text-xs text-stone-500">
                  How it actually works under the hood, broken into logical stages
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const stepsText = module.keySteps
                    .map(
                      (s) =>
                        `Step ${s.stepNumber}: ${s.title}. ${s.explanation}. Key insight: ${s.keyInsight}.`
                    )
                    .join(' ');
                  handleQuickRead('steps', `Step by step mechanism: ${stepsText}`);
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-semibold transition ${
                  activeAudioSection === 'steps'
                    ? 'bg-amber-500 text-white border-amber-600'
                    : 'bg-stone-50 hover:bg-amber-100 text-stone-700 border-stone-200'
                }`}
                title="Listen to all steps"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{activeAudioSection === 'steps' ? 'Stop' : 'Listen'}</span>
              </button>

              {totalSteps > 0 && (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  {completedStepsCount}/{totalSteps} Understood
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {module.keySteps.map((step) => {
              const isChecked = !!completedSteps[step.stepNumber];
              const stepAudioId = `step-${step.stepNumber}`;
              const isThisStepPlaying = activeAudioSection === stepAudioId;

              return (
                <div
                  key={step.stepNumber}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                    isThisStepPlaying
                      ? 'border-amber-500 ring-2 ring-amber-300 bg-amber-50/40'
                      : isChecked
                      ? 'border-emerald-300 bg-emerald-50/50'
                      : 'border-stone-200 hover:border-amber-300 bg-stone-50/40'
                  }`}
                >
                  <button
                    onClick={() => toggleStep(step.stepNumber)}
                    className="mt-0.5 text-stone-400 hover:text-emerald-600 transition shrink-0"
                    title={isChecked ? 'Mark as unread' : 'Mark as understood'}
                  >
                    {isChecked ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-100" />
                    ) : (
                      <Circle className="w-6 h-6 text-stone-300 hover:text-stone-400" />
                    )}
                  </button>

                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                          Step {step.stepNumber}
                        </span>
                        <h4 className="font-bold text-sm sm:text-base text-stone-900">
                          {step.title}
                        </h4>
                      </div>

                      <button
                        onClick={() =>
                          handleQuickRead(
                            stepAudioId,
                            `Step ${step.stepNumber}: ${step.title}. ${step.explanation}. Key insight: ${step.keyInsight}.`
                          )
                        }
                        className="p-1 text-stone-400 hover:text-amber-600 rounded transition"
                        title="Listen to this step"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
                      {step.explanation}
                    </p>

                    <div className="inline-flex items-center gap-1.5 text-xs text-amber-800 font-semibold bg-amber-100/60 px-2.5 py-1 rounded-lg">
                      <Zap className="w-3 h-3 text-amber-600" />
                      <span>{step.keyInsight}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Section 4: Real-World Examples */}
      {module.realWorldExamples && module.realWorldExamples.length > 0 && (
        <div
          id="section-examples"
          className={`bg-white rounded-3xl p-6 sm:p-8 border shadow-sm space-y-5 transition-all duration-300 ${
            activeAudioSection === 'examples'
              ? 'border-amber-500 ring-4 ring-amber-300/40 bg-amber-50/20'
              : 'border-amber-200/90'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center font-bold">
                <span className="text-lg">🌍</span>
              </div>
              <div>
                <h3 className="font-extrabold text-lg sm:text-xl text-stone-900">
                  Real-World Examples in Action
                </h3>
                <p className="text-xs text-stone-500">
                  Where you actually encounter this in science, industry, technology, and life
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                const examplesText = module.realWorldExamples
                  .map(
                    (ex, i) =>
                      `Example ${i + 1}: ${ex.title}. Scenario: ${ex.scenario}. Application: ${
                        ex.application
                      }.`
                  )
                  .join(' ');
                handleQuickRead('examples', `Real world examples: ${examplesText}`);
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-semibold transition ${
                activeAudioSection === 'examples'
                  ? 'bg-amber-500 text-white border-amber-600'
                  : 'bg-stone-50 hover:bg-amber-100 text-stone-700 border-stone-200'
              }`}
              title="Listen to real world examples"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{activeAudioSection === 'examples' ? 'Stop' : 'Listen'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {module.realWorldExamples.map((ex, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-stone-200 bg-stone-50/60 hover:bg-stone-50 transition flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-800 text-xs font-bold flex items-center justify-center mb-2">
                    0{idx + 1}
                  </div>
                  <h4 className="font-bold text-sm text-stone-900 mb-1">{ex.title}</h4>
                  <p className="text-xs text-stone-600 leading-relaxed">{ex.scenario}</p>
                </div>

                <div className="pt-2 border-t border-stone-200/80 text-xs text-sky-900 font-medium bg-sky-50/70 p-2.5 rounded-xl border border-sky-200/60">
                  <span className="font-bold">Application: </span>
                  {ex.application}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 5: Common Misconceptions / Myths vs Reality */}
      {module.commonMistakes && module.commonMistakes.length > 0 && (
        <div
          id="section-misconceptions"
          className={`bg-white rounded-3xl p-6 sm:p-8 border shadow-sm space-y-5 transition-all duration-300 ${
            activeAudioSection === 'misconceptions'
              ? 'border-amber-500 ring-4 ring-amber-300/40 bg-amber-50/20'
              : 'border-amber-200/90'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center font-bold">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg sm:text-xl text-stone-900">
                  Common Misconceptions (Don’t Fall for These!)
                </h3>
                <p className="text-xs text-stone-500">
                  The most frequent myths that trip up learners
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                const mistakesText = module.commonMistakes
                  .map(
                    (m) =>
                      `Myth: ${m.myth}. Reality: ${m.reality}. Why it confuses people: ${m.whyItConfusesPeople}.`
                  )
                  .join(' ');
                handleQuickRead('misconceptions', `Common misconceptions: ${mistakesText}`);
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-semibold transition ${
                activeAudioSection === 'misconceptions'
                  ? 'bg-amber-500 text-white border-amber-600'
                  : 'bg-stone-50 hover:bg-amber-100 text-stone-700 border-stone-200'
              }`}
              title="Listen to misconceptions"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{activeAudioSection === 'misconceptions' ? 'Stop' : 'Listen'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {module.commonMistakes.map((m, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-stone-200/90 bg-stone-50/50 space-y-3"
              >
                <div className="flex items-start gap-2 bg-rose-50/80 text-rose-950 p-3 rounded-xl border border-rose-200/70">
                  <span className="font-bold text-xs uppercase px-1.5 py-0.5 rounded bg-rose-200/80 text-rose-800 shrink-0 mt-0.5">
                    Myth
                  </span>
                  <p className="text-xs font-semibold">{m.myth}</p>
                </div>

                <div className="flex items-start gap-2 bg-emerald-50/80 text-emerald-950 p-3 rounded-xl border border-emerald-200/70">
                  <span className="font-bold text-xs uppercase px-1.5 py-0.5 rounded bg-emerald-200/80 text-emerald-800 shrink-0 mt-0.5">
                    Reality
                  </span>
                  <p className="text-xs font-medium">{m.reality}</p>
                </div>

                <p className="text-[11px] text-stone-400 italic px-1">
                  💡 Why people get confused: {m.whyItConfusesPeople}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 6: Cheat Sheet & Key Terms */}
      {module.cheatSheet && (
        <div
          id="section-cheatsheet"
          className={`bg-gradient-to-r from-stone-900 to-stone-800 text-white rounded-3xl p-6 sm:p-8 shadow-lg space-y-5 transition-all duration-300 ${
            activeAudioSection === 'cheatsheet' ? 'ring-4 ring-amber-400' : ''
          }`}
        >
          <div className="flex items-center justify-between border-b border-stone-700 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg sm:text-xl text-white">
                  Cheat Sheet & Golden Rule
                </h3>
                <p className="text-xs text-stone-400">Keep these mental models in mind</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const termsText = (module.cheatSheet.keyTerms || [])
                    .map((k) => `${k.term}: ${k.definition}`)
                    .join('. ');
                  handleQuickRead(
                    'cheatsheet',
                    `Golden Rule: ${module.cheatSheet.goldenRule}. Key terms: ${termsText}`
                  );
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-semibold transition ${
                  activeAudioSection === 'cheatsheet'
                    ? 'bg-amber-500 text-white border-amber-400'
                    : 'bg-stone-800 hover:bg-stone-700 text-amber-300 border-stone-700'
                }`}
                title="Listen to cheat sheet"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{activeAudioSection === 'cheatsheet' ? 'Stop' : 'Listen'}</span>
              </button>

              <span className="text-xs font-mono uppercase bg-amber-400/20 text-amber-300 px-2.5 py-1 rounded-md border border-amber-400/30">
                Quick Reference
              </span>
            </div>
          </div>

          {/* Golden Rule Highlight */}
          <div className="bg-amber-400/10 border border-amber-400/30 p-4 rounded-2xl flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block mb-0.5">
                The Golden Rule:
              </span>
              <p className="text-sm sm:text-base font-bold text-amber-100">
                {module.cheatSheet.goldenRule}
              </p>
              {module.cheatSheet.formulaOrRule && (
                <div className="mt-2 text-xs font-mono bg-black/40 px-3 py-1.5 rounded-lg text-amber-300 inline-block">
                  {module.cheatSheet.formulaOrRule}
                </div>
              )}
            </div>
          </div>

          {/* Key Terms grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
            {module.cheatSheet.keyTerms?.map((kt, idx) => (
              <div key={idx} className="bg-stone-800/80 p-3.5 rounded-xl border border-stone-700">
                <span className="font-bold text-xs text-amber-300 block mb-1">{kt.term}</span>
                <span className="text-xs text-stone-300 leading-snug block">{kt.definition}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 7: Active Recall Flashcards */}
      <ActiveRecallFlashcards flashcards={module.flashcards} />

      {/* Section 8: Interactive Comprehension Quiz */}
      <InteractiveQuiz quiz={module.quiz} />

      {/* Section 9: Follow-up Questions Chat */}
      <FollowUpChat module={module} profile={profile} />
        </>
      )}

      {/* Simpler Analogy Modal */}
      {simplerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-amber-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                  <Zap className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base text-stone-900">
                  Ultra-Simple Everyday Analogy
                </h3>
              </div>
              <button
                onClick={() => setSimplerModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="min-h-[140px] flex items-center justify-center">
              {simplifying ? (
                <div className="flex items-center gap-2 text-xs text-amber-700">
                  <span className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></span>
                  <span>Cooking up an even simpler metaphor...</span>
                </div>
              ) : (
                <div className="text-xs sm:text-sm text-stone-700 leading-relaxed whitespace-pre-line bg-amber-50/60 p-4 rounded-xl border border-amber-200">
                  {simplerContent}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSimplerModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs"
              >
                Got It, Thanks!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
