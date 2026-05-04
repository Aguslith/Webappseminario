import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Plus, 
  Trash2, 
  ChevronRight, 
  Clock, 
  Flame, 
  Utensils, 
  Wheat, 
  Droplet,
  X,
  Check,
  SearchIcon,
  PlusCircle,
  Globe,
  Leaf,
  Info
} from 'lucide-react';
import { playClick, playSuccess, playError } from '../lib/sounds';
import { cn } from '../lib/utils';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { FoodEntry } from '../App';

interface FoodLogProps {
  userProfile: any;
  dailyFoods: FoodEntry[];
  onFoodAdded: () => void;
  foodsList: any[]; // The food database from Firestore
}

export default function FoodLog({ userProfile, dailyFoods, onFoodAdded, foodsList }: FoodLogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState('Desayuno');
  const [showAddForm, setShowAddForm] = useState(false);
  
  // New food form state
  const [newFood, setNewFood] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: ''
  });

  const meals = [
    { id: 'Desayuno', icon: '🌅', color: 'bg-orange-500' },
    { id: 'Almuerzo', icon: '☀️', color: 'bg-yellow-500' },
    { id: 'Merienda', icon: '☕', color: 'bg-amber-500' },
    { id: 'Cena', icon: '🌙', color: 'bg-indigo-500' },
  ];

  // Filtering logic
  const filteredFoods = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return foodsList.filter(food => 
      food.name.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5);
  }, [searchQuery, foodsList]);

  const addFoodToLog = async (food: any) => {
    if (!auth.currentUser) return;
    playClick();
    try {
      await addDoc(collection(db, 'regimen_alimenticio'), {
        userId: auth.currentUser.uid,
        name: food.name,
        calories: Number(food.calories),
        protein: Number(food.protein),
        carbs: Number(food.carbs),
        fats: Number(food.fats),
        mealType: selectedMeal,
        timestamp: serverTimestamp()
      });
      playSuccess();
      setSearchQuery('');
    } catch (e) {
      console.error(e);
      playError();
    }
  };

  const handleRegisterFood = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFood.name || !newFood.calories) return;
    playClick();
    try {
      await addDoc(collection(db, 'foods'), {
        name: newFood.name,
        calories: Number(newFood.calories),
        protein: Number(newFood.protein || 0),
        carbs: Number(newFood.carbs || 0),
        fats: Number(newFood.fats || 0),
        createdAt: serverTimestamp()
      });
      playSuccess();
      setShowAddForm(false);
      setNewFood({ name: '', calories: '', protein: '', carbs: '', fats: '' });
    } catch (e) {
      playError();
    }
  };

  const handleDelete = async (id: string) => {
    playClick();
    try {
      await deleteDoc(doc(db, 'regimen_alimenticio', id));
    } catch (e) {
      playError();
    }
  };

  const groupedFoods = meals.map(meal => {
    const items = dailyFoods.filter(f => f.mealType === meal.id);
    const totalCals = items.reduce((acc, curr) => acc + curr.calories, 0);
    return { ...meal, items, totalCalories: totalCals };
  });

  const totalCals = dailyFoods.reduce((acc, curr) => acc + curr.calories, 0);
  const totalProt = dailyFoods.reduce((acc, curr) => acc + curr.protein, 0);

  return (
    <div className="space-y-8 sm:space-y-12 pb-20 px-2 sm:px-0">
      <header className="max-w-4xl">
        <h1 className="text-4xl sm:text-6xl font-black text-on-surface tracking-tighter mb-4">Diario de <span className="text-primary italic">Nutrición</span></h1>
        <p className="text-sm sm:text-xl text-on-surface-variant leading-relaxed">Registra tus comidas y mantén el equilibrio perfecto para tu meta de {userProfile.pesoIdeal || userProfile.peso}kg.</p>
      </header>

      <div className="grid grid-cols-12 gap-6 sm:gap-10">
        
        {/* Left Column: Input & Stats */}
        <div className="col-span-12 lg:col-span-5 space-y-6 sm:space-y-10">
          <section className="bg-white rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 editorial-shadow border border-surface-container-high relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-primary/20"></div>
            
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-8 sm:mb-10">
              {meals.map(meal => (
                <button
                  key={meal.id}
                  onClick={() => { playClick(); setSelectedMeal(meal.id); }}
                  className={cn(
                    "px-4 sm:px-5 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-bold transition-all",
                    selectedMeal === meal.id 
                      ? "bg-primary text-white shadow-lg shadow-primary/20" 
                      : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
                  )}
                >
                  <span className="mr-2">{meal.icon}</span> {meal.id}
                </button>
              ))}
            </div>

            <div className="relative mb-6">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
              <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar alimento (ej: Atún, Arroz...)"
                className="w-full bg-surface-container-low rounded-2xl py-4 sm:py-5 pl-14 pr-6 text-sm sm:text-base font-bold border-none focus:ring-4 focus:ring-primary/10 transition-all outline-none"
              />
            </div>

            <AnimatePresence>
              {searchQuery && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-2 mb-6"
                >
                  {filteredFoods.length > 0 ? (
                    filteredFoods.map(food => (
                      <button 
                        key={food.id}
                        onClick={() => addFoodToLog(food)}
                        className="w-full flex items-center justify-between p-4 bg-primary/5 rounded-2xl hover:bg-primary/10 transition-all text-left group border border-transparent hover:border-primary/20"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                            <Plus size={20} className="text-primary" />
                          </div>
                          <div>
                            <p className="font-bold text-sm sm:text-base">{food.name}</p>
                            <p className="text-[10px] sm:text-xs text-on-surface-variant uppercase tracking-widest font-black">{food.calories} kcal • {food.protein}g Proteína</p>
                          </div>
                        </div>
                        <ChevronRight size={20} className="text-primary opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                      </button>
                    ))
                  ) : (
                    <div className="p-8 text-center bg-surface-container-low rounded-3xl border-2 border-dashed border-surface-container-high">
                      <p className="text-sm font-bold text-on-surface-variant mb-4">No encontramos "{searchQuery}"</p>
                      <button 
                        onClick={() => setShowAddForm(true)}
                        className="bg-primary text-white px-6 py-3 rounded-xl font-bold text-xs hover:opacity-90 transition-opacity"
                      >
                        Registrar Alimento Nuevo
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-surface-container-high mt-6">
              <div className="flex-1 p-4 bg-surface-container-low rounded-2xl">
                <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Total Hoy</p>
                <p className="text-2xl font-black text-primary">{totalCals} <span className="text-xs font-normal opacity-40 uppercase">kcal</span></p>
              </div>
              <div className="flex-1 p-4 bg-surface-container-low rounded-2xl">
                <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Proteínas</p>
                <p className="text-2xl font-black text-secondary">{totalProt} <span className="text-xs font-normal opacity-40 uppercase">g</span></p>
              </div>
            </div>
          </section>

          {/* New Food Modal */}
          <AnimatePresence>
            {showAddForm && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-on-surface/40 backdrop-blur-md">
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="w-full max-w-lg bg-white rounded-[2.5rem] sm:rounded-[3rem] p-8 sm:p-10 editorial-shadow relative overflow-hidden"
                >
                  <button onClick={() => setShowAddForm(false)} className="absolute top-8 right-8 text-on-surface-variant hover:text-on-surface transition-colors"><X size={24}/></button>
                  <h2 className="text-3xl font-black tracking-tighter mb-2">Registrar Comida</h2>
                  <p className="text-on-surface-variant text-sm mb-8 leading-relaxed">
                    Consulta valores verídicos en <a href="https://www.argenfood.unlu.edu.ar/" target="_blank" className="text-primary font-bold hover:underline">Argenfood</a> o <a href="https://www.fatsecret.com.ar/" target="_blank" className="text-primary font-bold hover:underline">FatSecret</a>.
                  </p>
                  
                  <form onSubmit={handleRegisterFood} className="space-y-4">
                    <input 
                      placeholder="Nombre del alimento (ej: Pollo a la plancha)" 
                      className="w-full bg-surface-container-low rounded-2xl p-5 font-bold outline-none border-2 border-transparent focus:border-primary/20 transition-all"
                      value={newFood.name}
                      onChange={e => setNewFood({...newFood, name: e.target.value})}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input placeholder="Calorías" type="number" className="bg-surface-container-low rounded-2xl p-5 font-bold outline-none" value={newFood.calories} onChange={e => setNewFood({...newFood, calories: e.target.value})} />
                      <input placeholder="Proteína (g)" type="number" className="bg-surface-container-low rounded-2xl p-5 font-bold outline-none" value={newFood.protein} onChange={e => setNewFood({...newFood, protein: e.target.value})} />
                      <input placeholder="Carbos (g)" type="number" className="bg-surface-container-low rounded-2xl p-5 font-bold outline-none" value={newFood.carbs} onChange={e => setNewFood({...newFood, carbs: e.target.value})} />
                      <input placeholder="Grasas (g)" type="number" className="bg-surface-container-low rounded-2xl p-5 font-bold outline-none" value={newFood.fats} onChange={e => setNewFood({...newFood, fats: e.target.value})} />
                    </div>
                    <button type="submit" className="w-full py-5 bg-primary text-white rounded-[1.5rem] font-black text-lg shadow-xl shadow-primary/20 hover:opacity-90 transition-opacity mt-4">Guardar en Base de Datos</button>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: The Journal */}
        <div className="col-span-12 lg:col-span-7 space-y-8 sm:space-y-12">
          {groupedFoods.map((meal) => (
            <div key={meal.id} className="relative pl-6 sm:pl-10 border-l-2 border-surface-container-high pb-4">
              <div className={cn("absolute -left-[11px] top-0 w-5 h-5 rounded-full ring-4 ring-white shadow-md", meal.color)}></div>
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6 sm:mb-8">
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tighter">{meal.id}</h3>
                  <span className="text-[10px] font-black px-3 py-1 bg-surface-container-high rounded-full uppercase tracking-widest">{meal.items.length} items</span>
                </div>
                <div className="flex items-center gap-1.5 text-on-surface-variant">
                  <Flame size={16} className="text-primary" />
                  <span className="font-black text-lg sm:text-xl tracking-tighter">{meal.totalCalories} <span className="text-xs font-normal opacity-40 uppercase">kcal</span></span>
                </div>
              </div>
              
              <div className="space-y-4 sm:space-y-5">
                {meal.items.length > 0 ? (
                  meal.items.map((item) => (
                    <motion.div 
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-white p-4 sm:p-5 rounded-[1.5rem] sm:rounded-[2rem] shadow-sm flex items-center justify-between editorial-shadow group hover:ring-2 hover:ring-primary/10 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-surface-container-low flex items-center justify-center text-primary font-black text-lg sm:text-2xl">
                          {item.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-sm sm:text-base leading-tight">{item.name}</p>
                          <p className="text-[10px] sm:text-xs text-on-surface-variant font-bold mt-1">
                            {item.calories} kcal • {item.protein}g P • {item.carbs}g C
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-3 text-on-surface-variant/20 hover:text-red-500 hover:bg-red-50 transition-all rounded-2xl"
                      >
                        <Trash2 size={20} />
                      </button>
                    </motion.div>
                  ))
                ) : (
                  <div className="py-8 sm:py-10 px-6 sm:px-8 bg-surface-container-low/30 rounded-[2rem] border-2 border-dashed border-surface-container-high flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-on-surface-variant/20 mb-4">
                      <Utensils size={24} />
                    </div>
                    <p className="text-sm font-bold text-on-surface-variant/40">Sin registros para {meal.id.toLowerCase()}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
