import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  Dumbbell, 
  Apple, 
  StickyNote, 
  Play, 
  Pause, 
  RotateCcw, 
  Plus, 
  Trash2,
  Brain,
  Zap,
  Target
} from 'lucide-react';
import { playClick } from '../lib/sounds';
import { cn } from '../lib/utils';

interface ProfileProps {
  userProfile: any;
  onUpdate: (data: any) => void;
}

export default function Profile({ userProfile, onUpdate }: ProfileProps) {
  // Pomodoro State
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  // Local state for target weight input
  const [localPesoIdeal, setLocalPesoIdeal] = useState(userProfile.pesoIdeal || '');

  // Habits State
  const [habits, setHabits] = useState([
    { id: 1, text: 'Beber 2L de agua', completed: false },
    { id: 2, text: 'Dormir 8 horas', completed: true },
    { id: 3, text: 'Meditación 10min', completed: false },
    { id: 4, text: 'Comer vegetales', completed: true },
  ]);

  // Notes State
  const [notes, setNotes] = useState([
    { id: 1, text: 'Recordar comprar avena y chía.' },
    { id: 2, text: 'Próximo turno con nutricionista: 15/05.' }
  ]);
  const [newNote, setNewNote] = useState('');

  // Pomodoro Logic
  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      setIsBreak(!isBreak);
      setTimeLeft(isBreak ? 25 * 60 : 5 * 60);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, isBreak]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleUpdateWeight = () => {
    playClick();
    onUpdate({ pesoIdeal: localPesoIdeal });
    alert("¡Meta de peso actualizada con éxito!");
  };

  const toggleHabit = (id: number) => {
    playClick();
    setHabits(habits.map(h => h.id === id ? { ...h, completed: !h.completed } : h));
  };

  const addNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    playClick();
    setNotes([{ id: Date.now(), text: newNote }, ...notes]);
    setNewNote('');
  };

  return (
    <div className="space-y-8 sm:space-y-10 pb-20">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-2"
      >
        <h1 className="text-3xl sm:text-5xl font-black tracking-tighter text-on-surface mb-2">Tu Centro <span className="text-primary italic">Personal</span></h1>
        <p className="text-on-surface-variant text-sm sm:text-lg">Hola, {userProfile.nombre}. Gestiona tu rendimiento y metas aquí.</p>
      </motion.header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-8">
        
        {/* Pomodoro Timer */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="col-span-1 md:col-span-1 lg:col-span-4 bg-primary text-white rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-10 editorial-shadow relative overflow-hidden flex flex-col justify-between min-h-[350px] sm:min-h-[400px]"
        >
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6 sm:mb-8">
              <Brain size={24} />
              <span className="text-xs font-black uppercase tracking-[0.2em]">Técnica Pomodoro</span>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2">{isBreak ? 'Descanso' : 'Enfoque'}</p>
            <h2 className="text-6xl sm:text-8xl font-black tracking-tighter tabular-nums mb-8 sm:mb-10">{formatTime(timeLeft)}</h2>
          </div>
          
          <div className="relative z-10 flex gap-4">
            <button 
              onClick={() => { playClick(); setIsActive(!isActive); }}
              className="flex-1 bg-white text-primary py-4 sm:py-5 rounded-2xl font-black text-base sm:text-lg flex items-center justify-center gap-2 hover:bg-surface transition-all shadow-xl"
            >
              {isActive ? <Pause size={20} sm-size={24} /> : <Play size={20} sm-size={24} />}
              {isActive ? 'Pausar' : 'Iniciar'}
            </button>
            <button 
              onClick={() => { playClick(); setIsActive(false); setTimeLeft(25 * 60); }}
              className="w-12 sm:w-16 bg-white/20 text-white rounded-2xl flex items-center justify-center hover:bg-white/30 transition-all"
            >
              <RotateCcw size={20} sm-size={24} />
            </button>
          </div>
        </motion.section>

        {/* Peso Ideal / Metas */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="col-span-1 md:col-span-1 lg:col-span-4 bg-surface-container-lowest rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-10 editorial-shadow border border-primary/20 flex flex-col justify-between relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <div>
            <div className="flex items-center gap-2 text-primary mb-6 sm:mb-8">
              <Target size={24} />
              <span className="text-xs font-black uppercase tracking-[0.2em]">Meta de Peso</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tighter mb-4 text-on-surface leading-tight">¿Cuál es tu <span className="text-primary italic">peso ideal?</span></h3>
            <p className="text-on-surface-variant text-xs sm:text-sm mb-6 sm:mb-8 leading-relaxed">Definir un objetivo claro nos permite ajustar tus calorías.</p>
          </div>
          
          <div className="space-y-4">
            <div className="relative">
              <input 
                type="number" 
                value={localPesoIdeal}
                onChange={(e) => setLocalPesoIdeal(e.target.value)}
                placeholder="Ej: 75"
                className="w-full bg-white border-2 border-surface-container-high rounded-[1.5rem] p-5 sm:p-6 text-xl sm:text-2xl font-black focus:border-primary transition-all outline-none pr-16 shadow-inner"
              />
              <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-on-surface-variant">KG</span>
            </div>
            <button 
              onClick={handleUpdateWeight}
              className="w-full py-4 sm:py-5 bg-primary text-white rounded-[1.5rem] font-black text-sm shadow-xl hover:opacity-90 transition-all transform active:scale-95"
            >
              Actualizar Meta
            </button>
          </div>
        </motion.section>

        {/* Habit Tracker */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="col-span-1 md:col-span-2 lg:col-span-4 bg-white rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-10 editorial-shadow border border-surface-container-high flex flex-col"
        >
          <div className="flex justify-between items-center mb-6 sm:mb-8">
            <div className="flex items-center gap-2 text-secondary">
              <Zap size={24} />
              <span className="text-xs font-black uppercase tracking-[0.2em]">Habits</span>
            </div>
            <span className="text-[10px] font-bold bg-secondary/10 text-secondary px-3 py-1 rounded-full uppercase tracking-widest">Hoy</span>
          </div>
          
          <div className="space-y-3 sm:space-y-4 flex-1">
            {habits.map(habit => (
              <button 
                key={habit.id}
                onClick={() => toggleHabit(habit.id)}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left",
                  habit.completed 
                    ? "bg-secondary/5 border-secondary/20 text-secondary" 
                    : "bg-surface-container-low border-transparent text-on-surface-variant hover:border-surface-container-high"
                )}
              >
                <CheckCircle2 size={18} sm-size={20} className={habit.completed ? "opacity-100" : "opacity-20"} />
                <span className={cn("font-bold text-sm sm:text-base", habit.completed && "line-through opacity-60")}>{habit.text}</span>
              </button>
            ))}
          </div>
        </motion.section>

        {/* Nutrition Tips */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="col-span-1 md:col-span-2 lg:col-span-8 bg-secondary text-white rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-12 editorial-shadow relative overflow-hidden"
        >
          <div className="absolute bottom-0 right-0 -mb-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="relative z-10 space-y-4 sm:space-y-6">
            <div className="flex items-center gap-2">
              <Apple size={24} />
              <span className="text-xs font-black uppercase tracking-[0.2em]">Consejos</span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-black leading-tight tracking-tighter">Prioriza las proteínas en el desayuno para mayor saciedad.</h3>
            <p className="text-white/60 text-base sm:text-lg">El consumo de huevos o yogur griego reduce antojos por la tarde.</p>
            <div className="flex gap-2 pt-4">
              <div className="h-1.5 flex-1 bg-white rounded-full"></div>
              <div className="h-1.5 flex-1 bg-white/30 rounded-full"></div>
              <div className="h-1.5 flex-1 bg-white/30 rounded-full"></div>
            </div>
          </div>
        </motion.section>

        {/* Quick Notes */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="col-span-1 md:col-span-2 lg:col-span-12 bg-white rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-10 editorial-shadow border border-surface-container-high"
        >
          <div className="flex items-center gap-2 text-on-surface mb-6 sm:mb-8">
            <StickyNote size={24} />
            <span className="text-xs font-black uppercase tracking-[0.2em]">Notas Rápidas</span>
          </div>
          
          <form onSubmit={addNote} className="mb-6 sm:mb-8 flex gap-3 sm:gap-4">
            <input 
              value={newNote}
              onChange={e => setNewNote(e.target.value)}
              placeholder="Recordatorios..."
              className="flex-1 bg-surface-container-low rounded-2xl p-4 sm:p-6 text-base sm:text-lg focus:ring-2 focus:ring-primary/10 border-none outline-none shadow-inner"
            />
            <button type="submit" className="w-14 h-14 sm:w-16 sm:h-16 bg-primary text-white rounded-2xl flex items-center justify-center hover:opacity-90 transition-all transform active:scale-95 shadow-xl shrink-0">
              <Plus size={28} sm-size={32} />
            </button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {notes.map(note => (
              <motion.div 
                key={note.id} 
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-5 sm:p-6 bg-yellow-50 rounded-[1.5rem] sm:rounded-[2rem] border border-yellow-200 relative group shadow-sm hover:shadow-md transition-all"
              >
                <p className="text-base sm:text-lg font-bold text-yellow-900 leading-relaxed mb-4">{note.text}</p>
                <button 
                  onClick={() => { playClick(); setNotes(notes.filter(n => n.id !== note.id)); }}
                  className="absolute top-4 right-4 text-yellow-900/20 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={20} />
                </button>
              </motion.div>
            ))}
          </div>
        </motion.section>

      </div>
    </div>
  );
}
