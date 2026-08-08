import React, { useState, useRef, useEffect } from 'react';
import { useJarvis } from '../../state/JarvisContext';
import { 
  Send, 
  Sparkles, 
  Trash2, 
  Bot, 
  User, 
  Terminal, 
  Zap, 
  Lightbulb, 
  Wrench,
  Volume2
} from 'lucide-react';
import { VoiceService } from '../../services/ai/VoiceService';

export const ChatDrawer: React.FC = () => {
  const { chatMessages, sendMessage, clearChat, systemState, settings } = useJarvis();
  const [inputText, setInputText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isSubmitting) return;

    const query = inputText.trim();
    setInputText('');
    setIsSubmitting(true);
    try {
      await sendMessage(query);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickCommand = async (cmd: string) => {
    setInputText('');
    setIsSubmitting(true);
    try {
      await sendMessage(cmd);
    } finally {
      setIsSubmitting(false);
    }
  };

  const quickCommands = [
    "Jarvis, what should I study now?",
    "What's my schedule today?",
    "Plan my evening.",
    "Start a 45 minute study session.",
    "Quiz me on physics.",
    "What did I study yesterday?",
    "Explain Newton's laws.",
    "What is Gauss's Law?"
  ];

  return (
    <div className="flex flex-col h-full bg-slate-950/60 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-500 p-0.5 shadow-[0_0_15px_rgba(20,184,166,0.3)]">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-teal-300">
              <Bot className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-base text-slate-100">JARVIS Study AI</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40">
                TOOL-ENABLED
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Natural Language Intent Engine & Study Action Dispatcher
            </p>
          </div>
        </div>

        <button
          onClick={clearChat}
          className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all text-xs flex items-center gap-1"
          title="Clear Chat History"
        >
          <Trash2 className="w-4 h-4" />
          <span className="hidden sm:inline">Clear</span>
        </button>
      </div>

      {/* Suggested Command Chips */}
      <div className="px-6 py-2.5 bg-slate-900/40 border-b border-slate-800/60 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 shrink-0 font-medium">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          <span>Quick Actions:</span>
        </div>
        {quickCommands.map((cmd, i) => (
          <button
            key={i}
            onClick={() => handleQuickCommand(cmd)}
            disabled={isSubmitting}
            className="px-3 py-1 rounded-full bg-slate-800/80 hover:bg-teal-500/20 hover:border-teal-500/40 text-slate-300 hover:text-teal-200 border border-slate-700/60 text-xs whitespace-nowrap transition-all active:scale-95 disabled:opacity-50"
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {chatMessages.map((msg) => {
          const isJarvis = msg.sender === 'JARVIS';

          return (
            <div
              key={msg.id}
              className={`flex gap-3.5 ${isJarvis ? 'justify-start' : 'justify-end'}`}
            >
              {isJarvis && (
                <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-300 shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-2xl p-4 transition-all shadow-md ${
                  isJarvis
                    ? 'bg-slate-900/90 border border-slate-800 text-slate-100'
                    : 'bg-teal-600 text-white rounded-tr-sm'
                }`}
              >
                {/* Message Header */}
                <div className="flex items-center justify-between gap-4 mb-2 pb-1 border-b border-white/10 text-xs font-mono opacity-80">
                  <span className="font-semibold">{isJarvis ? 'JARVIS AI' : 'YOU'}</span>
                  <span>{msg.timestamp}</span>
                </div>

                {/* Thinking Animation */}
                {msg.isThinking ? (
                  <div className="flex items-center gap-2 text-sm text-teal-300 py-1 font-mono">
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Analyzing schedule and inspecting study tools...</span>
                  </div>
                ) : (
                  <div>
                    {/* Tool Executions Badge */}
                    {msg.toolCalls && msg.toolCalls.length > 0 && (
                      <div className="mb-3 space-y-1.5">
                        {msg.toolCalls.map((tc, idx) => (
                          <div
                            key={idx}
                            className="px-2.5 py-1 rounded bg-slate-950/80 border border-teal-500/30 text-[11px] font-mono text-teal-300 flex items-center gap-2"
                          >
                            <Wrench className="w-3 h-3 text-teal-400" />
                            <span>Tool Called: <strong>{tc.name}()</strong></span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Formatted Text Content */}
                    <div className="prose prose-invert max-w-none text-sm leading-relaxed whitespace-pre-wrap">
                      {msg.text}
                    </div>

                    {isJarvis && (
                      <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                        <button
                          onClick={() => VoiceService.speak(msg.text)}
                          className="text-[11px] font-mono text-slate-400 hover:text-teal-300 flex items-center gap-1 transition-colors"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Speak Answer</span>
                        </button>
                        {msg.intent && (
                          <span className="text-[10px] font-mono text-slate-500">
                            Intent: {msg.intent}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {!isJarvis && (
                <div className="w-8 h-8 rounded-lg bg-teal-600/30 border border-teal-500/50 flex items-center justify-center text-teal-300 shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Bar */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-slate-800 bg-slate-950/90">
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-700/80 rounded-xl p-1.5 focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500 transition-all">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask Jarvis anything (e.g. 'What should I study now?', 'Quiz me on physics', 'Plan my evening')..."
            className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isSubmitting}
            className="px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 disabled:opacity-40 disabled:hover:bg-teal-500 text-slate-950 font-semibold text-xs transition-all flex items-center gap-1.5 shadow-md active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </div>
      </form>
    </div>
  );
};
