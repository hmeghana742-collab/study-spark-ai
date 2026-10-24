import React from 'react';
import {
  Sparkles,
  SlidersHorizontal,
  Bookmark,
  Award,
  Globe,
  GraduationCap,
  Target,
  RotateCcw,
  Calendar,
  BarChart3,
  Zap,
} from 'lucide-react';
import { LearnerProfile, MainNavTab } from '../types';

interface HeaderProps {
  profile: LearnerProfile;
  activeTab: MainNavTab;
  onSelectTab: (tab: MainNavTab) => void;
  onOpenSettings: () => void;
  onOpenLibrary: () => void;
  savedCount: number;
  masteredCount: number;
  onLanguageChange: (lang: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  activeTab,
  onSelectTab,
  onOpenSettings,
  onOpenLibrary,
  savedCount,
  masteredCount,
  onLanguageChange,
}) => {
  const LANGUAGES = [
    { code: 'English', label: 'English' },
    { code: 'Spanish', label: 'Español' },
    { code: 'French', label: 'Français' },
    { code: 'German', label: 'Deutsch' },
    { code: 'Hindi', label: 'हिन्दी' },
    { code: 'Mandarin', label: '中文' },
    { code: 'Japanese', label: '日本語' },
  ];

  const currentLanguage = profile.language || 'English';

  const navItems: Array<{ id: MainNavTab; label: string; icon: React.ReactNode; isBadge?: boolean }> = [
    { id: 'tutor', label: 'AI Tutor', icon: <GraduationCap className="w-3.5 h-3.5" /> },
    { id: 'quiz', label: 'Smart Quiz', icon: <Target className="w-3.5 h-3.5" /> },
    { id: 'adaptive', label: 'Adaptive Engine', icon: <RotateCcw className="w-3.5 h-3.5" /> },
    { id: 'planner', label: 'Study Planner', icon: <Calendar className="w-3.5 h-3.5" /> },
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-3.5 h-3.5" /> },
    { id: 'demo', label: 'Live Demo (DSP)', icon: <Zap className="w-3.5 h-3.5 text-coral-500" />, isBadge: true },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-peach-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-16 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onSelectTab('tutor')}
              className="flex items-center gap-2.5 text-left cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-coral-500 via-coral-400 to-peach-400 flex items-center justify-center text-white shadow-xs shadow-coral-500/20 group-hover:scale-105 transition">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg tracking-tight text-stone-900">
                    Study<span className="text-coral-600">Spark</span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-peach-100 text-coral-700 border border-peach-300">
                    AI Competition Ed.
                  </span>
                </div>
                <p className="text-[11px] text-stone-400 hidden lg:block leading-none">
                  Personalized Adaptive Intelligence
                </p>
              </div>
            </button>
          </div>

          {/* Desktop SaaS Navigation Bar */}
          <nav className="hidden md:flex items-center gap-1 p-1 bg-peach-50/60 rounded-xl border border-peach-200/70">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    isActive
                      ? 'bg-white text-stone-900 shadow-2xs font-bold border border-peach-200/60'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg border border-peach-200 bg-peach-50/40 text-xs">
              <Globe className="w-3.5 h-3.5 text-coral-600" />
              <select
                value={currentLanguage}
                onChange={(e) => onLanguageChange(e.target.value)}
                className="bg-transparent text-xs font-medium text-stone-700 focus:outline-none cursor-pointer pr-1"
                title="Select Explanation Language"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Profile Customizer */}
            <button
              onClick={onOpenSettings}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition"
              title="Personalize Level & Style"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-coral-600" />
              <span className="hidden sm:inline capitalize">
                {profile.role || 'student'}
              </span>
            </button>

            {/* Saved Library */}
            <button
              onClick={onOpenLibrary}
              className="relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white hover:bg-peach-50 text-stone-800 border border-peach-200 text-xs font-semibold transition shadow-2xs"
              title="Saved Topics"
            >
              <Bookmark className="w-3.5 h-3.5 text-coral-600" />
              <span className="hidden sm:inline">Saved</span>
              {savedCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-coral-500 text-white text-[10px] font-bold">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Mastered topics count */}
            {masteredCount > 0 && (
              <div
                className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold"
                title={`${masteredCount} topics mastered`}
              >
                <Award className="w-3.5 h-3.5 text-emerald-600" />
                <span>{masteredCount}</span>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Subnav Strip */}
        <div className="flex md:hidden items-center gap-1 overflow-x-auto py-2 border-t border-peach-100 scrollbar-none">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-coral-500 text-white shadow-2xs'
                    : 'bg-peach-50/70 text-stone-600'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
