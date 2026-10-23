import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle, Award, RotateCcw, Sparkles } from 'lucide-react';
import { QuizQuestion } from '../types';

interface InteractiveQuizProps {
  quiz: QuizQuestion[];
  onQuizComplete?: (score: number, total: number) => void;
}

export const InteractiveQuiz: React.FC<InteractiveQuizProps> = ({ quiz, onQuizComplete }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  if (!quiz || quiz.length === 0) return null;

  const handleSelectOption = (questionIndex: number, optionIndex: number) => {
    if (selectedAnswers[questionIndex] !== undefined) return; // Prevent changing after selection
    const nextAnswers = { ...selectedAnswers, [questionIndex]: optionIndex };
    setSelectedAnswers(nextAnswers);

    if (Object.keys(nextAnswers).length === quiz.length) {
      setShowResults(true);
      const score = quiz.reduce(
        (acc, q, idx) => (nextAnswers[idx] === q.correctIndex ? acc + 1 : acc),
        0
      );
      if (onQuizComplete) {
        onQuizComplete(score, quiz.length);
      }
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setShowResults(false);
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const score = quiz.reduce(
    (acc, q, idx) => (selectedAnswers[idx] === q.correctIndex ? acc + 1 : acc),
    0
  );

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-amber-200/90 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-base text-stone-900">Check Your Understanding</h3>
            <p className="text-xs text-stone-500">Quick interactive test with instant explanations</p>
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
          className={`p-4 rounded-xl border flex items-center justify-between ${
            score === quiz.length
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : score >= quiz.length / 2
              ? 'bg-amber-50 border-amber-200 text-amber-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white shadow-xs flex items-center justify-center text-xl">
              {score === quiz.length ? '🏆' : score >= quiz.length / 2 ? '👍' : '💪'}
            </div>
            <div>
              <div className="font-bold text-sm">
                Score: {score} of {quiz.length} Correct ({Math.round((score / quiz.length) * 100)}%)
              </div>
              <p className="text-xs opacity-90">
                {score === quiz.length
                  ? 'Outstanding! You have thoroughly grasped this concept.'
                  : score >= quiz.length / 2
                  ? 'Good job! Review the explanations below to master the trickier parts.'
                  : 'Great effort! Re-reading the core analogy will make this super clear.'}
              </p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-stone-700 text-xs font-bold hover:bg-stone-50 shadow-2xs transition"
          >
            Retake
          </button>
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
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {qIdx + 1}
                </span>
                <span className="font-semibold text-sm text-stone-900">{q.question}</span>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-7">
                {q.options.map((opt, optIdx) => {
                  let buttonStyle =
                    'border-stone-200 bg-stone-50/70 hover:bg-stone-100 text-stone-700';

                  if (hasAnswered) {
                    if (optIdx === q.correctIndex) {
                      buttonStyle =
                        'border-emerald-500 bg-emerald-50/80 text-emerald-950 font-semibold ring-1 ring-emerald-500/50';
                    } else if (optIdx === userAnswer) {
                      buttonStyle =
                        'border-rose-400 bg-rose-50/80 text-rose-950 line-through opacity-85';
                    } else {
                      buttonStyle = 'border-stone-200 bg-stone-50/40 text-stone-400 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={hasAnswered}
                      onClick={() => handleSelectOption(qIdx, optIdx)}
                      className={`text-left p-3 rounded-xl border text-xs transition flex items-start gap-2 ${buttonStyle}`}
                    >
                      <span className="font-bold text-[11px] uppercase shrink-0 mt-0.5">
                        {String.fromCharCode(65 + optIdx)}.
                      </span>
                      <span className="flex-1">{opt}</span>
                      {hasAnswered && optIdx === q.correctIndex && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      {hasAnswered && optIdx === userAnswer && optIdx !== q.correctIndex && (
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
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
                      : 'bg-amber-50/70 border-amber-200/70 text-amber-900'
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
