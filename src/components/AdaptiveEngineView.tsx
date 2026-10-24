import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
  TrendingUp,
  AlertCircle,
  BookOpen,
  RotateCcw,
  Zap,
} from 'lucide-react';
import {
  AdaptiveRecommendation,
  QuizSubmission,
  QuizQuestion,
  LearnerProfile,
} from '../types';

interface AdaptiveEngineViewProps {
  currentTopic: string;
  quizHistory: QuizSubmission[];
  recommendations: AdaptiveRecommendation[];
  followUpQuestion?: QuizQuestion;
  profile: LearnerProfile;
  onSelectRevisionTopic: (topic: string) => void;
  onRefreshRecommendations?: () => void;
  isLoading?: boolean;
}

export const AdaptiveEngineView: React.FC<AdaptiveEngineViewProps> = ({
  currentTopic,
  quizHistory,
  recommendations,
  followUpQuestion,
  profile,
  onSelectRevisionTopic,
  onRefreshRecommendations,
  isLoading = false,
}) => {
  // Local state for the follow-up challenge question
  const [challengeAnswer, setChallengeAnswer] = useState<number | null>(null);
  const [challengeSubmitted, setChallengeSubmitted] = useState(false);

  // Collect all unique weak concepts from history
  const allWeakConcepts: Array<{ concept: string; topic: string; explanation: string }> = [];
  quizHistory.forEach((sub) => {
    sub.weakConcepts.forEach((wc) => {
      if (!allWeakConcepts.some((c) => c.concept.toLowerCase() === wc.concept.toLowerCase())) {
        allWeakConcepts.push({
          concept: wc.concept,
          topic: sub.topic,
          explanation: wc.explanation,
        });
      }
    });
  });

  const latestQuiz = quizHistory[0];

  const handleChallengeSelect = (index: number) => {
    if (challengeSubmitted) return;
    setChallengeAnswer(index);
    setChallengeSubmitted(true);
  };

  const handleChallengeReset = () => {
    setChallengeAnswer(null);
    setChallengeSubmitted(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Workflow Cycle Banner */}
      <div className="bg-white rounded-2xl p-6 border border-peach-200/80 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-coral-600 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Adaptive Closed-Loop Learning Engine</span>
            </div>
            <h2 className="text-2xl font-bold text-stone-900 mt-1">
              Personalized Knowledge Mastery Loop
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Continuous diagnostic intelligence adapting explanations and targeted revisions based on your actual performance.
            </p>
          </div>

          {onRefreshRecommendations && (
            <button
              onClick={onRefreshRecommendations}
              disabled={isLoading}
              className="px-3.5 py-2 text-xs font-semibold text-stone-700 bg-peach-50 hover:bg-peach-100 border border-peach-200 rounded-xl transition flex items-center gap-1.5 shrink-0"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Re-Analyze Progress</span>
            </button>
          )}
        </div>

        {/* 4-Stage Learning Pipeline Visualizer */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 pt-2 border-t border-peach-100">
          <div className="p-3 rounded-xl bg-peach-50/50 border border-peach-200/60">
            <span className="text-[10px] font-bold text-coral-600 uppercase tracking-wider">Stage 1</span>
            <h4 className="font-bold text-sm text-stone-900 mt-0.5">1. Learn</h4>
            <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
              Intuitive analogies & key step breakdown
            </p>
          </div>
          <div className="p-3 rounded-xl bg-peach-50/50 border border-peach-200/60">
            <span className="text-[10px] font-bold text-coral-600 uppercase tracking-wider">Stage 2</span>
            <h4 className="font-bold text-sm text-stone-900 mt-0.5">2. Practice</h4>
            <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
              5-question targeted MCQ diagnostic
            </p>
          </div>
          <div className="p-3 rounded-xl bg-coral-50/70 border border-coral-200 ring-1 ring-coral-300">
            <span className="text-[10px] font-bold text-coral-700 uppercase tracking-wider">Stage 3 (Active)</span>
            <h4 className="font-bold text-sm text-coral-950 mt-0.5">3. Evaluate</h4>
            <p className="text-[11px] text-coral-800/80 mt-0.5 leading-snug">
              Extract exact missed sub-concepts
            </p>
          </div>
          <div className="p-3 rounded-xl bg-peach-50/50 border border-peach-200/60">
            <span className="text-[10px] font-bold text-coral-600 uppercase tracking-wider">Stage 4</span>
            <h4 className="font-bold text-sm text-stone-900 mt-0.5">4. Improve</h4>
            <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
              Targeted revision & follow-up drill
            </p>
          </div>
        </div>
      </div>

      {/* Actual Weak Concepts Card */}
      {allWeakConcepts.length > 0 ? (
        <div className="bg-white rounded-2xl p-6 border border-coral-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-coral-100 text-coral-600 flex items-center justify-center">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-base text-stone-900">
                  Detected Knowledge Gaps ({allWeakConcepts.length})
                </h3>
                <p className="text-xs text-stone-500">
                  Derived directly from your recent quiz responses
                </p>
              </div>
            </div>
            {latestQuiz && (
              <span className="text-xs text-stone-400">
                Latest quiz: <strong>{latestQuiz.topic}</strong> ({latestQuiz.score}/{latestQuiz.total})
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {allWeakConcepts.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-peach-200 bg-peach-50/30 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-coral-700 bg-coral-50 px-2 py-0.5 rounded border border-coral-200">
                    {item.concept}
                  </span>
                  <span className="text-[10px] text-stone-400">{item.topic}</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">{item.explanation}</p>
                <button
                  onClick={() => onSelectRevisionTopic(item.concept)}
                  className="text-xs font-semibold text-coral-600 hover:text-coral-800 flex items-center gap-1 pt-1"
                >
                  <span>Launch Deep-Dive Lesson</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-6 border border-peach-200 shadow-xs text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-peach-100 text-coral-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-stone-900">No Weak Concepts Detected Yet</h3>
          <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
            Take a 5-question Smart Quiz to let the adaptive engine diagnose your conceptual boundaries and deliver tailored revision milestones!
          </p>
        </div>
      )}

      {/* Tailored Revision Recommendations */}
      <div className="bg-white rounded-2xl p-6 border border-peach-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-peach-100 text-coral-600 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-base text-stone-900">
              Targeted Revision Recommendations
            </h3>
            <p className="text-xs text-stone-500">
              Ranked by urgency with pedagogical reasoning for every suggestion
            </p>
          </div>
        </div>

        <div className="space-y-3.5">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="p-4 rounded-xl border border-peach-200 bg-cream-50/40 hover:border-coral-300 transition-all space-y-2"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      rec.priority === 'high'
                        ? 'bg-coral-100 text-coral-800 border border-coral-200'
                        : rec.priority === 'medium'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {rec.priority} Priority
                  </span>
                  <span className="text-xs font-semibold text-stone-500">
                    Difficulty: {rec.difficulty}
                  </span>
                </div>
                <button
                  onClick={() => onSelectRevisionTopic(rec.topic)}
                  className="px-3 py-1.5 rounded-lg bg-coral-500 hover:bg-coral-600 text-white text-xs font-semibold transition flex items-center gap-1.5 self-start sm:self-auto shadow-2xs"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Start Revision</span>
                </button>
              </div>

              <div>
                <h4 className="font-bold text-sm sm:text-base text-stone-900">{rec.topic}</h4>
                <div className="text-xs text-coral-700 bg-coral-50/60 p-2.5 rounded-lg border border-coral-200/60 mt-1.5">
                  <strong>Why Recommended:</strong> {rec.reason}
                </div>
              </div>

              <p className="text-xs text-stone-600 mt-1">
                <strong>Next Step:</strong> {rec.actionPrompt}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Targeted Follow-Up Practice Challenge */}
      {followUpQuestion && (
        <div className="bg-white rounded-2xl p-6 border border-peach-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-coral-100 text-coral-600 flex items-center justify-center font-bold">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-base text-stone-900">
                  Targeted Recovery Challenge (1 Question)
                </h3>
                <p className="text-xs text-stone-500">
                  Verify your recovery on: <strong className="text-stone-700">{followUpQuestion.conceptTag || 'Weak Concept'}</strong>
                </p>
              </div>
            </div>

            {challengeSubmitted && (
              <button
                onClick={handleChallengeReset}
                className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Retry Question
              </button>
            )}
          </div>

          <div className="p-4 rounded-xl border border-peach-200 bg-peach-50/20 space-y-3">
            <p className="font-semibold text-sm text-stone-900 leading-snug">
              {followUpQuestion.question}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {followUpQuestion.options.map((opt, optIdx) => {
                let optStyle =
                  'border-stone-200 bg-white hover:bg-peach-50 text-stone-700';

                if (challengeSubmitted) {
                  if (optIdx === followUpQuestion.correctIndex) {
                    optStyle =
                      'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold ring-1 ring-emerald-500';
                  } else if (optIdx === challengeAnswer) {
                    optStyle =
                      'border-coral-400 bg-coral-50 text-coral-950 font-medium line-through';
                  } else {
                    optStyle = 'border-stone-100 bg-stone-50/50 text-stone-400 opacity-60';
                  }
                }

                return (
                  <button
                    key={optIdx}
                    type="button"
                    disabled={challengeSubmitted}
                    onClick={() => handleChallengeSelect(optIdx)}
                    className={`text-left p-3 rounded-xl border text-xs sm:text-sm transition flex items-start gap-2.5 cursor-pointer ${optStyle}`}
                  >
                    <span className="w-5 h-5 rounded-md bg-stone-100 text-stone-600 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="flex-1 leading-snug">{opt}</span>
                  </button>
                );
              })}
            </div>

            {challengeSubmitted && (
              <div
                className={`p-3 rounded-xl text-xs sm:text-sm border ${
                  challengeAnswer === followUpQuestion.correctIndex
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : 'bg-coral-50 border-coral-200 text-coral-950'
                }`}
              >
                <span className="font-bold block mb-1">
                  {challengeAnswer === followUpQuestion.correctIndex
                    ? '✅ Recovery Confirmed! Conceptual gap successfully closed.'
                    : '💡 Conceptual Check:'}
                </span>
                <p className="leading-relaxed">{followUpQuestion.explanation}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
