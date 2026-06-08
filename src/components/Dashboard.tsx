import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Settings, Utensils, Wheat, Droplet, X, CheckCircle2, Flame } from 'lucide-react';
import { cn } from '../lib/utils';
import { FoodEntry } from '../App';

interface DashboardProps {
  userProfile: {
    nombre: string;
    apellido: string;
    edad: string;
    peso: string;
    altura: string;
    pesoIdeal?: string;
  };
  dailyFoods: FoodEntry[];
}

export default function Dashboard({ userProfile, dailyFoods }: DashboardProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Calculations
  const peso = parseFloat(userProfile.peso) || 0;
  const pesoIdeal = parseFloat(userProfile.pesoIdeal || userProfile.peso) || peso;
  const altura = parseFloat(userProfile.altura) || 0;
  const edad = parseInt(userProfile.edad) || 30;

  // Real BMI logic
  const bmiActual = altura > 0 ? (peso / Math.pow(altura / 100, 2)).toFixed(1) : "0.0";
  const bmiMeta = altura > 0 ? (pesoIdeal / Math.pow(altura / 100, 2)).toFixed(1) : "0.0";
  
  // Real TMB (Harris-Benedict) + Target adjustment
  const baseTMB = (10 * peso) + (6.25 * altura) - (5 * edad) + 5;
  const activityMultiplier = 1.2; // Sedentary
  const maintenanceCals = baseTMB * activityMultiplier;
  
  const targetCalories = peso > pesoIdeal ? Math.round(maintenanceCals - 500) : Math.round(maintenanceCals);
  
  const consumedCalories = Math.round(dailyFoods.reduce((acc, food) => acc + (Number(food.calories) || 0), 0));
  const consumedProtein = parseFloat(dailyFoods.reduce((acc, food) => acc + (Number(food.protein) || 0), 0).toFixed(1));
  const consumedCarbs = parseFloat(dailyFoods.reduce((acc, food) => acc + (Number(food.carbs) || 0), 0).toFixed(1));
  const consumedFats = parseFloat(dailyFoods.reduce((acc, food) => acc + (Number(food.fats) || 0), 0).toFixed(1));

  const remainingCalories = Math.max(0, targetCalories - consumedCalories);
  const caloriePercent = Math.min(100, (consumedCalories / targetCalories) * 100);
  
  const getBMIStatus = (val: number) => {
    if (val < 18.5) return { label: "Bajo Peso", color: "text-blue-500", bg: "bg-blue-100" };
    if (val < 25) return { label: "Saludable", color: "text-secondary", bg: "bg-secondary-container" };
    if (val < 27.5) return { label: "Sobrepeso Leve", color: "text-orange-400", bg: "bg-orange-50" };
    if (val < 30) return { label: "Sobrepeso", color: "text-orange-600", bg: "bg-orange-100" };
    return { label: "Obesidad", color: "text-red-500", bg: "bg-red-100" };
  };
  const bmiStatusActual = getBMIStatus(parseFloat(bmiActual));
  const bmiStatusMeta = getBMIStatus(parseFloat(bmiMeta));

  const today = new Date();
  const formattedDate = today.toLocaleDateString('es-ES', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  });

  // Calculate overlap for BMI markers
  const actualPos = Math.min(95, (parseFloat(bmiActual) / 40) * 100);
  const metaPos = Math.min(95, (parseFloat(bmiMeta) / 40) * 100);
  const areClose = Math.abs(actualPos - metaPos) < 5;

  return (
    <div className="space-y-6 sm:space-y-10 relative pb-20">
      <AnimatePresence>
        {showNotifications && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed top-24 right-4 sm:right-10 z-[70] w-72 sm:w-80 bg-white rounded-3xl p-6 shadow-2xl editorial-shadow border border-surface-container-high"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg">Notificaciones</h3>
              <button onClick={() => setShowNotifications(false)}><X size={20}/></button>
            </div>
            <div className="space-y-4">
              <div className="flex gap-4 p-3 bg-primary/5 rounded-2xl">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                  <CheckCircle2 size={16} />
                </div>
                <p className="text-xs text-on-surface-variant">¡Meta diaria de agua alcanzada! Sigue así.</p>
              </div>
              <p className="text-center text-xs text-on-surface-variant/40 py-4 italic">No hay más notificaciones por hoy.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.header 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6"
      >
        <div className="flex-1">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary leading-tight tracking-tighter">Tablero de Nutrición</h1>
          <p className="text-on-surface-variant mt-2 capitalize text-sm sm:text-base">Información personalizada para el {formattedDate}</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={cn(
              "w-12 h-12 flex items-center justify-center rounded-2xl transition-all shadow-sm",
              showNotifications ? "bg-primary text-white" : "bg-white text-primary hover:bg-surface-container-highest"
            )}
          >
            <Bell size={20} />
          </button>
          <button 
            onClick={() => setShowSettings(true)}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white text-primary transition-colors hover:bg-surface-container-highest shadow-sm"
          >
            <Settings size={20} />
          </button>
        </div>
      </motion.header>

      <div className="grid grid-cols-12 gap-6 sm:gap-8">
        {/* BMI Projection Card */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-10 editorial-shadow relative overflow-hidden border border-surface-container-high"
        >
          <div className="flex-1 w-full">
            <h2 className="text-xl sm:text-2xl font-bold text-primary mb-6 sm:mb-8">Proyección de Metas</h2>
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 mb-8 sm:mb-10">
              <div className="flex-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2">Estado Actual</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-6xl font-black text-on-surface tracking-tighter">{bmiActual}</span>
                  <span className={cn("font-bold text-[10px] px-2 py-0.5 rounded-full", bmiStatusActual.color, bmiStatusActual.bg)}>
                    {bmiStatusActual.label}
                  </span>
                </div>
              </div>
              <div className="w-full sm:w-px h-px sm:h-12 bg-surface-container-high self-center opacity-30"></div>
              <div className="flex-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Meta: {userProfile.pesoIdeal || userProfile.peso}kg</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-6xl font-black text-primary/30 tracking-tighter">{bmiMeta}</span>
                  <span className={cn("font-bold text-[10px] px-2 py-0.5 rounded-full", bmiStatusMeta.color, bmiStatusMeta.bg, "opacity-30")}>
                    {bmiStatusMeta.label}
                  </span>
                </div>
              </div>
            </div>
            
            <p className="text-on-surface-variant text-sm leading-relaxed mb-8 sm:mb-12 max-w-sm">
              Tu meta es alcanzar un IMC de {bmiMeta}. Hemos ajustado tu ingesta a <span className="font-bold text-primary">{targetCalories} kcal</span>.
            </p>
            
            <div className="relative w-full h-16 sm:h-20 mt-4 px-2">
              <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex rounded-full overflow-hidden bg-surface-container-high h-3 sm:h-4">
                <div className="h-full bg-blue-400 w-[18.5%] opacity-20"></div>
                <div className="h-full bg-secondary w-[6.5%]"></div>
                <div className="h-full bg-orange-400 w-[5%] opacity-20"></div>
                <div className="h-full bg-red-500 w-[70%] opacity-20"></div>
              </div>
              
              <motion.div 
                initial={{ left: "0%" }}
                animate={{ left: `${metaPos}%` }}
                className="absolute top-0 flex flex-col items-center -translate-x-1/2 z-20"
              >
                <div className="w-1.5 sm:w-2 h-10 sm:h-12 bg-primary rounded-full shadow-lg ring-4 ring-white"></div>
                <span className={cn("text-[8px] sm:text-[10px] font-black text-primary mt-2", areClose ? "-translate-y-12 bg-white px-2 py-0.5 rounded shadow-sm" : "")}>
                  META
                </span>
              </motion.div>

              <motion.div 
                initial={{ left: "0%" }}
                animate={{ left: `${actualPos}%` }}
                className="absolute top-0 flex flex-col items-center -translate-x-1/2 z-10"
              >
                <div className="w-1.5 sm:w-2 h-10 sm:h-12 bg-on-surface rounded-full shadow-lg ring-4 ring-white"></div>
                <span className="text-[8px] sm:text-[10px] font-black text-on-surface mt-2">ACTUAL</span>
              </motion.div>
            </div>
          </div>
          <div className="w-full md:w-64 aspect-square rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl hidden md:block">
            <img 
              alt="Health journey" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2tgnU_6iGRhR9Gc9UMd8Nw8c4Ixh8D9ZuawC1sCTVz1L5ent3IDTIWNneG_zqe394t2-s3bzd7LSh9MRGrBcNUCPOBjWEsiI7cbtSws0JsSU0bvYznfzCqr6HXd4d5TMg2h8rkCiYMXHhJ065Lfg-W9gG0D76LbzF1RlZKrdKPP9Dc3SIGdI3aSjwaQuViTziHbeYsgB2iOteBOTh0XI4LcQ38h_mX01V_BydXHwGWdtfWlow3leX8taKXltmxbl2fJiwJtXvDxY" 
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.section>

        {/* Calorie Card */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="col-span-12 lg:col-span-4 bg-surface-container-lowest rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 shadow-sm flex flex-col justify-between editorial-shadow border border-surface-container-high"
        >
          <div className="w-full flex flex-col items-center">
            <h2 className="text-xl sm:text-2xl font-bold text-primary mb-8 self-start">Energía Diaria</h2>
            <div className="relative flex items-center justify-center py-6 sm:py-8 w-full">
              <svg className="w-40 h-40 sm:w-48 sm:h-48 -rotate-90" viewBox="0 0 160 160">
                <circle className="text-surface-container-high" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeWidth="12" />
                <motion.circle 
                  initial={{ strokeDashoffset: 440 }}
                  animate={{ strokeDashoffset: 440 - (440 * caloriePercent / 100) }}
                  transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
                  className="text-primary" 
                  cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeDasharray="440" strokeLinecap="round" strokeWidth="12" 
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl sm:text-5xl font-black tracking-tighter text-on-surface">{remainingCalories.toLocaleString()}</span>
                <span className="text-[10px] text-on-surface-variant uppercase tracking-[0.2em] font-black mt-1">Restantes</span>
              </div>
            </div>
            <div className="mt-8 space-y-3 sm:space-y-4 w-full">
              <div className="flex justify-between items-center p-4 sm:p-5 bg-surface-container-low rounded-[1.5rem]">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Consumido</span>
                <span className="text-base sm:text-lg font-black">{consumedCalories} kcal</span>
              </div>
              <div className="flex justify-between items-center p-4 sm:p-5 bg-primary/5 border border-primary/10 rounded-[1.5rem]">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Objetivo</span>
                <span className="text-base sm:text-lg font-black text-primary">{targetCalories} kcal</span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Macros */}
        <section className="col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[
            { label: 'Proteína', value: `${consumedProtein}g`, target: '115g', percent: Math.min(100, (consumedProtein/115)*100), icon: Utensils, color: 'primary' as const },
            { label: 'Carbohidratos', value: `${consumedCarbs}g`, target: '250g', percent: Math.min(100, (consumedCarbs/250)*100), icon: Wheat, color: 'secondary' as const },
            { label: 'Grasas', value: `${consumedFats}g`, target: '70g', percent: Math.min(100, (consumedFats/70)*100), icon: Droplet, color: 'tertiary' as const },
          ].map((macro, i) => {
            const colorClasses = {
              primary: {
                bg: 'bg-primary',
                text: 'text-primary',
                container: 'bg-primary-container',
              },
              secondary: {
                bg: 'bg-secondary',
                text: 'text-secondary',
                container: 'bg-secondary-container',
              },
              tertiary: {
                bg: 'bg-tertiary',
                text: 'text-tertiary',
                container: 'bg-tertiary-container',
              },
            };
            const classes = colorClasses[macro.color];
            return (
              <motion.div 
                key={macro.label} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + (i * 0.1) }}
                className="bg-white rounded-[2rem] p-6 sm:p-8 editorial-shadow border border-surface-container-high group hover:border-primary transition-all"
              >
                <div className="flex justify-between items-start mb-6 sm:mb-8">
                  <div className={cn("w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500", classes.container)}>
                    <macro.icon size={24} className={classes.text} />
                  </div>
                  <span className={cn("text-[10px] font-black px-3 py-1 rounded-full", classes.container, classes.text)}>{Math.round(macro.percent)}%</span>
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2">{macro.label}</p>
                <p className="text-2xl sm:text-4xl font-black text-on-surface tracking-tighter">{macro.value} <span className="text-sm font-normal text-on-surface-variant tracking-normal">/ {macro.target}</span></p>
                <div className="mt-6 sm:mt-8 h-3 sm:h-4 bg-surface-container-high rounded-full overflow-hidden p-1 shadow-inner">
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: `${macro.percent}%` }}
                    transition={{ duration: 1.5, delay: 0.8 + (i * 0.1) }}
                    className={cn("h-full rounded-full shadow-sm", classes.bg)} 
                  />
                </div>
              </motion.div>
            );
          })}
        </section>
      </div>
    </div>
  );
}
