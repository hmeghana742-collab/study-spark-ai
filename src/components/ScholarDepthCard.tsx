import React from 'react';
import { Microscope, Compass, Binary, ArrowUpRight } from 'lucide-react';
import { ScholarDepth } from '../types';

interface ScholarDepthCardProps {
  scholarDepth: ScholarDepth;
  topicTitle: string;
}

export const ScholarDepthCard: React.FC<ScholarDepthCardProps> = ({ scholarDepth, topicTitle }) => {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-stone-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-400/30 flex items-center justify-center font-bold">
            <Microscope className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Scholar & Researcher Depth
              </span>
              <span className="text-xs text-slate-400">Advanced Rigor</span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-white">
              Theoretical Framework & Research Frontiers
            </h3>
          </div>
        </div>
      </div>

      {/* Theoretical Framework */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
          <Compass className="w-4 h-4" />
          Axiomatic Theoretical Framework
        </h4>
        <p className="text-sm text-slate-300 leading-relaxed font-normal bg-slate-800/60 p-4 rounded-2xl border border-slate-700/80">
          {scholarDepth.theoreticalFramework}
        </p>
      </div>

      {/* Formal Derivation if available */}
      {scholarDepth.formalDerivation && (
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <Binary className="w-4 h-4" />
            Formal Mathematical / System Derivation
          </h4>
          <div className="text-xs sm:text-sm font-mono text-emerald-300 bg-black/60 p-4 rounded-2xl border border-emerald-500/30 overflow-x-auto">
            {scholarDepth.formalDerivation}
          </div>
        </div>
      )}

      {/* Open Research Frontiers */}
      {scholarDepth.researchFrontiers && scholarDepth.researchFrontiers.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <ArrowUpRight className="w-4 h-4" />
            Open Research Frontiers & Active Inquiries
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {scholarDepth.researchFrontiers.map((front, idx) => (
              <div
                key={idx}
                className="bg-slate-800/70 p-3.5 rounded-xl border border-slate-700 text-xs text-slate-300 leading-relaxed flex flex-col justify-between"
              >
                <span>{front}</span>
                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider mt-2">
                  Frontier 0{idx + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
