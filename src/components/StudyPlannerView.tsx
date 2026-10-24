import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Sparkles,
  RefreshCw,
  BookOpen,
  CalendarCheck,
  CheckSquare,
  Square,
  Flame,
} from 'lucide-react';
import { StudyTask, LearnerProfile } from '../types';

interface StudyPlannerViewProps {
  tasks: StudyTask[];
  onToggleTaskComplete: (taskId: string) => void;
  onAddTask: (task: StudyTask) => void;
  onDeleteTask: (taskId: string) => void;
  onGeneratePlan: (params: {
    subject: string;
    examDate: string;
    syllabusTopics: string[];
    dailyHours: number;
  }) => Promise<void>;
  isLoading?: boolean;
  profile: LearnerProfile;
}

export const StudyPlannerView: React.FC<StudyPlannerViewProps> = ({
  tasks,
  onToggleTaskComplete,
  onAddTask,
  onDeleteTask,
  onGeneratePlan,
  isLoading = false,
  profile,
}) => {
  // Form state
  const [subject, setSubject] = useState('');
  const [examDate, setExamDate] = useState(() => {
    // Default to 14 days from today
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [syllabusInput, setSyllabusInput] = useState('');
  const [dailyHours, setDailyHours] = useState(2);
  const [showAddModal, setShowAddModal] = useState(false);

  // Manual custom task state
  const [customTopic, setCustomTopic] = useState('');
  const [customHours, setCustomHours] = useState(1.5);
  const [customPriority, setCustomPriority] = useState<'urgent' | 'high' | 'medium'>('high');

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;
  const totalPlannedHours = tasks.reduce((sum, t) => sum + (t.estimatedHours || 1.5), 0);
  const completedHours = tasks
    .filter((t) => t.completed)
    .reduce((sum, t) => sum + (t.estimatedHours || 1.5), 0);

  // Earliest exam date
  const upcomingExamDates = tasks
    .map((t) => t.examDate)
    .filter(Boolean)
    .sort();
  const nextExamDate = upcomingExamDates[0];

  const getDaysUntilExam = (targetDateStr?: string) => {
    if (!targetDateStr) return null;
    const target = new Date(targetDateStr);
    const now = new Date();
    const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const daysLeft = getDaysUntilExam(nextExamDate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !examDate || isLoading) return;

    const topics = syllabusInput
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    onGeneratePlan({
      subject: subject.trim(),
      examDate,
      syllabusTopics: topics.length > 0 ? topics : [subject.trim()],
      dailyHours,
    });
  };

  const handleCreateCustomTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTopic.trim()) return;

    const newTask: StudyTask = {
      id: 'task_' + Date.now(),
      subject: subject || 'General Study',
      topic: customTopic.trim(),
      examDate: examDate || '',
      scheduledDate: new Date().toISOString().split('T')[0],
      estimatedHours: customHours,
      difficulty: 'Moderate',
      priority: customPriority,
      completed: false,
      notes: 'Custom manual milestone added by student.',
    };

    onAddTask(newTask);
    setCustomTopic('');
    setShowAddModal(false);
  };

  const loadDspTemplate = () => {
    setSubject('Digital Signal Processing (DSP)');
    setExamDate(() => {
      const d = new Date();
      d.setDate(d.getDate() + 10);
      return d.toISOString().split('T')[0];
    });
    setSyllabusInput(
      'Nyquist-Shannon Sampling Theorem & Aliasing\nDiscrete Fourier Transform (DFT) & FFT Algorithms\nZ-Transform & Region of Convergence (ROC)\nFinite Impulse Response (FIR) Filter Design\nInfinite Impulse Response (IIR) Chebyshev & Butterworth Filters'
    );
    setDailyHours(2.5);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Planner Header */}
      <div className="bg-white rounded-2xl p-6 border border-peach-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-coral-600 uppercase tracking-wider">
              <Calendar className="w-4 h-4" />
              <span>Smart Exam & Syllabus Scheduler</span>
            </div>
            <h2 className="text-2xl font-bold text-stone-900 mt-1">
              Personalized Study Planner
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Input your syllabus and exam dates. Gemini AI optimizes your review schedule prioritizing difficult topics first.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadDspTemplate}
              className="px-3.5 py-2 text-xs font-semibold text-coral-700 bg-peach-50 hover:bg-peach-100 border border-peach-200 rounded-xl transition flex items-center gap-1.5 shrink-0"
              title="Auto-fill with Digital Signal Processing sample"
            >
              <Sparkles className="w-3.5 h-3.5 text-coral-600" />
              <span>Load DSP Exam Template</span>
            </button>
          </div>
        </div>

        {/* Progress & Countdown Bar */}
        {tasks.length > 0 && (
          <div className="pt-4 border-t border-peach-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-peach-50/50 border border-peach-200/60">
              <span className="text-[10px] font-bold text-coral-600 uppercase tracking-wider">Tasks Completed</span>
              <div className="text-xl font-black text-stone-900 mt-0.5">
                {completedCount} / {tasks.length}
                <span className="text-xs font-semibold text-stone-500 ml-1.5">({progressPercent}%)</span>
              </div>
              <div className="w-full h-1.5 bg-peach-200 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-coral-500 rounded-full transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-peach-50/50 border border-peach-200/60">
              <span className="text-[10px] font-bold text-coral-600 uppercase tracking-wider">Planned Study Time</span>
              <div className="text-xl font-black text-stone-900 mt-0.5">
                {completedHours.toFixed(1)} / {totalPlannedHours.toFixed(1)} hrs
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                {(totalPlannedHours - completedHours).toFixed(1)} hrs remaining to review
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-coral-50/60 border border-coral-200">
              <span className="text-[10px] font-bold text-coral-700 uppercase tracking-wider flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" /> Next Examination
              </span>
              <div className="text-xl font-black text-coral-950 mt-0.5">
                {daysLeft !== null ? (
                  daysLeft > 0 ? (
                    `${daysLeft} Days Left`
                  ) : daysLeft === 0 ? (
                    'Exam Today!'
                  ) : (
                    'Completed'
                  )
                ) : (
                  'Date Pending'
                )}
              </div>
              <p className="text-[11px] text-coral-800/80 mt-1">
                {nextExamDate ? `Target: ${nextExamDate}` : 'Set upcoming date'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Generation Form */}
      <div className="bg-white rounded-2xl p-6 border border-peach-200/80 shadow-xs space-y-4">
        <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
          <CalendarCheck className="w-4 h-4 text-coral-600" />
          <span>Generate or Refresh Schedule</span>
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-stone-700">Subject / Course Name</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Digital Signal Processing (DSP) or Operating Systems"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-peach-200 bg-peach-50/20 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-coral-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700">Exam Date</label>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-peach-200 bg-peach-50/20 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-coral-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-stone-700">
                Syllabus Topics (One per line or comma-separated)
              </label>
              <textarea
                value={syllabusInput}
                onChange={(e) => setSyllabusInput(e.target.value)}
                placeholder="Sampling Theorem & Aliasing&#10;Discrete Fourier Transform (DFT)&#10;FIR Filter Design&#10;IIR Filter Design"
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-xl border border-peach-200 bg-peach-50/20 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-coral-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700">Daily Study Hours</label>
              <select
                value={dailyHours}
                onChange={(e) => setDailyHours(parseFloat(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-peach-200 bg-peach-50/20 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-coral-400"
              >
                <option value={1}>1.0 Hour / Day (Light)</option>
                <option value={1.5}>1.5 Hours / Day</option>
                <option value={2}>2.0 Hours / Day (Recommended)</option>
                <option value={3}>3.0 Hours / Day (Intensive)</option>
                <option value={4}>4.0 Hours / Day (Sprint)</option>
              </select>

              <button
                type="submit"
                disabled={isLoading || !subject.trim()}
                className="w-full mt-3 px-4 py-2.5 bg-coral-500 hover:bg-coral-600 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>Generate Plan with Gemini</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Task Milestones List */}
      <div className="bg-white rounded-2xl p-6 border border-peach-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-coral-600" />
            <h3 className="font-bold text-base text-stone-900">
              Scheduled Study Tasks ({tasks.length})
            </h3>
          </div>

          <button
            onClick={() => setShowAddModal(!showAddModal)}
            className="text-xs font-semibold text-coral-600 hover:text-coral-800 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Custom Task</span>
          </button>
        </div>

        {/* Add custom task inline form */}
        {showAddModal && (
          <form
            onSubmit={handleCreateCustomTask}
            className="p-4 rounded-xl border border-peach-300 bg-peach-50/40 space-y-3"
          >
            <h4 className="font-bold text-xs text-stone-900">Add Manual Study Milestone</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Topic or task description..."
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                required
                className="sm:col-span-2 px-3 py-2 rounded-lg border border-peach-200 text-xs bg-white"
              />
              <div className="flex gap-2">
                <select
                  value={customPriority}
                  onChange={(e) => setCustomPriority(e.target.value as any)}
                  className="px-2 py-2 rounded-lg border border-peach-200 text-xs bg-white flex-1"
                >
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                </select>
                <button
                  type="submit"
                  className="px-3 py-2 bg-coral-500 hover:bg-coral-600 text-white rounded-lg text-xs font-bold"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        )}

        {tasks.length > 0 ? (
          <div className="space-y-2.5">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                  task.completed
                    ? 'bg-stone-50 border-stone-200 opacity-60'
                    : 'bg-white hover:border-peach-400 border-peach-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => onToggleTaskComplete(task.id)}
                    className="mt-0.5 text-stone-400 hover:text-coral-600 transition"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Square className="w-5 h-5 text-stone-300 hover:text-coral-500" />
                    )}
                  </button>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-semibold text-xs sm:text-sm ${
                          task.completed ? 'line-through text-stone-500' : 'text-stone-900'
                        }`}
                      >
                        {task.topic}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          task.priority === 'urgent'
                            ? 'bg-rose-100 text-rose-800'
                            : task.priority === 'high'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {task.priority}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500">
                      <span>Course: {task.subject}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {task.estimatedHours} hrs
                      </span>
                      {task.scheduledDate && (
                        <>
                          <span>·</span>
                          <span>Target: {task.scheduledDate}</span>
                        </>
                      )}
                      {task.difficulty && (
                        <>
                          <span>·</span>
                          <span className="text-stone-400">{task.difficulty}</span>
                        </>
                      )}
                    </div>

                    {task.notes && (
                      <p className="text-[11px] text-stone-500 pt-1 leading-snug">
                        {task.notes}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => onDeleteTask(task.id)}
                  className="text-stone-300 hover:text-rose-500 p-1 rounded transition shrink-0"
                  title="Delete task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-peach-100 text-coral-600 mx-auto flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-stone-900">No Study Schedule Generated Yet</h4>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Click &quot;Load DSP Exam Template&quot; above or enter your upcoming exam date to have Gemini AI construct a realistic study roadmap.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
