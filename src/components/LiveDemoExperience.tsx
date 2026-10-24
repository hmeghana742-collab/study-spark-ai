import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Zap,
  BookOpen,
  Target,
  Play,
  Award,
  Clock,
  Layers,
} from 'lucide-react';
import { SAMPLE_TOPICS } from '../data/sampleTopics';
import { QuizQuestion, LearningModule } from '../types';

interface LiveDemoExperienceProps {
  onLoadModuleInTutor: (module: LearningModule) => void;
  onNavigateToAdaptive: () => void;
}

export const LiveDemoExperience: React.FC<LiveDemoExperienceProps> = ({
  onLoadModuleInTutor,
  onNavigateToAdaptive,
}) => {
  // Demo step 1 to 7
  const [currentStep, setCurrentStep] = useState(1);
  const [demoAnswers, setDemoAnswers] = useState<Record<number, number>>({
    0: 2, // Correct: 8,000 Hz
    1: 3, // Missed deliberately for demo (chose 4 kHz instead of 8 kHz)
    2: 1, // Correct: 4.1 kHz transition band
    3: 1, // Correct: Whittaker-Shannon sinc kernel
    4: 2, // Correct: Immediately before ADC in analog domain
  });

  const dspModule = SAMPLE_TOPICS['dsp-sampling-theorem'];
  const questions: QuizQuestion[] = dspModule.quiz;

  const steps = [
    { num: 1, title: 'Explanation', label: '1. AI Explanation' },
    { num: 2, title: '5 MCQs', label: '2. Generate 5 MCQs' },
    { num: 3, title: 'Student Answers', label: '3. Student Responses' },
    { num: 4, title: 'Actual Score', label: '4. Calculate Score' },
    { num: 5, title: 'Weak Concepts', label: '5. Identify Weak Areas' },
    { num: 6, title: 'Adaptive Revision', label: '6. Recommend Revision' },
    { num: 7, title: 'Next Learning Step', label: '7. Next Learning Step' },
  ];

  const handleNextStep = () => {
    if (currentStep < 7) setCurrentStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const handleResetDemo = () => {
    setCurrentStep(1);
  };

  // Calculated score for the demo
  const score = Object.entries(demoAnswers).reduce((acc, [idx, optIdx]) => {
    const q = questions[parseInt(idx, 10)];
    return q && optIdx === q.correctIndex ? acc + 1 : acc;
  }, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Demo Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-peach-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-coral-600 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-coral-500 animate-pulse" />
              <span>College AI Competition · Live Judging Demonstration</span>
            </div>
            <h2 className="text-2xl font-black text-stone-900 mt-1">
              End-to-End AI Learning Pipeline
            </h2>
            <div className="flex flex-wrap items-center gap-2 text-xs text-stone-600 mt-1">
              <span>Subject: <strong className="text-stone-900">Digital Signal Processing</strong></span>
              <span>·</span>
              <span>Topic: <strong className="text-coral-600">Sampling Theorem & Aliasing</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleResetDemo}
              className="px-3 py-1.5 text-xs font-semibold text-stone-600 bg-peach-50 hover:bg-peach-100 rounded-lg transition border border-peach-200"
            >
              Reset Demo
            </button>
            {currentStep < 7 ? (
              <button
                onClick={handleNextStep}
                className="px-4 py-2 text-xs font-bold text-white bg-coral-500 hover:bg-coral-600 rounded-xl transition flex items-center gap-1.5 shadow-xs"
              >
                <span>Advance to Step {currentStep + 1}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => onLoadModuleInTutor(dspModule)}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition flex items-center gap-1.5 shadow-xs"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Open in AI Tutor</span>
              </button>
            )}
          </div>
        </div>

        {/* 7-Step Navigation Pipeline */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1.5 pt-3 border-t border-peach-100">
          {steps.map((st) => {
            const isCompleted = st.num < currentStep;
            const isCurrent = st.num === currentStep;

            return (
              <button
                key={st.num}
                onClick={() => setCurrentStep(st.num)}
                className={`p-2 rounded-xl text-left border transition cursor-pointer ${
                  isCurrent
                    ? 'bg-coral-500 text-white border-coral-600 shadow-xs'
                    : isCompleted
                    ? 'bg-emerald-50 text-emerald-950 border-emerald-200'
                    : 'bg-peach-50/40 text-stone-500 border-peach-200/60'
                }`}
              >
                <div className="text-[10px] font-bold opacity-80">
                  {isCompleted ? '✓ Done' : `Step ${st.num}`}
                </div>
                <div className="text-xs font-bold truncate mt-0.5">{st.title}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 1: Generate an Explanation */}
      {currentStep === 1 && (
        <div className="bg-white rounded-2xl p-6 border border-peach-200/80 shadow-xs space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-peach-100 pb-3">
            <span className="text-xs font-bold text-coral-600 uppercase tracking-wider">
              Step 1 of 7 · AI Tutor Generated Explanation
            </span>
            <span className="text-xs font-semibold text-stone-500">Gemini 3.8 Flash</span>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-peach-50/40 border border-peach-200">
              <span className="text-[11px] font-bold text-coral-600 uppercase tracking-wider">Core Formula & Solution</span>
              <h3 className="text-lg font-black text-stone-900 mt-1">{dspModule.title}</h3>
              <p className="text-xs sm:text-sm text-stone-700 mt-1 leading-relaxed">
                {dspModule.directSolution}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-sm text-stone-900">Vivid Real-World Analogy: {dspModule.analogy.title}</h4>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed bg-cream-50/60 p-3.5 rounded-xl border border-peach-200/60">
                {dspModule.analogy.story}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
              {dspModule.keySteps.slice(0, 2).map((s) => (
                <div key={s.stepNumber} className="p-3 rounded-xl border border-peach-200 bg-white">
                  <span className="text-xs font-bold text-coral-600">Step {s.stepNumber}: {s.title}</span>
                  <p className="text-xs text-stone-600 mt-1 leading-snug">{s.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Generate 5 MCQs */}
      {currentStep === 2 && (
        <div className="bg-white rounded-2xl p-6 border border-peach-200/80 shadow-xs space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-peach-100 pb-3">
            <span className="text-xs font-bold text-coral-600 uppercase tracking-wider">
              Step 2 of 7 · Generated Five Multiple-Choice Diagnostic Questions
            </span>
            <span className="text-xs font-semibold text-stone-500">5 Distinct Sub-Concepts</span>
          </div>

          <div className="space-y-3">
            {questions.map((q, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-peach-200 bg-peach-50/20 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-900">
                    Q{idx + 1}: {q.question}
                  </span>
                  <span className="text-[10px] font-bold text-coral-700 bg-coral-50 px-2 py-0.5 rounded border border-coral-200 shrink-0">
                    {q.conceptTag}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1 text-[11px] text-stone-600 pt-1">
                  {q.options.map((opt, oIdx) => (
                    <div key={oIdx} className="truncate">
                      {String.fromCharCode(65 + oIdx)}. {opt}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 3: Answer the Questions */}
      {currentStep === 3 && (
        <div className="bg-white rounded-2xl p-6 border border-peach-200/80 shadow-xs space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-peach-100 pb-3">
            <span className="text-xs font-bold text-coral-600 uppercase tracking-wider">
              Step 3 of 7 · Student Answers Recorded
            </span>
            <span className="text-xs font-semibold text-stone-500">Live Interactive Input</span>
          </div>

          <div className="p-3.5 rounded-xl bg-peach-50/50 border border-peach-200 text-xs text-stone-700">
            <strong>Demonstration Simulation:</strong> The student answered all 5 questions. They correctly solved questions 1, 3, 4, and 5, but missed Question 2 on <em>Aliasing & Spectral Folding</em>.
          </div>

          <div className="space-y-3">
            {questions.map((q, idx) => {
              const userChoice = demoAnswers[idx];
              return (
                <div key={idx} className="p-3.5 rounded-xl border border-peach-200 bg-white space-y-2">
                  <div className="font-semibold text-xs text-stone-900">
                    {idx + 1}. {q.question}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {q.options.map((opt, oIdx) => (
                      <button
                        key={oIdx}
                        onClick={() => setDemoAnswers((prev) => ({ ...prev, [idx]: oIdx }))}
                        className={`text-left p-2 rounded-lg text-xs border transition cursor-pointer ${
                          userChoice === oIdx
                            ? 'bg-coral-50 border-coral-400 text-coral-950 font-bold'
                            : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                        }`}
                      >
                        {String.fromCharCode(65 + oIdx)}. {opt}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 4: Show the Actual Score */}
      {currentStep === 4 && (
        <div className="bg-white rounded-2xl p-6 border border-peach-200/80 shadow-xs space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-peach-100 pb-3">
            <span className="text-xs font-bold text-coral-600 uppercase tracking-wider">
              Step 4 of 7 · Diagnostic Scoring Calculation
            </span>
            <span className="text-xs font-semibold text-stone-500">Accurate Real-Time Computation</span>
          </div>

          <div className="p-6 rounded-2xl bg-peach-50/60 border border-peach-300 text-center space-y-2">
            <div className="text-4xl font-black text-stone-900">
              {score} / 5
            </div>
            <div className="text-sm font-bold text-coral-700">
              {Math.round((score / 5) * 100)}% Verified Accuracy
            </div>
            <p className="text-xs text-stone-600 max-w-md mx-auto">
              Diagnostic assessment completed. 4 out of 5 sub-concepts demonstrated solid comprehension. 1 concept requires targeted remediation.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            {questions.map((q, idx) => {
              const isCorrect = demoAnswers[idx] === q.correctIndex;
              return (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                    isCorrect
                      ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                      : 'bg-coral-50/70 border-coral-200 text-coral-950'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-coral-600 shrink-0" />
                    )}
                    <span className="font-semibold">
                      Q{idx + 1}: {q.conceptTag}
                    </span>
                  </div>
                  <span className="font-bold">
                    {isCorrect ? 'Correct (+1)' : 'Incorrect (0)'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 5: Identify Weak Concepts */}
      {currentStep === 5 && (
        <div className="bg-white rounded-2xl p-6 border border-peach-200/80 shadow-xs space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-peach-100 pb-3">
            <span className="text-xs font-bold text-coral-600 uppercase tracking-wider">
              Step 5 of 7 · Gap Analysis & Weak Concept Isolation
            </span>
            <span className="text-xs font-semibold text-stone-500">Autonomous Diagnostics</span>
          </div>

          <div className="p-4 rounded-xl bg-coral-50/70 border border-coral-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-coral-800">
              <AlertTriangle className="w-4 h-4 text-coral-600" />
              <span>Isolated Knowledge Gap: Aliasing & Spectral Folding</span>
            </div>
            <p className="text-xs text-coral-900 leading-relaxed">
              The student missed Question 2: &quot;If a 12 kHz pure sine wave is sampled at 20 kHz, what apparent alias frequency will be observed?&quot;
              The student chose an incorrect frequency instead of recognizing that frequencies above the Nyquist cutoff (fs/2 = 10 kHz) fold over: |20 - 12| = 8 kHz.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-peach-50/30 border border-peach-200 space-y-2 text-xs">
            <h4 className="font-bold text-stone-900">Why this Gap Matters:</h4>
            <p className="text-stone-600 leading-relaxed">
              In real-world engineering, failing to calculate alias frequencies leads to irreversible distortion in acoustic recording, seismic analysis, and medical doppler echocardiograms.
            </p>
          </div>
        </div>
      )}

      {/* STEP 6: Recommend Targeted Revision */}
      {currentStep === 6 && (
        <div className="bg-white rounded-2xl p-6 border border-peach-200/80 shadow-xs space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-peach-100 pb-3">
            <span className="text-xs font-bold text-coral-600 uppercase tracking-wider">
              Step 6 of 7 · Targeted Adaptive Revision
            </span>
            <span className="text-xs font-semibold text-stone-500">Personalized Engine</span>
          </div>

          <div className="p-4 rounded-xl border border-peach-300 bg-peach-50/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-coral-700 bg-coral-100 px-2 py-0.5 rounded">
                High Priority Recommendation
              </span>
              <span className="text-xs text-stone-500">Difficulty: Targeted Practice</span>
            </div>

            <h3 className="font-black text-base text-stone-900">
              Remediation Topic: Spectral Folding & Mirroring in Frequency Domain
            </h3>

            <div className="text-xs text-coral-800 bg-coral-50 p-3 rounded-lg border border-coral-200 leading-relaxed">
              <strong>Explicit Pedagogical Reason:</strong> Triggered because the student missed Question 2 on folding frequency calculation. We reinforce the periodic replication formula Xs(f) = (1/Ts) · Σ X(f - k·fs) with an interactive visual frequency-mirroring slider.
            </div>

            <p className="text-xs text-stone-600">
              <strong>Recommended Action:</strong> Complete the 3-minute micro-derivation of spectral folding, then answer the recovery verification challenge.
            </p>
          </div>
        </div>
      )}

      {/* STEP 7: Display the Next Learning Step */}
      {currentStep === 7 && (
        <div className="bg-white rounded-2xl p-6 border border-peach-200/80 shadow-xs space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-peach-100 pb-3">
            <span className="text-xs font-bold text-coral-600 uppercase tracking-wider">
              Step 7 of 7 · Immediate Recovery Milestone
            </span>
            <span className="text-xs font-bold text-emerald-600">Loop Complete ✓</span>
          </div>

          <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50/60 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
              <Zap className="w-4 h-4 text-emerald-600" />
              <span>Next Actionable Milestone: Quick Recovery Check</span>
            </div>

            <p className="text-xs sm:text-sm text-stone-800 font-semibold">
              Recovery Question: If an analog signal with components up to 18 kHz is sampled at 30 kHz, what is the frequency of the aliased component?
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
              <div className="p-2.5 rounded-lg border border-stone-200 bg-white">A. 18 kHz</div>
              <div className="p-2.5 rounded-lg border border-emerald-500 bg-emerald-100 font-bold text-emerald-950">
                B. 12 kHz (|30 - 18| = 12 kHz) ✓
              </div>
              <div className="p-2.5 rounded-lg border border-stone-200 bg-white">C. 6 kHz</div>
              <div className="p-2.5 rounded-lg border border-stone-200 bg-white">D. No aliasing occurs</div>
            </div>

            <div className="p-2.5 rounded-lg bg-white/80 border border-emerald-200 text-xs text-emerald-900 mt-2">
              <strong>Recovery Insight:</strong> 30 kHz sampling rate yields a Nyquist folding boundary at 15 kHz. Because 18 kHz exceeds 15 kHz by 3 kHz, it folds backwards by 3 kHz: 15 - 3 = 12 kHz.
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-peach-100">
            <div className="text-xs text-stone-500">
              The full 7-step cycle (Learn → Practice → Evaluate → Improve) has executed successfully.
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onLoadModuleInTutor(dspModule)}
                className="px-4 py-2 bg-coral-500 hover:bg-coral-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Open DSP Lesson in AI Tutor</span>
              </button>
              <button
                onClick={onNavigateToAdaptive}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition"
              >
                Open Adaptive Engine
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
