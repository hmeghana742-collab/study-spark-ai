import React, { useState } from 'react';
import { X, Check, Sparkles, User, Lightbulb, Compass, Heart, GraduationCap, Microscope, Briefcase } from 'lucide-react';
import { LearnerLevel, LearningStyle, LearnerProfile, UserRole } from '../types';

interface PersonalizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: LearnerProfile;
  onSaveProfile: (profile: LearnerProfile) => void;
}

const ROLES: Array<{
  id: UserRole;
  title: string;
  icon: string;
  tagline: string;
  description: string;
}> = [
  {
    id: 'student',
    title: 'Student / Learner',
    icon: '🎒',
    tagline: 'Step-by-step intuition, practice & flashcards',
    description: 'Tailored for exam prep, homework problems, and visual concept mastery.',
  },
  {
    id: 'professor',
    title: 'Professor / Educator',
    icon: '👨‍🏫',
    tagline: 'Lecture plans, Socratic prompts & rubrics',
    description: 'Designed for educators creating 45-min lesson timelines, discussions, and grading rubrics.',
  },
  {
    id: 'researcher',
    title: 'Scholar / Researcher',
    icon: '🔬',
    tagline: 'Axiomatic theory, formal proofs & research frontiers',
    description: 'Deep mathematical formulations, academic literature frameworks, and edge inquiries.',
  },
  {
    id: 'professional',
    title: 'Professional / Adult Learner',
    icon: '💼',
    tagline: 'Pragmatic executive summary & industry workflows',
    description: 'Focuses on direct utility, trade-offs, and workplace application.',
  },
];

const LEVELS: Array<{
  id: LearnerLevel;
  title: string;
  emoji: string;
  tagline: string;
  description: string;
}> = [
  {
    id: 'eli5',
    title: 'Explain Like I’m 10 (ELI10)',
    emoji: '🧒',
    tagline: 'Simple words, fun analogies, zero jargon',
    description: 'Perfect when a concept is brand new or you want the cleanest intuitive picture.',
  },
  {
    id: 'middle_school',
    title: 'Middle School (Ages 11-14)',
    emoji: '🎒',
    tagline: 'Engaging, everyday science & curious hooks',
    description: 'Explores how things work with relatable real-world mechanics and visual comparisons.',
  },
  {
    id: 'high_school',
    title: 'High School (Ages 15-18)',
    emoji: '🎓',
    tagline: 'Core concepts, exam-ready logic & foundations',
    description: 'Balanced depth: formal definitions paired with crystal-clear practical examples.',
  },
  {
    id: 'college',
    title: 'College / Undergrad',
    emoji: '🏛️',
    tagline: 'Rigorous, mechanistic depth & domain nuance',
    description: 'Explores underlying formulas, algorithmic steps, and industry/scientific context.',
  },
  {
    id: 'curious_adult',
    title: 'Curious Adult / Professional',
    emoji: '💡',
    tagline: 'First-principles, pragmatic & zero fluff',
    description: 'Direct, thoughtful explanations focused on why it matters and how to apply it in life/work.',
  },
  {
    id: 'grad_phd',
    title: 'Graduate / PhD Researcher',
    emoji: '🔬',
    tagline: 'Axiomatic rigor, theoretical derivations & proofs',
    description: 'Formal mathematical and philosophical foundations for advanced scholars.',
  },
];

const STYLES: Array<{
  id: LearningStyle;
  title: string;
  icon: string;
  description: string;
}> = [
  {
    id: 'analogy',
    title: 'Real-World Analogy First',
    icon: '🧩',
    description: 'Grounds abstract theories into vivid everyday situations (cooking, traffic, games, nature).',
  },
  {
    id: 'step_by_step',
    title: 'Step-by-Step Breakdown',
    icon: '🪜',
    description: 'Logical cause-and-effect progression broken into bite-sized numbered milestones.',
  },
  {
    id: 'pedagogical_lecture',
    title: 'Pedagogical Lecture & Lesson Plan',
    icon: '📋',
    description: 'Includes 45-min lesson timeline, in-class activities, and Bloom’s taxonomy objectives.',
  },
  {
    id: 'socratic',
    title: 'Socratic Coach',
    icon: '❓',
    description: 'Interactive thinking prompts, thought experiments, and guided self-discovery.',
  },
  {
    id: 'cheat_sheet',
    title: 'Cheat Sheet & Mental Models',
    icon: '⚡',
    description: 'High-yield summaries, key formulas, bullet lists, and quick-reference golden rules.',
  },
  {
    id: 'rigorous_proof',
    title: 'Formal Academic Proof',
    icon: '📐',
    description: 'Step-by-step mathematical proof, axiomatic definitions, and phase-space constraints.',
  },
];

export const PersonalizationModal: React.FC<PersonalizationModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
}) => {
  const [role, setRole] = useState<UserRole>(profile.role || 'student');
  const [level, setLevel] = useState<LearnerLevel>(profile.level);
  const [style, setStyle] = useState<LearningStyle>(profile.style);
  const [interests, setInterests] = useState(profile.interests);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveProfile({ role, level, style, interests });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-amber-200/80 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-stone-200 bg-gradient-to-r from-amber-50 to-orange-50/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900">Personalize Your AI Assistant</h2>
              <p className="text-xs text-stone-600">
                StudySpark adapts explanations, pacing, and educator toolkits for students, professors, and researchers.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-white/80 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Section 0: Role Selection */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2.5 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-amber-600" />
              1. What is your role?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {ROLES.map((item) => {
                const isSelected = role === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setRole(item.id);
                      if (item.id === 'professor') {
                        setLevel('college');
                        setStyle('pedagogical_lecture');
                      } else if (item.id === 'researcher') {
                        setLevel('grad_phd');
                        setStyle('rigorous_proof');
                      }
                    }}
                    className={`text-left p-3 rounded-xl border transition relative flex items-start gap-3 ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-500/40 text-stone-900'
                        : 'border-stone-200 hover:border-stone-300 bg-stone-50/50 hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <span className="text-2xl select-none pt-0.5">{item.icon}</span>
                    <div className="flex-1 pr-4">
                      <div className="font-semibold text-sm">{item.title}</div>
                      <div className="text-[11px] text-stone-500 font-medium">{item.tagline}</div>
                    </div>
                    {isSelected && (
                      <div className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 1: Learner Level */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-600" />
              2. Target Educational Level
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {LEVELS.map((item) => {
                const isSelected = level === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setLevel(item.id)}
                    className={`text-left p-3 rounded-xl border transition relative flex items-start gap-3 ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/70 ring-1 ring-amber-500/40 text-stone-900'
                        : 'border-stone-200 hover:border-stone-300 bg-stone-50/50 hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <span className="text-2xl select-none pt-0.5">{item.emoji}</span>
                    <div className="flex-1 pr-4">
                      <div className="font-semibold text-sm">{item.title}</div>
                      <div className="text-[11px] text-stone-500 font-medium">{item.tagline}</div>
                    </div>
                    {isSelected && (
                      <div className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Learning Style */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2.5 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
              3. Delivery & Presentation Style
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {STYLES.map((item) => {
                const isSelected = style === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setStyle(item.id)}
                    className={`text-left p-3 rounded-xl border transition relative flex items-start gap-3 ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/70 ring-1 ring-amber-500/40 text-stone-900'
                        : 'border-stone-200 hover:border-stone-300 bg-stone-50/50 hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <span className="text-xl select-none pt-0.5">{item.icon}</span>
                    <div className="flex-1 pr-4">
                      <div className="font-semibold text-sm">{item.title}</div>
                      <div className="text-[11px] text-stone-500 leading-snug">{item.description}</div>
                    </div>
                    {isSelected && (
                      <div className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Interests & Hobbies (Custom Metaphors) */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              4. Specific Focus or Course Context (Optional)
            </label>
            <p className="text-xs text-stone-500 mb-2">
              Add course codes (e.g. "AP Physics C", "CS 101", "Intro Economics") or student interests to tailor examples.
            </p>
            <input
              type="text"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="e.g. AP Bio, Engineering, Gaming, Sports, Pre-Med"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-sm transition"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          <button
            onClick={() => {
              setRole('student');
              setLevel('high_school');
              setStyle('analogy');
              setInterests('');
            }}
            className="text-xs text-stone-500 hover:text-stone-800 underline font-medium"
          >
            Reset to Defaults
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-200/70 text-sm font-semibold transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm shadow-md shadow-amber-500/25 transition"
            >
              Apply Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
