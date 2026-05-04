import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { askAssistant } from '../lib/gemini';
import { cn } from '../lib/utils';

interface AssistantProps {
  userProfile?: {
    nombre: string;
    alergias: string[];
    peso: string;
    altura: string;
  } | null;
}

export default function Assistant({ userProfile }: AssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([
    { role: 'assistant', content: '¡Hola! Soy BioCoach. ¿Qué comiste hoy o en qué puedo ayudarte?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await askAssistant(userMessage, userProfile);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Lo siento, hubo un error al procesar tu solicitud. Por favor verifica tu API Key.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-24 w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center z-50 lg:right-10"
      >
        <Bot size={28} />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-24 right-4 lg:right-10 w-[90vw] max-w-[400px] h-[500px] bg-white rounded-3xl shadow-2xl flex flex-col z-50 overflow-hidden border border-surface-container-high"
          >
            {/* Header */}
            <div className="p-4 signature-gradient text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className="font-bold">BioCoach AI</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <p className="text-[10px] opacity-80 uppercase tracking-widest font-bold">En línea</p>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
              {messages.map((msg, idx) => (
                <div key={idx} className={cn(
                  "flex items-start gap-2 max-w-[85%]",
                  msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                )}>
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                    msg.role === 'user' ? "bg-surface-container-high text-on-surface" : "bg-primary-container text-primary"
                  )}>
                    {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                  </div>
                  <div className={cn(
                    "p-3 rounded-2xl text-sm leading-relaxed",
                    msg.role === 'user' 
                      ? "bg-primary text-white rounded-tr-none" 
                      : "bg-surface-container-low text-on-surface rounded-tl-none shadow-sm"
                  )}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-2 mr-auto">
                  <div className="w-8 h-8 rounded-full bg-primary-container text-primary flex items-center justify-center">
                    <Bot size={14} />
                  </div>
                  <div className="bg-surface-container-low p-3 rounded-2xl rounded-tl-none">
                    <Loader2 size={16} className="animate-spin text-primary" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-surface-container-lowest border-t border-surface-container-high">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Dime qué comiste..."
                  className="w-full bg-white border border-surface-container-high rounded-2xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary hover:bg-primary/5 rounded-xl disabled:opacity-50"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
