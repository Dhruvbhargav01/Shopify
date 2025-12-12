'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, Send, X } from 'lucide-react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function Chatbot({ userName }: { userName?: string }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    if (messages.length === 0) {
      const name = userName || 'Guest';
      setMessages([
        {
          role: 'assistant',
          content:
            `Welcome!, how can I help you today?\n` +
            `You can ask about products, prices, availability or suggestions.`,
        },
      ]);
    }
  }, [open, userName, messages.length]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          userName,
        }),
      });

      if (!res.ok) {
        throw new Error('API error');
      }

      const data = await res.json();

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.text || 'Sorry, I could not answer that.',
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Network error. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open chat"
        title="Open chat"
        className="
          fixed bottom-6 right-6 z-40
          h-14 w-14 rounded-full
          flex items-center justify-center
          bg-black border border-neutral-700
          text-white shadow-lg
          hover:bg-neutral-900 hover:shadow-xl
          transition
        "
      >
        <Bot className="h-6 w-6" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm">
          <div
            className="
              w-full max-w-md h-[75vh] md:h-[70vh]
              rounded-2xl overflow-hidden
              bg-black text-white
              border border-neutral-800
              flex flex-col
            "
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800 bg-neutral-950">
              <div>
                <p className="text-xs font-semibold">Shopify-Assistant</p>
                <p className="text-[11px] text-neutral-400">
                  Ask anything about products & prices
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                title="Close chat"
                className="p-1 rounded-full border border-neutral-700 text-neutral-300 hover:bg-neutral-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 text-sm">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${
                    m.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={
                      m.role === 'user'
                        ? 'max-w-[80%] bg-neutral-800 rounded-2xl px-3 py-2'
                        : 'max-w-[80%] bg-neutral-900 rounded-2xl px-3 py-2 border border-neutral-800'
                    }
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">
                      {m.content}
                    </p>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-neutral-900 rounded-2xl px-3 py-2 border border-neutral-800">
                    <div className="flex space-x-1">
                      <span className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce" />
                      <span className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce [animation-delay:0.1s]" />
                      <span className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce [animation-delay:0.2s]" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={endRef} />
            </div>

            <div className="border-t border-neutral-800 bg-neutral-950 px-4 py-3">
              <div className="flex items-center space-x-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about products, prices, suggestions..."
                  className="
                    flex-1 rounded-full px-3 py-2 text-sm
                    bg-black border border-neutral-700
                    text-white placeholder:text-neutral-500
                    focus:outline-none focus:ring-1 focus:ring-neutral-400
                  "
                />
                <button
                  onClick={send}
                  disabled={loading || !input.trim()}
                  aria-label="Send message"
                  title="Send message"
                  className="
                    h-9 w-9 flex items-center justify-center rounded-full
                    bg-white text-black text-xs font-semibold
                    disabled:opacity-60
                  "
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-1 text-[10px] text-neutral-500">
                Example: &quot;What is the maximum price of a product?&quot; or
                &quot;How many products are there?&quot;
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
