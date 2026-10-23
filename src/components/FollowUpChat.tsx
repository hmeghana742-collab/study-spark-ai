import React, { useState } from 'react';
import { Send, MessageSquare, Sparkles, Loader2, User, Bot, HelpCircle } from 'lucide-react';
import { FollowUpMessage, LearningModule, LearnerProfile } from '../types';

interface FollowUpChatProps {
  module: LearningModule;
  profile: LearnerProfile;
}

export const FollowUpChat: React.FC<FollowUpChatProps> = ({ module, profile }) => {
  const [messages, setMessages] = useState<FollowUpMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async (questionText?: string) => {
    const textToSend = questionText || input.trim();
    if (!textToSend || loading) return;

    const userMsg: FollowUpMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/follow-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: module.topic,
          question: textToSend,
          learnerLevel: profile.level,
          learningStyle: profile.style,
          context: `Topic: ${module.title}. One-liner: ${module.oneLiner}. Analogy: ${module.analogy.title} - ${module.analogy.story}`,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to get follow-up response');
      }

      const aiMsg: FollowUpMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Please try asking again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-amber-200/90 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-3">
        <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 flex items-center justify-center font-bold">
          <MessageSquare className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-bold text-base text-stone-900">Ask Follow-Up Questions</h3>
          <p className="text-xs text-stone-500">
            Confused about a specific step? Ask for another example or explore deeper
          </p>
        </div>
      </div>

      {/* Suggested Follow-ups */}
      {module.suggestedFollowUps && module.suggestedFollowUps.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
            Suggested by StudySpark:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {module.suggestedFollowUps.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(prompt)}
                disabled={loading}
                className="text-left text-xs px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200/70 text-amber-900 font-medium transition flex items-center gap-1.5"
              >
                <HelpCircle className="w-3 h-3 text-amber-600 shrink-0" />
                <span>{prompt}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Message history */}
      {messages.length > 0 && (
        <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${
                m.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {m.sender === 'ai' && (
                <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-amber-500 text-white font-medium rounded-br-xs'
                    : 'bg-stone-50 text-stone-900 border border-stone-200/80 rounded-bl-xs'
                }`}
              >
                <div className="whitespace-pre-line">{m.text}</div>
                <div
                  className={`text-[10px] mt-1 text-right ${
                    m.sender === 'user' ? 'text-amber-100' : 'text-stone-400'
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>

              {m.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-stone-200 text-stone-700 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50/60 p-3 rounded-xl border border-amber-200/50">
              <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
              <span>StudySpark is preparing your personalized explanation...</span>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="text-xs text-rose-700 bg-rose-50 border border-rose-200 p-2.5 rounded-xl">
          {error}
        </div>
      )}

      {/* Input bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 pt-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything, e.g. 'Can you explain step 2 in another way?'"
          disabled={loading}
          className="flex-1 px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-xs sm:text-sm transition bg-stone-50/40"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold text-xs sm:text-sm transition flex items-center gap-1.5 shadow-xs"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ask</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
