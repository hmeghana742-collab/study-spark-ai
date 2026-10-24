import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TopicSearchHero } from './components/TopicSearchHero';
import { LearningCanvas } from './components/LearningCanvas';
import { PersonalizationModal } from './components/PersonalizationModal';
import { SavedTopicsModal } from './components/SavedTopicsModal';
import { RoleQuickSwitcher } from './components/RoleQuickSwitcher';
import { SmartQuizView } from './components/SmartQuizView';
import { AdaptiveEngineView } from './components/AdaptiveEngineView';
import { StudyPlannerView } from './components/StudyPlannerView';
import { ProgressDashboardView } from './components/ProgressDashboardView';
import { LiveDemoExperience } from './components/LiveDemoExperience';
import {
  LearnerProfile,
  LearningModule,
  UserRole,
  MainNavTab,
  QuizSubmission,
  StudyTask,
  AdaptiveRecommendation,
  QuizQuestion,
} from './types';
import { SAMPLE_TOPICS } from './data/sampleTopics';
import { generateUniversalSolution } from './utils/universalSolver';
import { Sparkles, AlertCircle } from 'lucide-react';

const STORAGE_KEY_PROFILE = 'studyspark_profile_v3';
const STORAGE_KEY_SAVED = 'studyspark_saved_v3';
const STORAGE_KEY_MASTERED = 'studyspark_mastered_v3';
const STORAGE_KEY_QUIZ_HISTORY = 'studyspark_quiz_history_v3';
const STORAGE_KEY_STUDY_TASKS = 'studyspark_study_tasks_v3';

export default function App() {
  const [activeTab, setActiveTab] = useState<MainNavTab>('tutor');

  const [profile, setProfile] = useState<LearnerProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // Ignore
    }
    return {
      role: 'student' as UserRole,
      level: 'college',
      style: 'analogy',
      language: 'English',
      interests: 'Digital Signal Processing',
    };
  });

  const [savedModules, setSavedModules] = useState<LearningModule[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SAVED);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // Ignore
    }
    return [
      SAMPLE_TOPICS['dsp-sampling-theorem'] || SAMPLE_TOPICS['quantum-superposition'],
      SAMPLE_TOPICS['how-inflation-works'],
    ];
  });

  const [masteredTopics, setMasteredTopics] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MASTERED);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // Ignore
    }
    return ['Nyquist-Shannon Sampling Theorem & Signal Reconstruction'];
  });

  // Current active learning module
  const [currentModule, setCurrentModule] = useState<LearningModule | null>(() => {
    return SAMPLE_TOPICS['dsp-sampling-theorem'] || SAMPLE_TOPICS['quantum-superposition'];
  });

  // Authentic Quiz History (persisted)
  const [quizHistory, setQuizHistory] = useState<QuizSubmission[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_QUIZ_HISTORY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // Ignore
    }
    return [
      {
        id: 'sub_dsp_demo',
        topic: 'Sampling Theorem',
        score: 4,
        total: 5,
        percentage: 80,
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        answers: { 0: 2, 1: 3, 2: 1, 3: 1, 4: 2 },
        weakConcepts: [
          {
            concept: 'Aliasing & Spectral Folding',
            question: 'If a 12 kHz pure sine wave is sampled at a sampling rate of 20 kHz, what apparent alias frequency will be observed?',
            explanation: 'The Nyquist folding boundary is fs/2 = 10 kHz. Since 12 kHz exceeds 10 kHz, it folds over: |20 - 12| = 8 kHz.',
          },
        ],
      },
    ];
  });

  // Study tasks (persisted)
  const [studyTasks, setStudyTasks] = useState<StudyTask[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STUDY_TASKS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // Ignore
    }
    const examDate = new Date();
    examDate.setDate(examDate.getDate() + 10);
    const dateStr = examDate.toISOString().split('T')[0];

    return [
      {
        id: 'task_1',
        subject: 'Digital Signal Processing (DSP)',
        topic: 'Nyquist-Shannon Sampling Theorem & Aliasing Proof',
        examDate: dateStr,
        scheduledDate: new Date().toISOString().split('T')[0],
        estimatedHours: 2.0,
        difficulty: 'Foundational',
        priority: 'urgent',
        completed: true,
        notes: 'Derive continuous-to-discrete Dirac impulse train and folding frequencies.',
      },
      {
        id: 'task_2',
        subject: 'Digital Signal Processing (DSP)',
        topic: 'Discrete Fourier Transform (DFT) & FFT Butterfly Networks',
        examDate: dateStr,
        scheduledDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
        estimatedHours: 2.5,
        difficulty: 'Challenging',
        priority: 'high',
        completed: false,
        notes: 'Practice Cooley-Tukey decimation-in-time radix-2 algorithms.',
      },
      {
        id: 'task_3',
        subject: 'Digital Signal Processing (DSP)',
        topic: 'Finite Impulse Response (FIR) Windowing Techniques',
        examDate: dateStr,
        scheduledDate: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
        estimatedHours: 2.0,
        difficulty: 'Moderate',
        priority: 'medium',
        completed: false,
        notes: 'Compare Hamming, Hanning, and Blackman spectral leakage trade-offs.',
      },
    ];
  });

  // Adaptive recommendations state
  const [recommendations, setRecommendations] = useState<AdaptiveRecommendation[]>([
    {
      id: 'rec_1',
      topic: 'Spectral Folding & Periodic Frequency Replication',
      reason: 'Triggered because you missed Question 2 on Aliasing in the Sampling Theorem diagnostic.',
      missedConcept: 'Aliasing & Spectral Folding',
      difficulty: 'Targeted Practice',
      priority: 'high',
      actionPrompt: 'Review the frequency-domain Dirac comb convolution formula to visualize why frequencies above fs/2 mirror backwards.',
    },
    {
      id: 'rec_2',
      topic: 'Analog Anti-Aliasing Pre-Filter Architecture',
      reason: 'Recommended to reinforce why transition bands require oversampling guard buffers (e.g. 44.1 kHz for 20 kHz audio).',
      missedConcept: 'Anti-Aliasing Filter Roll-Off',
      difficulty: 'Review',
      priority: 'medium',
      actionPrompt: 'Understand the engineering tradeoff between filter steepness (Butterworth/Chebyshev) and phase distortion.',
    },
  ]);

  const [adaptiveChallenge, setAdaptiveChallenge] = useState<QuizQuestion | undefined>({
    question: 'An analog signal with maximum frequency component of 14 kHz is sampled at 24 kHz. What apparent alias frequency will be observed in the reconstructed output?',
    options: ['14 kHz', '10 kHz (|24 - 14| = 10 kHz)', '24 kHz', '12 kHz'],
    correctIndex: 1,
    explanation: 'Here fs = 24 kHz, so the Nyquist folding frequency is fs/2 = 12 kHz. Since 14 kHz exceeds 12 kHz by 2 kHz, it folds backwards across the boundary: 12 - 2 = 10 kHz (or |fs - f| = |24 - 14| = 10 kHz).',
    conceptTag: 'Aliasing & Spectral Folding',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);
  const [isLoadingPlan, setIsLoadingPlan] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
    } catch (e) {
      // Ignore
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(savedModules));
    } catch (e) {
      // Ignore
    }
  }, [savedModules]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MASTERED, JSON.stringify(masteredTopics));
    } catch (e) {
      // Ignore
    }
  }, [masteredTopics]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_QUIZ_HISTORY, JSON.stringify(quizHistory));
    } catch (e) {
      // Ignore
    }
  }, [quizHistory]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STUDY_TASKS, JSON.stringify(studyTasks));
    } catch (e) {
      // Ignore
    }
  }, [studyTasks]);

  // Handle learning request: Instant solution first, AI enrichment in background
  const handleLearnTopic = async (topic: string, customProfile?: LearnerProfile) => {
    const activeProf = customProfile || profile;
    const cleanTopic = topic.trim();
    if (!cleanTopic) return;

    setError(null);

    // 1. Instant zero-delay solution rendering (0ms)
    const normalizedQuery = cleanTopic.toLowerCase();
    const matchedSample = Object.values(SAMPLE_TOPICS).find(
      (s) =>
        s.topic.toLowerCase() === normalizedQuery ||
        normalizedQuery.includes(s.topic.toLowerCase())
    );

    const instantModule = matchedSample
      ? { ...matchedSample, mastered: masteredTopics.includes(matchedSample.topic) }
      : {
          ...generateUniversalSolution(cleanTopic, activeProf.level, activeProf.style),
          mastered: masteredTopics.includes(cleanTopic),
        };

    // Render immediately
    setCurrentModule(instantModule);
    setIsLoading(false);
    setIsEnhancing(true);

    window.scrollTo({ top: 0, behavior: 'smooth' });

    // 2. Concurrently enrich with Gemini AI in the background
    try {
      const res = await fetch('/api/learn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: cleanTopic,
          userRole: activeProf.role || 'student',
          learnerLevel: activeProf.level,
          learningStyle: activeProf.style,
          userBackground: activeProf.interests,
          language: activeProf.language || 'English',
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          const isTopicMastered = masteredTopics.includes(cleanTopic);
          const enrichedModule: LearningModule = {
            ...json.data,
            mastered: isTopicMastered,
          };

          setCurrentModule(enrichedModule);

          // Update in saved topics if already saved
          setSavedModules((prev) =>
            prev.map((m) =>
              m.topic.toLowerCase() === cleanTopic.toLowerCase() ? enrichedModule : m
            )
          );
        }
      }
    } catch (err: any) {
      console.warn('Background enhancement deferred:', err);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleSelectRole = (newRole: UserRole) => {
    let updatedLevel = profile.level;
    let updatedStyle = profile.style;
    if (newRole === 'professor') {
      updatedLevel = 'college';
      updatedStyle = 'pedagogical_lecture';
    } else if (newRole === 'researcher') {
      updatedLevel = 'grad_phd';
      updatedStyle = 'rigorous_proof';
    } else if (newRole === 'professional') {
      updatedLevel = 'college';
      updatedStyle = 'cheat_sheet';
    } else {
      if (updatedLevel === 'grad_phd') updatedLevel = 'high_school';
      if (updatedStyle === 'pedagogical_lecture' || updatedStyle === 'rigorous_proof') {
        updatedStyle = 'analogy';
      }
    }
    const updated: LearnerProfile = {
      ...profile,
      role: newRole,
      level: updatedLevel,
      style: updatedStyle,
    };
    setProfile(updated);
    if (currentModule) {
      handleLearnTopic(currentModule.topic, updated);
    }
  };

  const handleSaveProfile = (newProfile: LearnerProfile) => {
    setProfile(newProfile);
    if (currentModule) {
      handleLearnTopic(currentModule.topic, newProfile);
    }
  };

  const handleLanguageChange = (lang: string) => {
    const updated = { ...profile, language: lang };
    setProfile(updated);
    if (currentModule) {
      handleLearnTopic(currentModule.topic, updated);
    }
  };

  const handleToggleSaveCurrent = () => {
    if (!currentModule) return;
    const exists = savedModules.some(
      (m) => m.topic.toLowerCase() === currentModule.topic.toLowerCase()
    );

    if (exists) {
      setSavedModules((prev) =>
        prev.filter((m) => m.topic.toLowerCase() !== currentModule.topic.toLowerCase())
      );
    } else {
      setSavedModules((prev) => [
        { ...currentModule, mastered: masteredTopics.includes(currentModule.topic) },
        ...prev,
      ]);
    }
  };

  const handleToggleMasterCurrent = () => {
    if (!currentModule) return;
    const isMastered = masteredTopics.includes(currentModule.topic);
    let nextMastered: string[];

    if (isMastered) {
      nextMastered = masteredTopics.filter((t) => t !== currentModule.topic);
    } else {
      nextMastered = [...masteredTopics, currentModule.topic];
    }
    setMasteredTopics(nextMastered);

    setCurrentModule((prev) => (prev ? { ...prev, mastered: !isMastered } : null));

    setSavedModules((prev) =>
      prev.map((m) =>
        m.topic.toLowerCase() === currentModule.topic.toLowerCase()
          ? { ...m, mastered: !isMastered }
          : m
      )
    );
  };

  // Record a quiz submission and trigger adaptive AI recommendations
  const handleQuizSubmitted = async (submission: QuizSubmission) => {
    setQuizHistory((prev) => [submission, ...prev]);

    // Fetch real adaptive recommendations via backend
    try {
      const res = await fetch('/api/adaptive-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: submission.topic,
          score: submission.score,
          total: submission.total,
          weakConcepts: submission.weakConcepts,
          learnerLevel: profile.level,
          language: profile.language || 'English',
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.recommendations && json.recommendations.length > 0) {
          setRecommendations(json.recommendations);
        }
        if (json.followUpPracticeQuestion) {
          setAdaptiveChallenge(json.followUpPracticeQuestion);
        }
      }
    } catch (e) {
      console.warn('Adaptive recommendation fetch deferred:', e);
    }
  };

  // Generate 5 MCQs on any custom topic
  const handleGenerateNewQuiz = async (topic: string) => {
    setIsLoadingQuiz(true);
    try {
      const res = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          learnerLevel: profile.level,
          language: profile.language || 'English',
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.questions && json.questions.length > 0) {
          if (currentModule) {
            setCurrentModule({
              ...currentModule,
              topic,
              quiz: json.questions,
            });
          }
        }
      } else {
        // Fallback to universal solver quiz questions
        const fallback = generateUniversalSolution(topic, profile.level, profile.style);
        if (currentModule) {
          setCurrentModule({
            ...currentModule,
            topic,
            quiz: fallback.quiz,
          });
        }
      }
    } catch (e) {
      console.warn('Quiz generation deferred:', e);
    } finally {
      setIsLoadingQuiz(false);
    }
  };

  // Study planner handlers
  const handleToggleStudyTask = (taskId: string) => {
    setStudyTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleAddStudyTask = (task: StudyTask) => {
    setStudyTasks((prev) => [task, ...prev]);
  };

  const handleDeleteStudyTask = (taskId: string) => {
    setStudyTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const handleGenerateStudyPlan = async (params: {
    subject: string;
    examDate: string;
    syllabusTopics: string[];
    dailyHours: number;
  }) => {
    setIsLoadingPlan(true);
    try {
      const weakConceptNames = quizHistory.flatMap((q) => q.weakConcepts.map((w) => w.concept));

      const res = await fetch('/api/generate-study-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...params,
          learnerLevel: profile.level,
          weakAreas: weakConceptNames,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.tasks && json.tasks.length > 0) {
          const formattedTasks: StudyTask[] = json.tasks.map((t: any, idx: number) => ({
            id: 'gen_' + Date.now() + '_' + idx,
            subject: t.subject || params.subject,
            topic: t.topic || `Topic ${idx + 1}`,
            examDate: t.examDate || params.examDate,
            scheduledDate: t.scheduledDate || new Date().toISOString().split('T')[0],
            estimatedHours: t.estimatedHours || 2,
            difficulty: t.difficulty || 'Moderate',
            priority: t.priority || 'high',
            completed: false,
            notes: t.notes || '',
          }));

          setStudyTasks(formattedTasks);
        }
      }
    } catch (e) {
      console.warn('Study plan generation deferred:', e);
    } finally {
      setIsLoadingPlan(false);
    }
  };

  const isCurrentSaved =
    !!currentModule &&
    savedModules.some((m) => m.topic.toLowerCase() === currentModule.topic.toLowerCase());

  const isCurrentMastered =
    !!currentModule &&
    (currentModule.mastered || masteredTopics.includes(currentModule.topic));

  return (
    <div className="min-h-screen bg-peach-50/30 flex flex-col font-sans selection:bg-coral-200 selection:text-coral-950">
      {/* Top Header */}
      <Header
        profile={profile}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenLibrary={() => setIsLibraryOpen(true)}
        savedCount={savedModules.length}
        masteredCount={masteredTopics.length}
        onLanguageChange={handleLanguageChange}
      />

      {/* Main Container */}
      <main className="flex-1">
        {/* Error notification banner */}
        {error && (
          <div className="max-w-2xl mx-auto px-4 mt-4">
            <div className="p-3.5 rounded-2xl bg-coral-50 border border-coral-300 text-coral-900 text-xs sm:text-sm flex items-start gap-2.5 shadow-2xs">
              <AlertCircle className="w-5 h-5 text-coral-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{error}</div>
              <button
                onClick={() => setError(null)}
                className="text-coral-800 hover:text-coral-950 font-bold text-xs"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* TAB 1: AI TUTOR */}
        {activeTab === 'tutor' && (
          <div className="animate-fadeIn">
            {/* Role Quick Switcher */}
            <div className="pt-4 max-w-4xl mx-auto px-4">
              <RoleQuickSwitcher
                currentRole={profile.role || 'student'}
                onSelectRole={handleSelectRole}
              />
            </div>

            {/* Search Hero */}
            <TopicSearchHero
              onSearch={(t) => handleLearnTopic(t)}
              isLoading={isLoading}
              currentTopic={currentModule?.topic}
            />

            {/* Canvas Display */}
            {!isLoading && currentModule && (
              <LearningCanvas
                module={currentModule}
                profile={profile}
                isSaved={isCurrentSaved}
                isMastered={isCurrentMastered}
                isEnhancing={isEnhancing}
                onToggleSave={handleToggleSaveCurrent}
                onToggleMaster={handleToggleMasterCurrent}
                onQuizSubmitted={handleQuizSubmitted}
                onNavigateToAdaptive={() => setActiveTab('adaptive')}
              />
            )}
          </div>
        )}

        {/* TAB 2: SMART QUIZ */}
        {activeTab === 'quiz' && (
          <SmartQuizView
            currentTopic={currentModule?.topic || 'Sampling Theorem'}
            quizQuestions={currentModule?.quiz || SAMPLE_TOPICS['dsp-sampling-theorem'].quiz}
            profile={profile}
            onQuizSubmitted={handleQuizSubmitted}
            onNavigateToAdaptive={() => setActiveTab('adaptive')}
            onGenerateNewQuiz={handleGenerateNewQuiz}
            isLoadingQuiz={isLoadingQuiz}
          />
        )}

        {/* TAB 3: ADAPTIVE ENGINE */}
        {activeTab === 'adaptive' && (
          <AdaptiveEngineView
            currentTopic={currentModule?.topic || 'Sampling Theorem'}
            quizHistory={quizHistory}
            recommendations={recommendations}
            followUpQuestion={adaptiveChallenge}
            profile={profile}
            onSelectRevisionTopic={(revTopic) => {
              handleLearnTopic(revTopic);
              setActiveTab('tutor');
            }}
          />
        )}

        {/* TAB 4: STUDY PLANNER */}
        {activeTab === 'planner' && (
          <StudyPlannerView
            tasks={studyTasks}
            onToggleTaskComplete={handleToggleStudyTask}
            onAddTask={handleAddStudyTask}
            onDeleteTask={handleDeleteStudyTask}
            onGeneratePlan={handleGenerateStudyPlan}
            isLoading={isLoadingPlan}
            profile={profile}
          />
        )}

        {/* TAB 5: PROGRESS DASHBOARD */}
        {activeTab === 'dashboard' && (
          <ProgressDashboardView
            quizHistory={quizHistory}
            studyTasks={studyTasks}
            masteredTopics={masteredTopics}
            savedModules={savedModules}
            profile={profile}
            onNavigateToQuiz={() => setActiveTab('quiz')}
            onNavigateToPlanner={() => setActiveTab('planner')}
            onSelectTopic={(t) => {
              handleLearnTopic(t);
              setActiveTab('tutor');
            }}
          />
        )}

        {/* TAB 6: LIVE COMPETITION DEMO (DSP) */}
        {activeTab === 'demo' && (
          <LiveDemoExperience
            onLoadModuleInTutor={(mod) => {
              setCurrentModule(mod);
              setActiveTab('tutor');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToAdaptive={() => setActiveTab('adaptive')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-peach-200/60 bg-white/70 py-6 text-center text-xs text-stone-500 mt-12">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-coral-600" />
            <span className="font-bold text-stone-800">StudySpark AI</span>
            <span>— Personalized Adaptive Intelligence</span>
          </div>
          <div>
            <span>Powered by Gemini 3.8 Flash • Closed-Loop Mastery: Learn → Practice → Evaluate → Improve</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <PersonalizationModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        profile={profile}
        onSaveProfile={handleSaveProfile}
      />

      <SavedTopicsModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        savedModules={savedModules}
        onSelectModule={(mod) => {
          setCurrentModule(mod);
          setActiveTab('tutor');
        }}
        onRemoveModule={(t) =>
          setSavedModules((prev) => prev.filter((m) => m.topic !== t))
        }
        onToggleMastered={(t) => {
          if (masteredTopics.includes(t)) {
            setMasteredTopics((prev) => prev.filter((x) => x !== t));
          } else {
            setMasteredTopics((prev) => [...prev, t]);
          }
        }}
      />
    </div>
  );
}
