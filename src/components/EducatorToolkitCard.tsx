import React, { useState } from 'react';
import {
  GraduationCap,
  Clock,
  Target,
  Users,
  Award,
  HelpCircle,
  Copy,
  Printer,
  Check,
  ChevronDown,
  ChevronUp,
  FileText,
  Sparkles,
} from 'lucide-react';
import { EducatorKit } from '../types';

interface EducatorToolkitCardProps {
  educatorKit: EducatorKit;
  topicTitle: string;
}

export const EducatorToolkitCard: React.FC<EducatorToolkitCardProps> = ({
  educatorKit,
  topicTitle,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'plan' | 'discussion' | 'activity' | 'rubric'>('plan');

  const handleCopyHandout = () => {
    const text = `📋 LECTURE & LESSON PLAN: ${topicTitle}

🎯 LEARNING OBJECTIVES:
${educatorKit.learningObjectives.map((obj, i) => `${i + 1}. ${obj}`).join('\n')}

⏱️ LECTURE TIMELINE & PACING (45-MIN PLAN):
${educatorKit.lectureOutline.map((item) => `• [${item.timeMinutes}] ${item.activity}: ${item.keyPoints}`).join('\n')}

🗣️ SOCRATIC DISCUSSION QUESTIONS:
${educatorKit.discussionPrompts.map((p, i) => `Q${i + 1}: ${p.question}\nTarget Insight: ${p.targetInsight}`).join('\n\n')}

👥 IN-CLASS COLLABORATIVE ACTIVITY:
${educatorKit.classroomActivity.title}
Instructions: ${educatorKit.classroomActivity.instructions}
Deliverable: ${educatorKit.classroomActivity.deliverable}

📝 ASSESSMENT & GRADING RUBRIC:
${educatorKit.examRubric.map((r) => `• ${r.criteria} (${r.points}): ${r.guidance}`).join('\n')}
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50/70 via-white to-blue-50/50 rounded-3xl p-6 sm:p-8 border-2 border-indigo-200/90 shadow-md space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-500/20">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 border border-indigo-200">
                Professor & Educator Toolkit
              </span>
              <span className="text-xs text-stone-400 font-medium">Classroom Ready</span>
            </div>
            <h3 className="text-xl font-extrabold text-stone-900">
              Lecture Plan, Socratic Prompts & Assessment Rubric
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyHandout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-stone-50 border border-indigo-200 text-indigo-950 text-xs font-bold transition shadow-2xs"
            title="Copy complete lecture plan & student worksheet"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-indigo-600" />}
            <span>{copied ? 'Copied Handout!' : 'Copy Lesson Plan'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-indigo-100/80 pb-3">
        <button
          onClick={() => setActiveTab('plan')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'plan'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white hover:bg-indigo-50 text-stone-700 border border-indigo-100'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>45-Min Lecture Timeline</span>
        </button>

        <button
          onClick={() => setActiveTab('discussion')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'discussion'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white hover:bg-indigo-50 text-stone-700 border border-indigo-100'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Socratic Prompts</span>
        </button>

        <button
          onClick={() => setActiveTab('activity')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'activity'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white hover:bg-indigo-50 text-stone-700 border border-indigo-100'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Classroom Activity</span>
        </button>

        <button
          onClick={() => setActiveTab('rubric')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'rubric'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white hover:bg-indigo-50 text-stone-700 border border-indigo-100'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Grading Rubric</span>
        </button>
      </div>

      {/* Learning Objectives Always Visible at Top */}
      <div className="bg-white/80 p-4 rounded-2xl border border-indigo-100 shadow-2xs space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-700">
          <Target className="w-4 h-4 text-indigo-600" />
          <span>Curriculum Learning Objectives (Bloom's Taxonomy)</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-700 font-medium">
          {educatorKit.learningObjectives.map((obj, idx) => (
            <div key={idx} className="flex items-start gap-2 bg-indigo-50/50 p-2.5 rounded-xl border border-indigo-100/60">
              <span className="w-4 h-4 rounded-full bg-indigo-200 text-indigo-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span>{obj}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tab 1: Lecture Outline & Pacing */}
      {activeTab === 'plan' && (
        <div className="space-y-3 animate-in fade-in duration-200">
          <div className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Suggested 45-Minute Lesson Pacing
          </div>
          <div className="space-y-2.5">
            {educatorKit.lectureOutline.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-white border border-indigo-100/90 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold px-2 py-1 rounded-lg bg-indigo-100 text-indigo-800 shrink-0">
                    {item.timeMinutes}
                  </span>
                  <div>
                    <h5 className="font-bold text-sm text-stone-900">{item.activity}</h5>
                    <p className="text-xs text-stone-600 leading-snug">{item.keyPoints}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Socratic Discussion Prompts */}
      {activeTab === 'discussion' && (
        <div className="space-y-3 animate-in fade-in duration-200">
          <div className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Socratic Prompts to Spark In-Class Debate
          </div>
          <div className="space-y-3">
            {educatorKit.discussionPrompts.map((p, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-white border border-indigo-100 shadow-2xs space-y-2"
              >
                <div className="flex items-start gap-2 font-bold text-sm text-stone-900">
                  <span className="text-indigo-600 shrink-0">Q{idx + 1}:</span>
                  <span>{p.question}</span>
                </div>
                <div className="text-xs bg-indigo-50/70 p-2.5 rounded-lg border border-indigo-100 text-indigo-900">
                  <span className="font-bold">Target Insight: </span>
                  <span>{p.targetInsight}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Classroom Activity */}
      {activeTab === 'activity' && (
        <div className="space-y-3 animate-in fade-in duration-200">
          <div className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Hands-on Classroom Exercise
          </div>
          <div className="bg-white p-5 rounded-2xl border border-indigo-100 shadow-2xs space-y-3">
            <h4 className="font-extrabold text-base text-indigo-950 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              {educatorKit.classroomActivity.title}
            </h4>
            <div className="space-y-1.5 text-xs text-stone-700">
              <span className="font-bold text-stone-900 block">Instructions for Students:</span>
              <p className="leading-relaxed bg-stone-50 p-3 rounded-xl border border-stone-200">
                {educatorKit.classroomActivity.instructions}
              </p>
            </div>
            <div className="pt-2 border-t border-indigo-100 text-xs text-indigo-900 font-semibold">
              <span className="font-bold">Expected Student Deliverable: </span>
              <span>{educatorKit.classroomActivity.deliverable}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Grading Rubric */}
      {activeTab === 'rubric' && (
        <div className="space-y-3 animate-in fade-in duration-200">
          <div className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Assessment & Scoring Rubric
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {educatorKit.examRubric.map((r, idx) => (
              <div
                key={idx}
                className="bg-white p-4 rounded-xl border border-indigo-100 shadow-2xs flex flex-col justify-between space-y-2"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="font-bold text-xs text-stone-900">{r.criteria}</h5>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                      {r.points}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 leading-snug">{r.guidance}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
