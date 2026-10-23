import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TopicSearchHero } from './components/TopicSearchHero';
import { LearningCanvas } from './components/LearningCanvas';
import { PersonalizationModal } from './components/PersonalizationModal';
import { SavedTopicsModal } from './components/SavedTopicsModal';
import { LearnerProfile, LearningModule, UserRole } from './types';
import { SAMPLE_TOPICS } from './data/sampleTopics';
import { generateUniversalSolution } from './utils/universalSolver';
import { RoleQuickSwitcher } from './components/RoleQuickSwitcher';
import { Sparkles, AlertCircle, RefreshCw, BookOpen, Layers } from 'lucide-react';

const STORAGE_KEY_PROFILE = 'studyspark_profile_v2';
const STORAGE_KEY_SAVED = 'studyspark_saved_v2';
const STORAGE_KEY_MASTERED = 'studyspark_mastered_v2';

export default function App() {
  const [profile, setProfile] = useState<LearnerProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // Ignore
    }
    return {
      role: 'student' as UserRole,
      level: 'high_school',
      style: 'analogy',
      interests: '',
    };
  });

  const [savedModules, setSavedModules] = useState<LearningModule[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SAVED);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // Ignore
    }
    return [SAMPLE_TOPICS['quantum-superposition'], SAMPLE_TOPICS['how-inflation-works']];
  });

  const [masteredTopics, setMasteredTopics] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MASTERED);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // Ignore
    }
    return ['How Inflation Works'];
  });

  // Current active learning module
  const [currentModule, setCurrentModule] = useState<LearningModule | null>(() => {
    return SAMPLE_TOPICS['quantum-superposition'];
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);

  // Sync profile to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
    } catch (e) {
      // Ignore
    }
  }, [profile]);

  // Sync saved to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(savedModules));
    } catch (e) {
      // Ignore
    }
  }, [savedModules]);

  // Sync mastered to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MASTERED, JSON.stringify(masteredTopics));
    } catch (e) {
      // Ignore
    }
  }, [masteredTopics]);

  const [isEnhancing, setIsEnhancing] = useState(false);

  // Handle learning request: Instant solution first, AI enrichment in background
  const handleLearnTopic = async (topic: string, customProfile?: LearnerProfile) => {
    const activeProf = customProfile || profile;
    const cleanTopic = topic.trim();
    if (!cleanTopic) return;

    setError(null);

    // 1. INSTANT ZERO-DELAY SOLUTION RENDERING (0ms)
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

    // Render immediately!
    setCurrentModule(instantModule);
    setIsLoading(false);
    setIsEnhancing(true);

    // Smooth scroll to top
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

          // Update saved topics if already saved
          setSavedModules((prev) =>
            prev.map((m) => (m.topic.toLowerCase() === cleanTopic.toLowerCase() ? enrichedModule : m))
          );
        }
      }
    } catch (err: any) {
      // Instant solution is already actively displaying, no disruption
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
    // If a module is currently displayed, offer to re-explain it with the new profile!
    if (currentModule) {
      handleLearnTopic(currentModule.topic, newProfile);
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

    // Update current module view
    setCurrentModule((prev) => (prev ? { ...prev, mastered: !isMastered } : null));

    // Update in saved list
    setSavedModules((prev) =>
      prev.map((m) =>
        m.topic.toLowerCase() === currentModule.topic.toLowerCase()
          ? { ...m, mastered: !isMastered }
          : m
      )
    );
  };

  const isCurrentSaved = !!currentModule && savedModules.some(
    (m) => m.topic.toLowerCase() === currentModule.topic.toLowerCase()
  );

  const isCurrentMastered = !!currentModule && (currentModule.mastered || masteredTopics.includes(currentModule.topic));

  return (
    <div className="min-h-screen bg-stone-50/50 flex flex-col font-sans selection:bg-amber-200 selection:text-amber-900">
      {/* Top Header */}
      <Header
        profile={profile}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenLibrary={() => setIsLibraryOpen(true)}
        savedCount={savedModules.length}
        masteredCount={masteredTopics.length}
      />

      {/* Main Container */}
      <main className="flex-1">
        {/* Role Quick Switcher for Instant Adaptive View */}
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

        {/* Error notification banner */}
        {error && (
          <div className="max-w-2xl mx-auto px-4 mb-6">
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs sm:text-sm flex items-start gap-2.5 shadow-2xs">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{error}</div>
              <button
                onClick={() => setError(null)}
                className="text-amber-800 hover:text-amber-950 font-bold text-xs"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Loading Skeleton Indicator */}
        {isLoading && (
          <div className="max-w-4xl mx-auto px-4 py-12 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/30 animate-bounce">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="font-extrabold text-xl text-stone-900">
              StudySpark is crafting your personalized lesson...
            </h3>
            <p className="text-stone-500 text-sm max-w-md mx-auto">
              Translating complex theory into intuitive analogies, everyday examples, and active-recall flashcards.
            </p>
            <div className="w-48 h-1.5 mx-auto bg-stone-200 rounded-full overflow-hidden mt-4">
              <div className="w-full h-full bg-amber-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        )}

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
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-amber-200/60 bg-white/70 py-6 text-center text-xs text-stone-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span className="font-bold text-stone-700">StudySpark AI</span>
            <span>— Personalized Learning for Every Mind</span>
          </div>
          <div>
            <span>Powered by Gemini • Intuitive Explanations with Real-World Analogies</span>
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
        onSelectModule={(mod) => setCurrentModule(mod)}
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
