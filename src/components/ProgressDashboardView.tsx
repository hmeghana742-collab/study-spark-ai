import React from 'react';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  BookOpen,
  ArrowRight,
  TrendingUp,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { QuizSubmission, StudyTask, LearningModule, LearnerProfile } from '../types';

interface ProgressDashboardViewProps {
  quizHistory: QuizSubmission[];
  studyTasks: StudyTask[];
  masteredTopics: string[];
  savedModules: LearningModule[];
  profile: LearnerProfile;
  onNavigateToQuiz: () => void;
  onNavigateToPlanner: () => void;
  onSelectTopic: (topic: string) => void;
}

export const ProgressDashboardView: React.FC<ProgressDashboardViewProps> = ({
  quizHistory,
  studyTasks,
  masteredTopics,
  savedModules,
  profile,
  onNavigateToQuiz,
  onNavigateToPlanner,
  onSelectTopic,
}) => {
  // Compute authentic stats - NEVER invented
  const totalQuizzes = quizHistory.length;
  const averageScore =
    totalQuizzes > 0
      ? Math.round(
          quizHistory.reduce((acc, q) => acc + q.percentage, 0) / totalQuizzes
        )
      : null;

  const totalTasks = studyTasks.length;
  const completedTasks = studyTasks.filter((t) => t.completed).length;

  // Aggregate unique weak concepts from actual quiz records
  const weakConceptsMap = new Map<string, { concept: string; count: number; lastTopic: string }>();
  quizHistory.forEach((q) => {
    q.weakConcepts.forEach((wc) => {
      const key = wc.concept.toLowerCase();
      const existing = weakConceptsMap.get(key);
      if (existing) {
        existing.count += 1;
      } else {
        weakConceptsMap.set(key, {
          concept: wc.concept,
          count: 1,
          lastTopic: q.topic,
        });
      }
    });
  });

  const uniqueWeakConcepts = Array.from(weakConceptsMap.values());

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-peach-200/80 shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-coral-600 uppercase tracking-wider">
          <Award className="w-4 h-4" />
          <span>Real-Time Learning Trajectory</span>
        </div>
        <h2 className="text-2xl font-bold text-stone-900">
          Student Performance Dashboard
        </h2>
        <p className="text-xs sm:text-sm text-stone-500">
          Track verified assessment scores, identified knowledge gaps, and examination milestone completions.
        </p>
      </div>

      {/* KPI Stat Cards (Real Data Only) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-peach-200/80 shadow-2xs space-y-1">
          <span className="text-[11px] font-semibold text-stone-500">Quizzes Taken</span>
          <div className="text-2xl font-black text-stone-900">{totalQuizzes}</div>
          <span className="text-[11px] text-stone-400">Total assessments</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-peach-200/80 shadow-2xs space-y-1">
          <span className="text-[11px] font-semibold text-stone-500">Average Accuracy</span>
          <div className="text-2xl font-black text-stone-900">
            {averageScore !== null ? `${averageScore}%` : '—'}
          </div>
          <span className="text-[11px] text-stone-400">
            {averageScore !== null ? 'Verified accuracy' : 'No quiz data yet'}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-peach-200/80 shadow-2xs space-y-1">
          <span className="text-[11px] font-semibold text-stone-500">Mastered Topics</span>
          <div className="text-2xl font-black text-emerald-600">{masteredTopics.length}</div>
          <span className="text-[11px] text-stone-400">Marked as understood</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-peach-200/80 shadow-2xs space-y-1">
          <span className="text-[11px] font-semibold text-stone-500">Study Milestones</span>
          <div className="text-2xl font-black text-coral-600">
            {completedTasks}/{totalTasks}
          </div>
          <span className="text-[11px] text-stone-400">Tasks checked off</span>
        </div>
      </div>

      {/* Weak Concepts Inventory */}
      <div className="bg-white rounded-2xl p-6 border border-peach-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-coral-100 text-coral-600 flex items-center justify-center font-bold">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-stone-900">
                Weak Concept Focus Queue ({uniqueWeakConcepts.length})
              </h3>
              <p className="text-xs text-stone-500">
                Concepts where multiple quiz questions were missed
              </p>
            </div>
          </div>
        </div>

        {uniqueWeakConcepts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {uniqueWeakConcepts.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-coral-200/80 bg-peach-50/20 flex items-center justify-between gap-3"
              >
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-stone-900">{item.concept}</h4>
                  <p className="text-[11px] text-stone-500">
                    Flagged in {item.lastTopic} (Missed {item.count}×)
                  </p>
                </div>
                <button
                  onClick={() => onSelectTopic(item.concept)}
                  className="px-3 py-1.5 rounded-lg bg-coral-500 hover:bg-coral-600 text-white text-xs font-semibold transition shrink-0"
                >
                  Revise
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-stone-500 bg-peach-50/30 rounded-xl border border-dashed border-peach-200">
            No weak concepts detected. Great job keeping your quiz accuracy high!
          </div>
        )}
      </div>

      {/* Recent Quiz Assessment History */}
      <div className="bg-white rounded-2xl p-6 border border-peach-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-coral-600" />
            <h3 className="font-bold text-base text-stone-900">
              Recent Quiz History ({quizHistory.length})
            </h3>
          </div>
          <button
            onClick={onNavigateToQuiz}
            className="text-xs font-semibold text-coral-600 hover:text-coral-800 flex items-center gap-1"
          >
            <span>Take New Quiz</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {quizHistory.length > 0 ? (
          <div className="space-y-2.5">
            {quizHistory.map((q) => (
              <div
                key={q.id}
                className="p-3.5 rounded-xl border border-peach-200 bg-cream-50/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs sm:text-sm text-stone-900">{q.topic}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        q.percentage >= 80
                          ? 'bg-emerald-100 text-emerald-800'
                          : q.percentage >= 50
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-coral-100 text-coral-800'
                      }`}
                    >
                      {q.percentage}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-stone-400 mt-0.5">
                    <span>
                      {q.score} / {q.total} correct
                    </span>
                    <span>·</span>
                    <span>{new Date(q.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>

                {q.weakConcepts.length > 0 && (
                  <div className="flex flex-wrap gap-1 sm:justify-end">
                    {q.weakConcepts.map((w, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded bg-coral-50 border border-coral-200 text-coral-700"
                      >
                        {w.concept}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-peach-100 text-coral-600 mx-auto flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-stone-900">No Assessment History Yet</h4>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Your real assessment statistics, scores, and knowledge weaknesses will appear here once you complete your first quiz!
            </p>
            <button
              onClick={onNavigateToQuiz}
              className="mt-2 px-4 py-2 bg-coral-500 hover:bg-coral-600 text-white rounded-xl text-xs font-bold transition"
            >
              Start First Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
