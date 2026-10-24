import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle, Award, RotateCcw, Sparkles, ArrowRight, AlertTriangle } from 'lucide-react';
import { QuizQuestion, QuizSubmission } from '../types';

interface InteractiveQuizProps {
  quiz: QuizQuestion[];
  topicTitle?: string;
  onQuizComplete?: (score: number, total: number) => void;
  onQuizSubmitted?: (submission: QuizSubmission) => void;
  onNavigateToAdaptive?: () => void;
}

export const InteractiveQuiz: React.FC<InteractiveQuizProps> = ({
  quiz,
  topicTitle = 'Learning Assessment',
  onQuizComplete,
  onQuizSubmitted,
  onNavigateToAdaptive,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [weakConcepts, setWeakConcepts] = useState<
    Array<{ concept: string; question: string; explanation: string }>
  >([]);

  if (!quiz || quiz.length === 0) return null;

  const handleSelectOption = (questionIndex: number, optionIndex: number) => {
    if (showResults) return;
    const nextAnswers = { ...selectedAnswers, [questionIndex]: optionIndex };
    setSelectedAnswers(nextAnswers);

    // If all questions are answered, submit automatically
    if (Object.keys(nextAnswers).length === quiz.length) {
      finalizeQuiz(nextAnswers);
    }
  };

  const finalizeQuiz = (answers: Record<number, number>) => {
    setShowResults(true);
    let calculatedScore = 0;
    const identifiedWeak: Array<{ concept: string; question: string; explanation: string }> = [];

    quiz.forEach((q, idx) => {
      if (answers[idx] === q.correctIndex) {
        calculatedScore += 1;
      } else {
        identifiedWeak.push({
          concept: q.conceptTag || `Question ${idx + 1} Core Concept`,
          question: q.question,
          explanation: q.explanation,
        });
      }
    });

    setWeakConcepts(identifiedWeak);

    if (onQuizComplete) {
      onQuizComplete(calculatedScore, quiz.length);
    }

    if (onQuizSubmitted) {
      const submission: QuizSubmission = {
        id: 'sub_' + Date.now(),
        topic: topicTitle,
        score: calculatedScore,
        total: quiz.length,
        percentage: Math.round((calculatedScore / quiz.length) * 100),
        timestamp: new Date().toISOString(),
        answers,
        weakConcepts: identifiedWeak,
      };
      onQuizSubmitted(submission);
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setShowResults(false);
    setWeakConcepts([]);
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const score = quiz.reduce(
    (acc, q, idx) => (selectedAnswers[idx] === q.correctIndex ? acc + 1 : acc),
    0
  );

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-peach-200/90 shadow-2xs space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-peach-100 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-coral-100 text-coral-600 flex items-center justify-center font-bold">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-base text-stone-900">Check Your Understanding</h3>
            <p className="text-xs text-stone-500">
              5-question targeted diagnostic with concept isolation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-stone-600">
            {answeredCount}/{quiz.length} Answered
          </span>
          {answeredCount > 0 && (
            <button
              onClick={handleReset}
              className="p-1 text-stone-400 hover:text-stone-700 rounded transition"
              title="Reset quiz"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Completion Banner */}
      {showResults && (
        <div
          className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            score === quiz.length
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : score >= quiz.length / 2
              ? 'bg-peach-50 border-peach-300 text-stone-900'
              : 'bg-coral-50 border-coral-200 text-coral-900'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white shadow-xs flex items-center justify-center text-xl shrink-0">
              {score === quiz.length ? '🏆' : score >= quiz.length / 2 ? '👍' : '💪'}
            </div>
            <div>
              <div className="font-bold text-sm">
                Score: {score} of {quiz.length} Correct ({Math.round((score / quiz.length) * 100)}%)
              </div>
              <p className="text-xs opacity-90">
                {score === quiz.length
                  ? 'Outstanding! You demonstrated 100% conceptual clarity across all tested sub-principles.'
                  : score >= quiz.length / 2
                  ? 'Good job! Check the key takeaways below for the questions you missed.'
                  : 'Great effort! Re-reading the core analogy will cement the foundations.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {weakConcepts.length > 0 && onNavigateToAdaptive && (
              <button
                onClick={onNavigateToAdaptive}
                className="px-3 py-1.5 rounded-lg bg-coral-500 hover:bg-coral-600 text-white text-xs font-bold transition flex items-center gap-1 shadow-2xs cursor-pointer"
              >
                <span>Adaptive Revision</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-stone-700 text-xs font-bold hover:bg-stone-50 shadow-2xs transition cursor-pointer"
            >
              Retake
            </button>
          </div>
        </div>
      )}

      {/* Weak Concepts Alert inside banner */}
      {showResults && weakConcepts.length > 0 && (
        <div className="p-3.5 rounded-xl bg-coral-50/80 border border-coral-200 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-coral-800">
            <AlertTriangle className="w-4 h-4 text-coral-600" />
            <span>Remediation Target: Missed Sub-Concepts ({weakConcepts.length})</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {weakConcepts.map((w, idx) => (
              <span
                key={idx}
                className="text-[11px] font-semibold px-2 py-0.5 rounded bg-white border border-coral-200 text-coral-800"
              >
                • {w.concept}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Questions list */}
      <div className="space-y-6">
        {quiz.map((q, qIdx) => {
          const userAnswer = selectedAnswers[qIdx];
          const hasAnswered = userAnswer !== undefined;
          const isCorrect = hasAnswered && userAnswer === q.correctIndex;

          return (
            <div key={qIdx} className="space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-lg bg-peach-100 text-coral-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {qIdx + 1}
                  </span>
                  <div>
                    <span className="font-semibold text-sm text-stone-900">{q.question}</span>
                    {q.conceptTag && (
                      <span className="block text-[11px] font-medium text-stone-400 mt-0.5">
                        Focus: <strong className="text-stone-600">{q.conceptTag}</strong>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-7">
                {q.options.map((opt, optIdx) => {
                  let buttonStyle =
                    'border-stone-200 bg-cream-50/60 hover:bg-peach-50/60 text-stone-700';

                  if (hasAnswered) {
                    if (optIdx === q.correctIndex) {
                      buttonStyle =
                        'border-emerald-500 bg-emerald-50/80 text-emerald-950 font-semibold ring-1 ring-emerald-500/50';
                    } else if (optIdx === userAnswer) {
                      buttonStyle =
                        'border-coral-400 bg-coral-50/80 text-coral-950 line-through opacity-85';
                    } else {
                      buttonStyle = 'border-stone-100 bg-stone-50/40 text-stone-400 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={hasAnswered}
                      onClick={() => handleSelectOption(qIdx, optIdx)}
                      className={`text-left p-3 rounded-xl border text-xs transition flex items-start gap-2 cursor-pointer ${buttonStyle}`}
                    >
                      <span className="font-bold text-[11px] uppercase shrink-0 mt-0.5">
                        {String.fromCharCode(65 + optIdx)}.
                      </span>
                      <span className="flex-1 leading-snug">{opt}</span>
                      {hasAnswered && optIdx === q.correctIndex && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      {hasAnswered && optIdx === userAnswer && optIdx !== q.correctIndex && (
                        <XCircle className="w-4 h-4 text-coral-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation card after answering */}
              {hasAnswered && (
                <div
                  className={`ml-7 p-3 rounded-xl text-xs border ${
                    isCorrect
                      ? 'bg-emerald-50/70 border-emerald-200/70 text-emerald-900'
                      : 'bg-peach-50/80 border-peach-200 text-stone-800'
                  }`}
                >
                  <span className="font-bold block mb-0.5">
                    {isCorrect ? '✅ Spot on!' : '💡 Key Concept:'}
                  </span>
                  <span>{q.explanation}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
