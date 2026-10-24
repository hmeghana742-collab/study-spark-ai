import React, { useState } from 'react';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  BookOpen,
  Target,
  RefreshCw,
} from 'lucide-react';
import { QuizQuestion, QuizSubmission, LearnerProfile } from '../types';

interface SmartQuizViewProps {
  currentTopic: string;
  quizQuestions: QuizQuestion[];
  profile: LearnerProfile;
  onQuizSubmitted: (submission: QuizSubmission) => void;
  onNavigateToAdaptive: () => void;
  onGenerateNewQuiz: (topic: string) => Promise<void>;
  isLoadingQuiz?: boolean;
}

export const SmartQuizView: React.FC<SmartQuizViewProps> = ({
  currentTopic,
  quizQuestions,
  profile,
  onQuizSubmitted,
  onNavigateToAdaptive,
  onGenerateNewQuiz,
  isLoadingQuiz = false,
}) => {
  const [topicInput, setTopicInput] = useState(currentTopic || '');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [lastSubmission, setLastSubmission] = useState<QuizSubmission | null>(null);

  const answeredCount = Object.keys(selectedAnswers).length;
  const totalQuestions = quizQuestions.length;

  const handleSelectOption = (questionIndex: number, optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handleSubmitQuiz = () => {
    if (answeredCount < totalQuestions) {
      if (
        !window.confirm(
          `You have answered ${answeredCount} of ${totalQuestions} questions. Would you like to submit now?`
        )
      ) {
        return;
      }
    }

    // Calculate score
    let score = 0;
    const weakConcepts: Array<{ concept: string; question: string; explanation: string }> = [];

    quizQuestions.forEach((q, idx) => {
      const userAnswer = selectedAnswers[idx];
      if (userAnswer === q.correctIndex) {
        score += 1;
      } else {
        const concept = q.conceptTag || `Question ${idx + 1} Principles`;
        weakConcepts.push({
          concept,
          question: q.question,
          explanation: q.explanation,
        });
      }
    });

    const submission: QuizSubmission = {
      id: 'sub_' + Date.now(),
      topic: currentTopic || 'General Quiz',
      score,
      total: totalQuestions,
      percentage: totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0,
      timestamp: new Date().toISOString(),
      answers: selectedAnswers,
      weakConcepts,
    };

    setLastSubmission(submission);
    setIsSubmitted(true);
    onQuizSubmitted(submission);
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setLastSubmission(null);
  };

  const handleQuickTopicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicInput.trim() || isLoadingQuiz) return;
    handleReset();
    onGenerateNewQuiz(topicInput.trim());
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Quiz Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-peach-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-coral-600 uppercase tracking-wider">
              <Target className="w-4 h-4" />
              <span>Smart Diagnostic Assessment · 5 Questions</span>
            </div>
            <h2 className="text-2xl font-bold text-stone-900 mt-1">
              {currentTopic ? `Quiz: ${currentTopic}` : 'Targeted MCQ Diagnostic'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Test your understanding. We identify your exact weak concepts to personalize revision.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isSubmitted && (
              <button
                onClick={handleReset}
                className="px-3.5 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Retake Quiz
              </button>
            )}
          </div>
        </div>

        {/* Change topic search form */}
        <form onSubmit={handleQuickTopicSubmit} className="flex gap-2 pt-2 border-t border-peach-100">
          <input
            type="text"
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            placeholder="Generate 5 fresh MCQs on any topic (e.g. Sampling Theorem, Dynamic Programming, Fourier Transform)..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-peach-200 bg-peach-50/40 text-stone-900 placeholder:text-stone-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-coral-400"
          />
          <button
            type="submit"
            disabled={isLoadingQuiz || !topicInput.trim()}
            className="px-4 py-2.5 bg-coral-500 hover:bg-coral-600 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 shrink-0 shadow-xs"
          >
            {isLoadingQuiz ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>Generate 5 MCQs</span>
          </button>
        </form>
      </div>

      {/* Submission Results & Weak Concepts Card */}
      {isSubmitted && lastSubmission && (
        <div
          className={`p-6 rounded-2xl border transition-all ${
            lastSubmission.score === totalQuestions
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
              : lastSubmission.score >= totalQuestions / 2
              ? 'bg-peach-50/80 border-peach-300 text-stone-900'
              : 'bg-coral-50/90 border-coral-200 text-coral-950'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black">
                  {lastSubmission.score} / {totalQuestions}
                </span>
                <span className="text-sm font-bold opacity-80">
                  ({lastSubmission.percentage}% Accuracy)
                </span>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    lastSubmission.percentage >= 80
                      ? 'bg-emerald-200/60 text-emerald-900'
                      : lastSubmission.percentage >= 50
                      ? 'bg-amber-200/60 text-amber-900'
                      : 'bg-coral-200/60 text-coral-900'
                  }`}
                >
                  {lastSubmission.percentage >= 80
                    ? 'Mastery Level'
                    : lastSubmission.percentage >= 50
                    ? 'Proficient'
                    : 'Needs Focused Revision'}
                </span>
              </div>
              <p className="text-xs text-stone-600">
                {lastSubmission.percentage >= 80
                  ? 'Impressive performance! You demonstrated solid mastery across core sub-principles.'
                  : 'Great effort! Review the highlighted explanations below to solidify the concepts you missed.'}
              </p>
            </div>

            <button
              onClick={onNavigateToAdaptive}
              className="px-4 py-2.5 bg-coral-600 hover:bg-coral-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 shadow-xs shrink-0"
            >
              <span>View Adaptive Recommendations</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Weak Concepts Alert */}
          {lastSubmission.weakConcepts.length > 0 && (
            <div className="mt-4 pt-4 border-t border-peach-200/60 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-coral-700">
                <AlertTriangle className="w-4 h-4" />
                <span>Identified Weak Concepts ({lastSubmission.weakConcepts.length}):</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {lastSubmission.weakConcepts.map((w, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-lg bg-white border border-coral-200 text-coral-800 font-medium shadow-2xs"
                  >
                    • {w.concept}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-4">
        {quizQuestions.map((q, qIdx) => {
          const userAnswer = selectedAnswers[qIdx];
          const hasSelected = userAnswer !== undefined;
          const isCorrect = isSubmitted && userAnswer === q.correctIndex;
          const isIncorrect = isSubmitted && userAnswer !== q.correctIndex;

          return (
            <div
              key={qIdx}
              className={`bg-white rounded-2xl p-5 border transition-all ${
                isSubmitted
                  ? isCorrect
                    ? 'border-emerald-300 ring-1 ring-emerald-200'
                    : 'border-coral-300 ring-1 ring-coral-200'
                  : hasSelected
                  ? 'border-peach-400'
                  : 'border-peach-200/70'
              }`}
            >
              {/* Question header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-peach-100 text-coral-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {qIdx + 1}
                  </span>
                  <div>
                    <h4 className="font-semibold text-sm sm:text-base text-stone-900 leading-snug">
                      {q.question}
                    </h4>
                    {q.conceptTag && (
                      <span className="inline-block mt-1 text-[11px] font-medium text-stone-400">
                        Concept: <strong className="text-stone-600">{q.conceptTag}</strong>
                      </span>
                    )}
                  </div>
                </div>

                {isSubmitted && (
                  <div className="shrink-0">
                    {isCorrect ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Correct (+1)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-coral-700 bg-coral-50 px-2 py-0.5 rounded-md border border-coral-200">
                        <XCircle className="w-3.5 h-3.5" /> Missed
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pl-0 sm:pl-8">
                {q.options.map((opt, optIdx) => {
                  let styleClass =
                    'border-stone-200 bg-cream-50/50 hover:bg-peach-50/60 text-stone-700';

                  if (hasSelected && !isSubmitted) {
                    if (optIdx === userAnswer) {
                      styleClass =
                        'border-coral-400 bg-coral-50/60 text-stone-900 font-semibold ring-1 ring-coral-400';
                    }
                  } else if (isSubmitted) {
                    if (optIdx === q.correctIndex) {
                      styleClass =
                        'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold ring-1 ring-emerald-500';
                    } else if (optIdx === userAnswer && userAnswer !== q.correctIndex) {
                      styleClass =
                        'border-coral-400 bg-coral-50 text-coral-950 font-medium line-through';
                    } else {
                      styleClass = 'border-stone-100 bg-stone-50/40 text-stone-400 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={isSubmitted}
                      onClick={() => handleSelectOption(qIdx, optIdx)}
                      className={`text-left p-3 rounded-xl border text-xs sm:text-sm transition flex items-start gap-2.5 cursor-pointer ${styleClass}`}
                    >
                      <span className="w-5 h-5 rounded-md bg-stone-100 text-stone-600 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="flex-1 leading-snug">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation section after submission */}
              {isSubmitted && (
                <div
                  className={`mt-4 p-3.5 rounded-xl text-xs sm:text-sm border pl-0 sm:pl-8 ml-0 sm:ml-8 ${
                    isCorrect
                      ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                      : 'bg-peach-50/80 border-peach-200 text-stone-800'
                  }`}
                >
                  <div className="font-bold mb-1 flex items-center gap-1.5">
                    {isCorrect ? (
                      <span className="text-emerald-700">✓ Verified Concept:</span>
                    ) : (
                      <span className="text-coral-700">💡 Explanation & Correct Rationale:</span>
                    )}
                  </div>
                  <p className="text-stone-700 leading-relaxed">{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit Action Bar */}
      {!isSubmitted && (
        <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-peach-200 shadow-md flex items-center justify-between gap-4">
          <div className="text-xs text-stone-600">
            <span className="font-bold text-stone-900">{answeredCount}</span> of{' '}
            <span className="font-bold text-stone-900">{totalQuestions}</span> questions answered
          </div>
          <button
            onClick={handleSubmitQuiz}
            disabled={answeredCount === 0}
            className="px-6 py-2.5 bg-coral-500 hover:bg-coral-600 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-bold transition shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <span>Submit Quiz & Analyze</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
