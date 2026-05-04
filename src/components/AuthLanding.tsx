import { motion } from 'framer-motion';
import { Leaf, ArrowRight, UserPlus, LogIn } from 'lucide-react';
import { playClick } from '../lib/sounds';

interface AuthLandingProps {
  onSelect: (mode: 'login' | 'signup') => void;
}

export default function AuthLanding({ onSelect }: AuthLandingProps) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-surface">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-secondary/5 blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md bg-white rounded-[2.5rem] p-10 editorial-shadow text-center overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 signature-gradient" />
        
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-8">
          <Leaf size={32} />
        </div>

        <h1 className="font-headline font-bold text-4xl text-on-surface tracking-tight mb-4">
          Bienvenido a <br/>
          <span className="text-primary uppercase tracking-tighter">Organic Editorial</span>
        </h1>
        
        <p className="text-on-surface-variant text-lg mb-10 leading-relaxed">
          Tu diario vivo de nutrición y bienestar. Comienza hoy mismo a transformar tu vida.
        </p>

        <div className="flex flex-col gap-4">
          <button 
            onClick={() => {
              playClick();
              onSelect('signup');
            }}
            className="group w-full py-5 px-8 rounded-2xl signature-gradient text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            <UserPlus size={22} />
            Crear Cuenta Nueva
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <button 
            onClick={() => {
              playClick();
              onSelect('login');
            }}
            className="w-full py-5 px-8 rounded-2xl bg-surface-container-highest text-on-surface font-bold text-lg hover:bg-surface-container-high transition-all flex items-center justify-center gap-3 border border-transparent hover:border-primary/20"
          >
            <LogIn size={22} className="text-primary" />
            Ya tengo cuenta
          </button>
        </div>

        <p className="mt-10 text-xs text-on-surface-variant font-medium uppercase tracking-widest opacity-60">
          Inspiración • Nutrición • Bienestar
        </p>
      </motion.div>
    </div>
  );
}
