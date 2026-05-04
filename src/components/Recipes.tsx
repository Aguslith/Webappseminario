import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Clock, 
  Flame, 
  ArrowRight, 
  Dumbbell, 
  ChefHat, 
  Search,
  Sparkles,
  Utensils,
  Globe,
  X
} from 'lucide-react';
import { playClick, playTransition } from '../lib/sounds';
import { cn } from '../lib/utils';

export default function Recipes() {
  const [ingredients, setIngredients] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState<any>(null);

  const mockRecipes = [
    {
      id: 'reg-1',
      title: 'Polenta Cremosa con Tuco',
      time: '25 min',
      calories: '450 kcal',
      protein: '12g',
      type: 'Regional Argentino',
      ingredients: ['polenta', 'tomate', 'carne'],
      description: 'Un clásico reconfortante de la cocina argentina. Ideal para días frescos y con ingredientes económicos.',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMQaI8iCE3UUNMTOWa7tq3VONNBHHAtWT8QsYopS3ILp0bdg7NwCheMoihc9Pzt_NmtbBlu_egy1HZKMAr8psegLgeJcK_VUhtWM_7eMnJn6s2ylm8f-a3DMEn2PY1L4yrLeEOMm-GDv_grFwMHo0D6DziqpWH2rpMGakZuMpNzc4L0M_VRn6DkThrURh5x9yMgy3TLx96InJQ7BBXui9bT8vujTx5WcGZ3Q30rfgBS2P9h6qlQ7gRnqGYv3DYZN6hDSNFwbpSgEg'
    },
    {
      id: 'reg-2',
      title: 'Ensalada Rápida de Atún y Arroz',
      time: '10 min',
      calories: '380 kcal',
      protein: '22g',
      type: 'Económico / Rápido',
      ingredients: ['atun', 'arroz', 'zanahoria'],
      description: 'Una opción fresca, proteica y súper accesible para el almuerzo. Usa zanahoria rallada para mayor textura.',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRJr_coHVvbae3HfdIF7gOdqEVgQ4Dxbu2A6z8JrGbmv0d_clUoQRilyD4kDusNyj8DZlFhAthH2PdN-wyIpM9niPgL69RgnuN5LrrLmpeIWTR0NNkDY5pLln1UnOZRk0UsjxSE93rVQWW0PRyNwyOimctrF_Yl4DfJMTIlCCFVnHD5YLddLHMD0-5XhEhvv9-D89TiEDhP08MkO89qtQfsD2LDvE9lOk39IGqXH5WLVdIRYpHWk4xr24uucLQgSax9dd3qGTDTCU'
    }
  ];

  const handleGenerate = () => {
    if (!ingredients.trim()) return;
    playClick();
    setIsGenerating(true);
    
    setTimeout(() => {
      playTransition();
      setIsGenerating(false);
      const found = mockRecipes.find(r => 
        r.ingredients.some(i => ingredients.toLowerCase().includes(i))
      );
      setGeneratedRecipe(found || mockRecipes[0]);
    }, 1500);
  };

  return (
    <div className="space-y-10 sm:space-y-12 pb-20 px-2 sm:px-0">
      <header className="max-w-4xl">
        <div className="flex items-center gap-2 sm:gap-3 text-primary mb-2">
          <ChefHat size={24} sm-size={32} />
          <span className="font-black uppercase tracking-[0.2em] text-[10px] sm:text-sm">Chef Inteligente</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-on-surface tracking-tighter mb-4 sm:mb-6 leading-none">
          Generador de <span className="text-primary italic">Recetas</span>
        </h1>
        <p className="text-base sm:text-xl text-on-surface-variant leading-relaxed max-w-2xl">
          ¿Qué tienes en la heladera? Ingresa los ingredientes y te sugeriremos el mejor plato regional o económico.
        </p>
      </header>

      {/* Ingredient Input Section */}
      <section className="bg-surface-container-low p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] editorial-shadow border border-surface-container-high relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 space-y-6 sm:space-y-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative group">
              <Search className="absolute left-5 sm:left-6 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary" size={20} sm-size={24} />
              <input 
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder="Ej: atún, arroz, zanahoria..."
                className="w-full bg-white rounded-2xl sm:rounded-3xl py-4 sm:py-6 pl-14 sm:pl-16 pr-6 text-sm sm:text-lg font-bold border-none shadow-sm focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>
            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-8 sm:px-10 py-4 sm:py-6 signature-gradient text-white rounded-2xl sm:rounded-3xl font-black text-base sm:text-lg flex items-center justify-center gap-3 hover:opacity-90 transition-all disabled:opacity-50 shadow-xl"
            >
              {isGenerating ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Sparkles size={20} sm-size={24} />
                  <span>Sugerir Plato</span>
                </>
              )}
            </button>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mr-2">Estilos:</span>
            {['Regional Argentino', 'Económico', 'Express'].map(style => (
              <button key={style} className="px-3 py-1.5 rounded-full bg-white text-[10px] sm:text-xs font-bold text-primary border border-primary/10 hover:bg-primary hover:text-white transition-all">
                {style}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 items-center pt-4 border-t border-surface-container-high">
            <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Fuentes:</span>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <a href="https://cookpad.com/ar/" target="_blank" className="text-[10px] sm:text-xs font-bold text-secondary flex items-center gap-1 hover:underline">
                <Globe size={12} /> Cookpad AR
              </a>
              <a href="https://www.pulicocina.com/" target="_blank" className="text-[10px] sm:text-xs font-bold text-secondary flex items-center gap-1 hover:underline">
                <Globe size={12} /> Puli Cocina
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <AnimatePresence mode="wait">
        {generatedRecipe && (
          <motion.section 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center"
          >
            <div className="lg:col-span-5 rounded-[2rem] sm:rounded-[3rem] overflow-hidden aspect-square sm:aspect-auto sm:h-[400px] lg:h-full editorial-shadow relative">
              <img 
                src={generatedRecipe.img} 
                alt={generatedRecipe.title}
                className="w-full h-full object-cover"
              />
              <button 
                onClick={() => setGeneratedRecipe(null)}
                className="absolute top-6 right-6 bg-white/20 backdrop-blur-md text-white p-3 rounded-2xl hover:bg-white/40 transition-all"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="lg:col-span-7 space-y-6 sm:space-y-8">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                    {generatedRecipe.type}
                  </span>
                  <div className="flex items-center gap-1 text-on-surface-variant text-[10px] font-bold">
                    <Clock size={12} /> {generatedRecipe.time}
                  </div>
                </div>
                <h2 className="text-3xl sm:text-5xl font-black tracking-tighter leading-tight">{generatedRecipe.title}</h2>
                <p className="text-base sm:text-xl text-on-surface-variant leading-relaxed">
                  {generatedRecipe.description}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 sm:gap-6">
                <div className="p-4 sm:p-6 bg-surface-container-low rounded-2xl sm:rounded-3xl border border-surface-container-high text-center">
                  <Flame className="mx-auto mb-2 text-primary" size={20} sm-size={24} />
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase mb-1">Cals</p>
                  <p className="text-sm sm:text-xl font-black">{generatedRecipe.calories.split(' ')[0]}</p>
                </div>
                <div className="p-4 sm:p-6 bg-surface-container-low rounded-2xl sm:rounded-3xl border border-surface-container-high text-center">
                  <Dumbbell className="mx-auto mb-2 text-secondary" size={20} sm-size={24} />
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase mb-1">Prot</p>
                  <p className="text-sm sm:text-xl font-black">{generatedRecipe.protein}</p>
                </div>
                <div className="p-4 sm:p-6 bg-surface-container-low rounded-2xl sm:rounded-3xl border border-surface-container-high text-center">
                  <Utensils className="mx-auto mb-2 text-on-surface-variant" size={20} sm-size={24} />
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase mb-1">Chef</p>
                  <p className="text-sm sm:text-xl font-black text-secondary">Fácil</p>
                </div>
              </div>

              <div className="flex gap-3 sm:gap-4">
                <button className="flex-1 bg-primary text-white py-4 sm:py-5 rounded-2xl font-black text-base sm:text-lg shadow-lg hover:opacity-90 transition-all">
                  Ver Paso a Paso
                </button>
                <button className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-2 border-surface-container-high flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-all">
                  <Heart size={24} />
                </button>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Featured Grid */}
      {!generatedRecipe && (
        <section className="space-y-8 sm:space-y-10">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-1">Inspiración</p>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tighter">Descubrimientos</h2>
            </div>
            <button className="text-primary text-xs sm:text-sm font-bold flex items-center gap-1 hover:translate-x-2 transition-transform">
              Todo <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8">
            {[
              { title: 'Tarta de Atún Económica', time: '35m', cals: '420 kcal', type: 'Almuerzo', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXD6M6qcYY9bY6V7vccNEs3I4U9EFJPW2ts3FENvaV1KzOH2xGUIDLGulAlCOOmnhe8CHC1kBtv9lT9ntS5tEv9Ufx6BsISJrO9Uyc4qOfTPKl3KhrmCUeiGz5woYe5jM3bUM-W44ZiIuWNN-C6Nuz91M0xwMlREoY9U1jdYkwser4t6mVsUyEHz7-wc8Ye2BgwFaCFZyUWOOnrfyYCA0AeMfp3qMiAEJ5ZbjtyG_IjN4SuvqgulXuLpj6QrjWN54Erm9Gq0EsC3o' },
              { title: 'Risotto de Polenta', time: '20m', cals: '380 kcal', type: 'Cena', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRJr_coHVvbae3HfdIF7gOdqEVgQ4Dxbu2A6z8JrGbmv0d_clUoQRilyD4kDusNyj8DZlFhAthH2PdN-wyIpM9niPgL69RgnuN5LrrLmpeIWTR0NNkDY5pLln1UnOZRk0UsjxSE93rVQWW0PRyNwyOimctrF_Yl4DfJMTIlCCFVnHD5YLddLHMD0-5XhEhvv9-D89TiEDhP08MkO89qtQfsD2LDvE9lOk39IGqXH5WLVdIRYpHWk4xr24uucLQgSax9dd3qGTDTCU' }
            ].map((recipe, i) => (
              <motion.div key={i} whileHover={{ y: -5 }} className="bg-white rounded-[2rem] overflow-hidden shadow-sm editorial-shadow flex flex-col sm:flex-row h-full">
                <div className="w-full sm:w-48 h-48 sm:h-auto overflow-hidden">
                  <img src={recipe.img} alt={recipe.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-5 sm:p-6 flex-1 space-y-3">
                  <span className="text-[10px] font-black uppercase text-primary bg-primary/5 px-2 py-1 rounded">{recipe.type}</span>
                  <h3 className="text-lg sm:text-xl font-bold leading-tight">{recipe.title}</h3>
                  <div className="flex items-center gap-3 text-[10px] sm:text-xs font-bold text-on-surface-variant">
                    <span className="flex items-center gap-1"><Clock size={12} /> {recipe.time}</span>
                    <span className="flex items-center gap-1 text-primary"><Flame size={12} /> {recipe.cals}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
