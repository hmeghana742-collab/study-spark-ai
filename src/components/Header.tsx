import React from 'react';
import { Sparkles, SlidersHorizontal, Bookmark, Award, Zap } from 'lucide-react';
import { LearnerProfile } from '../types';

interface HeaderProps {
  profile: LearnerProfile;
  onOpenSettings: () => void;
  onOpenLibrary: () => void;
  savedCount: number;
  masteredCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  onOpenSettings,
  onOpenLibrary,
  savedCount,
  masteredCount,
}) => {
  const getLevelLabel = (lvl: string) => {
    switch (lvl) {
      case 'eli5':
        return '🧒 ELI10 / Simple';
      case 'middle_school':
        return '🎒 Middle School';
      case 'high_school':
        return '🎓 High School';
      case 'college':
        return '🏛️ College Level';
      case 'curious_adult':
        return '💡 Curious Adult';
      default:
        return lvl;
    }
  };

  const getStyleLabel = (style: string) => {
    switch (style) {
      case 'analogy':
        return '🧩 Analogy First';
      case 'step_by_step':
        return '🪜 Step-by-Step';
      case 'story':
        return '📖 Story Mode';
      case 'socratic':
        return '❓ Socratic Coach';
      case 'cheat_sheet':
        return '⚡ Cheat Sheet';
      default:
        return style;
    }
  };

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'professor':
        return '👨‍🏫 Professor Mode';
      case 'researcher':
        return '🔬 Scholar Mode';
      case 'professional':
        return '💼 Professional Mode';
      default:
        return '🎓 Student Mode';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-amber-50/85 backdrop-blur-md border-b border-amber-200/60 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-amber-500/25">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-stone-900">
                Study<span className="text-amber-600">Spark</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                AI Platform
              </span>
              <span className="hidden sm:inline-flex text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200">
                {getRoleBadge(profile.role)}
              </span>
            </div>
            <p className="text-xs text-stone-500 hidden sm:block font-medium">
              For all learners, high school & college students, and university professors
            </p>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Active profile quick tune button */}
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100/90 hover:bg-stone-200/90 text-stone-700 border border-stone-200 text-xs font-semibold transition shadow-xs"
            title="Customize your role, level, and teaching/learning style"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600" />
            <span className="font-bold text-stone-800">{getRoleBadge(profile.role).split(' ')[1]}</span>
            <span className="hidden md:inline text-stone-300">|</span>
            <span className="hidden md:inline text-stone-600">{getLevelLabel(profile.level)}</span>
          </button>

          {/* Library / Saved topics */}
          <button
            onClick={onOpenLibrary}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-amber-100/60 text-stone-800 border border-amber-200/80 text-xs font-semibold transition shadow-xs"
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">My Topics</span>
            {savedCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px] font-bold">
                {savedCount}
              </span>
            )}
          </button>

          {/* Mastery points badge */}
          {masteredCount > 0 && (
            <div
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold"
              title={`${masteredCount} topic${masteredCount > 1 ? 's' : ''} mastered!`}
            >
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              <span>{masteredCount}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
