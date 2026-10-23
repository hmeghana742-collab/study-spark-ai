import React from 'react';
import { GraduationCap, BookOpen, Microscope, Briefcase } from 'lucide-react';
import { UserRole } from '../types';

interface RoleQuickSwitcherProps {
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
}

export const RoleQuickSwitcher: React.FC<RoleQuickSwitcherProps> = ({
  currentRole,
  onSelectRole,
}) => {
  const roles: Array<{
    id: UserRole;
    label: string;
    sublabel: string;
    icon: React.ReactNode;
    color: string;
    activeBorder: string;
  }> = [
    {
      id: 'student',
      label: 'Student / Learner',
      sublabel: 'Study, Intuition & Practice',
      icon: <BookOpen className="w-4 h-4" />,
      color: 'hover:bg-amber-50 text-amber-900',
      activeBorder: 'bg-amber-500 text-white shadow-amber-500/25',
    },
    {
      id: 'professor',
      label: 'Professor / Educator',
      sublabel: 'Lecture Plans, Prompts & Rubrics',
      icon: <GraduationCap className="w-4 h-4" />,
      color: 'hover:bg-indigo-50 text-indigo-900',
      activeBorder: 'bg-indigo-600 text-white shadow-indigo-600/25',
    },
    {
      id: 'researcher',
      label: 'Scholar / Researcher',
      sublabel: 'Theories, Proofs & Frontiers',
      icon: <Microscope className="w-4 h-4" />,
      color: 'hover:bg-slate-100 text-slate-900',
      activeBorder: 'bg-slate-900 text-white shadow-slate-900/25',
    },
    {
      id: 'professional',
      label: 'Professional',
      sublabel: 'Executive Briefs & Applied Work',
      icon: <Briefcase className="w-4 h-4" />,
      color: 'hover:bg-emerald-50 text-emerald-900',
      activeBorder: 'bg-emerald-700 text-white shadow-emerald-700/25',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 mb-4">
      <div className="bg-white/80 backdrop-blur-sm p-1.5 rounded-2xl border border-stone-200 shadow-xs flex flex-wrap sm:flex-nowrap items-center justify-between gap-1.5">
        {roles.map((r) => {
          const isActive = currentRole === r.id;
          return (
            <button
              key={r.id}
              onClick={() => onSelectRole(r.id)}
              className={`flex-1 py-2 px-3 rounded-xl text-left transition-all flex items-center gap-2.5 ${
                isActive
                  ? `${r.activeBorder} shadow-sm font-bold`
                  : 'hover:bg-stone-100/70 text-stone-600 font-medium'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  isActive ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-500'
                }`}
              >
                {r.icon}
              </div>
              <div className="min-w-0 pr-1">
                <div className="text-xs font-bold leading-tight truncate">{r.label}</div>
                <div
                  className={`text-[10px] leading-tight truncate hidden md:block ${
                    isActive ? 'text-white/80' : 'text-stone-400'
                  }`}
                >
                  {r.sublabel}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
