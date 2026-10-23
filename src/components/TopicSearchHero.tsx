import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Mic, MicOff, X, ArrowRight, BookOpen } from 'lucide-react';
import { POPULAR_PROMPTS } from '../data/sampleTopics';

interface TopicSearchHeroProps {
  onSearch: (topic: string) => void;
  isLoading: boolean;
  currentTopic?: string;
}

export const TopicSearchHero: React.FC<TopicSearchHeroProps> = ({
  onSearch,
  isLoading,
  currentTopic = '',
}) => {
  const [query, setQuery] = useState(currentTopic);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  useEffect(() => {
    if (currentTopic) {
      setQuery(currentTopic);
    }
  }, [currentTopic]);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)
    ) {
      setSpeechSupported(true);
    }
  }, []);

  const handleVoiceInput = () => {
    if (!speechSupported) return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (transcript) {
        setQuery(transcript);
        onSearch(transcript);
      }
    };

    recognition.start();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  return (
    <div className="relative py-8 sm:py-12 px-4 max-w-4xl mx-auto text-center">
      {/* Spark Tagline */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/90 text-amber-900 border border-amber-300/80 text-xs font-bold mb-4 shadow-2xs">
        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
        <span>Ask ANY question, equation, or topic • Get instant solutions & clear intuition</span>
      </div>

      <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight mb-3">
        Solve & Master Anything with{' '}
        <span className="bg-gradient-to-r from-amber-600 via-orange-500 to-amber-500 bg-clip-text text-transparent">
          StudySpark
        </span>
      </h1>

      <p className="text-sm sm:text-base text-stone-600 max-w-2xl mx-auto mb-7 font-normal">
        Ask any homework problem, equation to solve, coding challenge, science concept, or historical question. StudySpark gives you the direct answer, step-by-step working, and clear everyday analogies.
      </p>

      {/* Main Search Input Form */}
      <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto mb-6">
        <div className="relative flex items-center bg-white rounded-2xl shadow-lg shadow-amber-900/5 border-2 border-amber-300/80 focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-200/50 transition-all p-1.5 sm:p-2">
          <div className="pl-3 pr-2 text-amber-600">
            <Search className="w-5 h-5" />
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask or solve ANY question (e.g., 'Solve 3x + 15 = 45', 'Why does ice float?', 'How does binary search work?')..."
            disabled={isLoading}
            className="flex-1 bg-transparent py-2.5 px-1 outline-none text-stone-900 text-sm sm:text-base placeholder:text-stone-400 font-medium"
          />

          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg mr-1 transition"
              title="Clear input"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {speechSupported && (
            <button
              type="button"
              onClick={handleVoiceInput}
              disabled={isLoading}
              className={`p-2 rounded-xl text-stone-500 hover:bg-stone-100 transition mr-1.5 ${
                isListening ? 'bg-rose-100 text-rose-600 animate-pulse' : ''
              }`}
              title="Speak your question"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          )}

          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="px-5 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-amber-500/25 flex items-center gap-1.5 transition shrink-0 cursor-pointer"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Solving...</span>
              </span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Solve & Explain</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Popular inspiration prompts chips */}
      <div className="max-w-3xl mx-auto text-left">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-amber-600" />
            Try Any Question or Problem (Math, Code, Science, History):
          </span>
        </div>

        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
          {POPULAR_PROMPTS.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setQuery(item.topic);
                onSearch(item.topic);
              }}
              disabled={isLoading}
              className="text-xs px-3 py-1.5 rounded-xl bg-white hover:bg-amber-100/60 border border-amber-200/90 text-stone-700 hover:text-amber-900 font-semibold transition flex items-center gap-1.5 shadow-2xs group"
            >
              <span className="text-stone-400 group-hover:text-amber-600 transition">
                {item.topic}
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-bold">
                {item.category}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
