import React from 'react';
import { X, Bookmark, Award, Trash2, ArrowRight, Clock, BookOpen } from 'lucide-react';
import { LearningModule } from '../types';

interface SavedTopicsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedModules: LearningModule[];
  onSelectModule: (module: LearningModule) => void;
  onRemoveModule: (topic: string) => void;
  onToggleMastered: (topic: string) => void;
}

export const SavedTopicsModal: React.FC<SavedTopicsModalProps> = ({
  isOpen,
  onClose,
  savedModules,
  onSelectModule,
  onRemoveModule,
  onToggleMastered,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-amber-200/80 w-full max-w-xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 bg-amber-50/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">Your Learning Library</h2>
              <p className="text-xs text-stone-500">
                {savedModules.length} topic{savedModules.length === 1 ? '' : 's'} saved
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {savedModules.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                <BookOpen className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-stone-800 text-sm">No saved topics yet</h4>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Explore any topic in the search bar and click the bookmark button to save it for quick revision!
              </p>
            </div>
          ) : (
            savedModules.map((m) => (
              <div
                key={m.topic}
                className="group p-4 rounded-xl border border-stone-200/90 hover:border-amber-400 bg-white hover:bg-amber-50/30 transition flex flex-col gap-2 shadow-2xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div
                    onClick={() => {
                      onSelectModule(m);
                      onClose();
                    }}
                    className="cursor-pointer flex-1"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-sm text-stone-900 group-hover:text-amber-700 transition">
                        {m.title || m.topic}
                      </h4>
                      {m.mastered && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <Award className="w-3 h-3 text-emerald-600" />
                          Mastered
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                      {m.oneLiner}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => onToggleMastered(m.topic)}
                      className={`p-1.5 rounded-lg border text-xs font-semibold transition ${
                        m.mastered
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-stone-50 border-stone-200 text-stone-500 hover:text-stone-800'
                      }`}
                      title={m.mastered ? 'Mark as Needs Review' : 'Mark as Mastered'}
                    >
                      <Award className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onRemoveModule(m.topic)}
                      className="p-1.5 rounded-lg border border-transparent hover:border-rose-200 text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-[11px] text-stone-400">
                  <span className="capitalize">
                    Level: {m.learnerLevel?.replace('_', ' ')} • Style: {m.learningStyle}
                  </span>
                  <button
                    onClick={() => {
                      onSelectModule(m);
                      onClose();
                    }}
                    className="flex items-center gap-1 font-bold text-amber-600 hover:text-amber-700"
                  >
                    <span>Open Lesson</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between text-xs text-stone-500">
          <span>Saved to your local study session</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-700 font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
