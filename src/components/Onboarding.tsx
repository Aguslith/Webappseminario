import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf, Mail, AlertTriangle, Lock} from 'lucide-react';
import { playClick } from '../lib/sounds';
import { cn } from '../lib/utils';

//firebase
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, setDoc } from "firebase/firestore";

interface OnboardingProps {
  onComplete: (data: any) => void;
}

const COMMON_ALLERGIES = [
  { id: 'dairy', label: 'Lácteos' },
  { id: 'gluten', label: 'Gluten' },
  { id: 'peanuts', label: 'Maní' },
  { id: 'nuts', label: 'Frutos Secos' },
  { id: 'shellfish', label: 'Mariscos' },
  { id: 'soy', label: 'Soja' },
  { id: 'eggs', label: 'Huevos' },
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    edad: '',
    peso: '',
    altura: '',
    alergias: [] as string[]
  });

  const toggleAllergy = (id: string) => {
    setFormData(prev => ({
      ...prev,
      alergias: prev.alergias.includes(id)
        ? prev.alergias.filter(a => a !== id)
        : [...prev.alergias, id]
    }));
  };

  return (
    <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start py-8 lg:py-12">
      {/* Left Column: Editorial Imagery */}
      <div className="hidden lg:flex lg:col-span-5 flex-col gap-8 sticky top-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[2.5rem] aspect-[3/4] editorial-shadow"
        >
          <img 
            alt="Fresh organic kale" 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2DaDvl8-XjKM0BmF2-PWjjT-sGoG1_wStgjmdN8HNCvi6mfucOUdSUiUq75jQ-JP8zUjVqQixInHXRPhca5DQ3dFIODvXW5HY-Aqh7h69iMQpiRj1VP2QWAtEWFFt9eNLS_y-lZY-zMRl_mvruR1MX87IAnhXPZN2rvbrIQfdoOHq3vWLCWyo0G8L6TwZwJDLKRQo05CKXiKt5lldDFdgpTfRNNfqGM19hSqpdeY9HX1aXMv3nUvaPPryq20diP3Lj5sjMRq31Q0" 
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-8 left-8 right-8 p-6 backdrop-blur-xl bg-surface/80 rounded-2xl editorial-shadow">
            <p className="font-headline font-bold text-primary text-xl mb-1">Autoridad de la Naturaleza.</p>
            <p className="text-on-surface-variant leading-relaxed text-sm">Creemos en un ritual de nutrición, no solo en una rutina de seguimiento. Tu viaje hacia el bienestar comienza aquí.</p>
          </div>
        </motion.div>
      </div>

      {/* Right Column: Form */}
      <div className="lg:col-span-7 flex flex-col gap-10">
        <header className="flex flex-col gap-2">
          <div className="inline-flex items-center gap-2 mb-4">
            <Leaf className="text-primary" size={24} />
            <span className="font-headline font-black tracking-tighter text-primary text-2xl uppercase">Organic Editorial</span>
          </div>
          <h1 className="font-headline font-bold text-4xl md:text-5xl text-on-surface tracking-tight leading-tight">
            Crea tu <br/><span className="text-secondary italic">diario vivo.</span>
          </h1>
          <p className="text-on-surface-variant text-lg max-w-md mt-2">
            Personaliza tu experiencia para que el contenido sea tan único como tú.
          </p>
        </header>

        <form 
  className="flex flex-col gap-8"
  onSubmit={async (e) => {
    e.preventDefault();
    playClick();

    try {
      let user = auth.currentUser;
      
      if (!user) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        user = userCredential.user;
      }

      await setDoc(doc(db, "usuarios", user.uid), {
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        edad: formData.edad,
        peso: formData.peso,
        altura: formData.altura,
        alergias: formData.alergias,
        creadoEn: new Date()
      });

      onComplete(formData);

    } catch (error) {
      console.error(error);
      alert("Error al registrarse o guardar perfil");
    }
  }}
>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
            <div className="flex flex-col gap-2 col-span-1">
              <label className="font-semibold text-xs text-on-surface ml-1 uppercase tracking-wider">Nombre</label>
              <input 
                className="w-full px-5 py-4 bg-surface-container-highest border-none rounded-xl focus:ring-1 focus:ring-primary/30 focus:bg-surface-container-lowest transition-all placeholder:text-stone-400" 
                placeholder="Ej. Julián" 
                type="text" 
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                required
              />
            </div>
            
            <div className="flex flex-col gap-2 col-span-1">
              <label className="font-semibold text-xs text-on-surface ml-1 uppercase tracking-wider">Apellido</label>
              <input 
                className="w-full px-5 py-4 bg-surface-container-highest border-none rounded-xl focus:ring-1 focus:ring-primary/30 focus:bg-surface-container-lowest transition-all placeholder:text-stone-400" 
                placeholder="Ej. Thorne" 
                type="text" 
                value={formData.apellido}
                onChange={(e) => setFormData({...formData, apellido: e.target.value})}
                required
              />
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="font-semibold text-xs text-on-surface ml-1 uppercase tracking-wider flex items-center gap-2">
                <Mail size={14} className="text-primary" /> Correo Electrónico
              </label>
              <input 
                className="w-full px-5 py-4 bg-surface-container-highest border-none rounded-xl focus:ring-1 focus:ring-primary/30 focus:bg-surface-container-lowest transition-all placeholder:text-stone-400" 
                placeholder="julian@ejemplo.com" 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="font-semibold text-xs text-on-surface ml-1 uppercase tracking-wider flex items-center gap-2">
                <Lock size={14} className="text-primary" /> Contraseña
              </label>
              <input 
                className="w-full px-5 py-4 bg-surface-container-highest border-none rounded-xl focus:ring-1 focus:ring-primary/30 focus:bg-surface-container-lowest transition-all placeholder:text-stone-400" 
                placeholder="••••••••" 
                type="password" 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-semibold text-xs text-on-surface ml-1 uppercase tracking-wider">Edad</label>
              <input 
                className="w-full px-5 py-4 bg-surface-container-highest border-none rounded-xl focus:ring-1 focus:ring-primary/30 focus:bg-surface-container-lowest transition-all placeholder:text-stone-400" 
                placeholder="28" 
                type="number" 
                value={formData.edad}
                onChange={(e) => setFormData({...formData, edad: e.target.value})}
                required
              />
            </div>
            
            <div className="flex flex-row gap-4">
              <div className="flex-1 flex flex-col gap-2">
                <label className="font-semibold text-xs text-on-surface ml-1 uppercase tracking-wider">Peso</label>
                <div className="relative">
                  <input 
                    className="w-full px-5 py-4 bg-surface-container-highest border-none rounded-xl focus:ring-1 focus:ring-primary/30 focus:bg-surface-container-lowest transition-all placeholder:text-stone-400" 
                    placeholder="72" 
                    type="number" 
                    value={formData.peso}
                    onChange={(e) => setFormData({...formData, peso: e.target.value})}
                    required
                  />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 text-stone-400 text-[10px] font-bold uppercase">kg</span>
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <label className="font-semibold text-xs text-on-surface ml-1 uppercase tracking-wider">Altura</label>
                <div className="relative">
                  <input 
                    className="w-full px-5 py-4 bg-surface-container-highest border-none rounded-xl focus:ring-1 focus:ring-primary/30 focus:bg-surface-container-lowest transition-all placeholder:text-stone-400" 
                    placeholder="182" 
                    type="number" 
                    value={formData.altura}
                    onChange={(e) => setFormData({...formData, altura: e.target.value})}
                    required
                  />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 text-stone-400 text-[10px] font-bold uppercase">cm</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 flex flex-col gap-4">
              <label className="font-semibold text-xs text-on-surface ml-1 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle size={14} className="text-secondary" /> Alergias e Intolerancias
              </label>
              <div className="flex flex-wrap gap-2">
                {COMMON_ALLERGIES.map((allergy) => (
                  <button
                    key={allergy.id}
                    type="button"
                    onClick={() => {
                      playClick();
                      toggleAllergy(allergy.id);
                    }}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-all border",
                      formData.alergias.includes(allergy.id)
                        ? "bg-secondary/10 border-secondary text-secondary shadow-sm"
                        : "bg-surface-container-highest border-transparent text-on-surface-variant hover:bg-surface-container-highest/80"
                    )}
                  >
                    {allergy.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center gap-6">
            <button 
              className="w-full sm:w-auto px-10 py-5 rounded-full signature-gradient text-white font-headline font-bold text-lg editorial-shadow hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3" 
              type="submit"
            >
              Comenzar Mi Viaje
              <ArrowRight size={20} />
            </button>
            <p className="text-on-surface-variant text-[11px] text-center sm:text-left leading-relaxed max-w-[200px]">
              Al continuar, aceptas nuestra <a className="underline underline-offset-4 hover:text-primary transition-colors" href="#">Política de Privacidad</a>.
            </p>
          </div>
        </form>

        <div className="flex items-center gap-4 mt-2">
          <div className="h-1 w-12 rounded-full bg-primary/20">
            <div className="h-full w-full bg-primary rounded-full"></div>
          </div>
          <div className="h-1 w-8 rounded-full bg-surface-container-highest"></div>
          <div className="h-1 w-8 rounded-full bg-surface-container-highest"></div>
          <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-2">Paso 01 / 03</span>
        </div>
      </div>
    </div>
  );
}
