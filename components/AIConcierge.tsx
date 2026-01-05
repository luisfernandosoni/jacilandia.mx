
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from "@google/genai";
import { ViewState, DESIGN_SYSTEM } from '../types';
import { Magnetic } from './MotionPrimitives';

interface AIConciergeProps {
  currentView: ViewState;
}

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

export const AIConcierge: React.FC<AIConciergeProps> = ({ currentView }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const context = `You are the JACI Assistant. 
      Context: We are a modern school for kids.
      Current section user is viewing: ${currentView}.
      Methodology: "El Método de los Colores" (play-based, emotional intelligence, active explorers).
      Tone: Energetic, friendly, helpful. Spanish only. Concise.`;

      const responseStream = await ai.models.generateContentStream({
        model: 'gemini-3-flash-preview',
        contents: userMessage,
        config: {
          systemInstruction: context,
          temperature: 0.7,
        },
      });

      let assistantText = '';
      setMessages(prev => [...prev, { role: 'assistant', text: '' }]);

      for await (const chunk of responseStream) {
        assistantText += chunk.text;
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1].text = assistantText;
          return updated;
        });
      }
    } catch (error) {
      console.error("AI Concierge Failure:", error);
      setMessages(prev => [...prev, { role: 'assistant', text: "¡Ups! Mi cerebrito de monstruo ha tenido un glitch. ¿Podrías intentar de nuevo?" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4 pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.95, y: 20, filter: 'blur(10px)' }}
            className="w-[340px] md:w-[400px] h-[520px] bg-white/98 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl border border-white/60 overflow-hidden flex flex-col pointer-events-auto"
          >
            <div className="p-6 bg-slate-900 text-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center border border-white/10">
                  <span className="material-symbols-outlined text-primary">auto_awesome</span>
                </div>
                <div>
                  <h3 className="font-bold text-sm font-display tracking-tight">Concierge JACI</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-jaci-green animate-pulse" />
                    <span className="text-[9px] opacity-70 uppercase tracking-widest font-black">AI Active</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-full hover:bg-white/10 transition-colors flex items-center justify-center">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <div ref={scrollRef} className="flex-grow p-6 overflow-y-auto flex flex-col gap-4 no-scrollbar bg-slate-50/30">
              {messages.length === 0 && (
                <div className="text-center py-12 flex flex-col items-center gap-3">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-soft flex items-center justify-center mb-2 border border-slate-100">
                    <span className="material-symbols-outlined text-4xl text-primary animate-bounce">face_5</span>
                  </div>
                  <p className="text-xs font-bold text-slate-400 font-display uppercase tracking-widest leading-relaxed">¡Hola! Soy tu guía.<br/>¿Qué quieres saber sobre JACI?</p>
                </div>
              )}
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: m.role === 'user' ? 8 : -8, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  className={`max-w-[85%] p-4 rounded-2xl text-[13px] leading-relaxed font-body ${
                    m.role === 'user' 
                      ? 'bg-primary text-white self-end rounded-tr-none shadow-glow-primary/10' 
                      : 'bg-white text-slate-700 self-start rounded-tl-none border border-slate-100 shadow-soft'
                  }`}
                >
                  {m.text}
                </motion.div>
              ))}
              {isTyping && messages[messages.length - 1]?.role === 'user' && (
                <div className="bg-white p-4 rounded-2xl self-start rounded-tl-none border border-slate-100 flex gap-1 items-center shadow-soft">
                  <div className="w-1 h-1 bg-primary/40 rounded-full animate-bounce" />
                  <div className="w-1 h-1 bg-primary/40 rounded-full animate-bounce delay-75" />
                  <div className="w-1 h-1 bg-primary/40 rounded-full animate-bounce delay-150" />
                </div>
              )}
            </div>

            <div className="p-4 bg-white border-t border-slate-100">
              <div className="relative flex items-center">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Tu mensaje..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-5 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all font-body"
                />
                <button
                  onClick={handleSend}
                  disabled={isTyping}
                  className="absolute right-2 p-2 bg-slate-900 text-white rounded-xl hover:scale-105 transition-transform disabled:opacity-30 disabled:hover:scale-100 shadow-lg"
                >
                  <span className="material-symbols-outlined text-sm">north</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pointer-events-auto">
        <Magnetic pullStrength={0.25}>
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-16 h-16 rounded-[2rem] flex items-center justify-center text-white shadow-2xl overflow-hidden group border-2 border-white/80"
          >
            <div className="absolute inset-0 bg-slate-900 group-hover:bg-primary transition-colors duration-500" />
            <span className="material-symbols-outlined relative z-10 text-2xl">
              {isOpen ? 'close' : 'auto_awesome'}
            </span>
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 group-hover:translate-x-full transition-transform duration-1000" />
          </motion.button>
        </Magnetic>
      </div>
    </div>
  );
};
