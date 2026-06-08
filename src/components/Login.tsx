import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, ChevronLeft, Loader2 } from 'lucide-react';
import { playClick } from '../lib/sounds';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

interface LoginProps {
  onComplete: (data: any) => void;
  onBack: () => void;
}

export default function Login({ onComplete, onBack }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playClick();
    setLoading(true);
    setError(null);

    const cleanEmail = email.trim().toLowerCase();
    if ((cleanEmail === 'admin' || cleanEmail === 'admin@admin.com') && password === 'admin') {
      const adminData = {
        uid: 'admin',
        nombre: 'Administrador',
        apellido: 'Sistema',
        email: 'admin@admin.com',
        edad: '30',
        peso: '80',
        altura: '180',
        pesoIdeal: '75',
        alergias: [],
        role: 'admin'
      };
      
      localStorage.setItem('adminLoggedIn', 'true');
      localStorage.setItem('adminProfile', JSON.stringify(adminData));
      
      if (!localStorage.getItem('adminDailyFoods')) {
        localStorage.setItem('adminDailyFoods', JSON.stringify([]));
      }
      
      setTimeout(() => {
        onComplete(adminData);
        setLoading(false);
      }, 500);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Obtener datos adicionales de Firestore
      const userDoc = await getDoc(doc(db, "usuarios", user.uid));
      
      if (userDoc.exists()) {
        onComplete(userDoc.data());
      } else {
        // Si no hay documento en firestore, al menos pasamos el email
        onComplete({ email: user.email, nombre: 'Usuario' });
      }
    } catch (err: any) {
      console.error(err);
      setError("Credenciales inválidas. Por favor intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-surface">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-[2.5rem] p-10 editorial-shadow relative overflow-hidden"
      >
        <button 
          onClick={onBack}
          className="absolute top-8 left-8 p-2 text-on-surface-variant hover:text-primary transition-colors"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="text-center mt-4 mb-10">
          <h2 className="font-headline font-bold text-3xl text-on-surface mb-2">Bienvenido de nuevo</h2>
          <p className="text-on-surface-variant">Ingresa tus credenciales para continuar.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-xs text-on-surface ml-1 uppercase tracking-wider flex items-center gap-2">
              <Mail size={14} className="text-primary" /> Usuario / Correo Electrónico
            </label>
            <input 
              className="w-full px-5 py-4 bg-surface-container-highest border-none rounded-xl focus:ring-1 focus:ring-primary/30 focus:bg-surface-container-lowest transition-all placeholder:text-stone-400" 
              placeholder="tu@email.com o admin" 
              type="text" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold text-xs text-on-surface ml-1 uppercase tracking-wider flex items-center gap-2">
              <Lock size={14} className="text-primary" /> Contraseña
            </label>
            <input 
              className="w-full px-5 py-4 bg-surface-container-highest border-none rounded-xl focus:ring-1 focus:ring-primary/30 focus:bg-surface-container-lowest transition-all placeholder:text-stone-400" 
              placeholder="••••••••" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="text-error text-xs font-medium bg-error/10 p-3 rounded-lg flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-error" />
              {error}
            </p>
          )}

          <button 
            disabled={loading}
            className="w-full py-5 rounded-2xl signature-gradient text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:scale-100" 
            type="submit"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Iniciar Sesión'}
            {!loading && <ArrowRight size={20} />}
          </button>
        </form>

        <div className="mt-8 text-center flex flex-col gap-4">
          <p className="text-xs text-on-surface-variant">
            ¿Olvidaste tu contraseña? <a href="#" className="text-primary font-bold hover:underline">Recupérala aquí</a>
          </p>

          <div className="pt-4 border-t border-surface-container-high">
            <button
              onClick={() => {
                playClick();
                setEmail('admin');
                setPassword('admin');
              }}
              className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:text-primary-dark transition-colors bg-primary/10 hover:bg-primary/20 px-4 py-2.5 rounded-full shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              🔑 Rellenar Acceso Admin
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
