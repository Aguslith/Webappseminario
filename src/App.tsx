/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  BookOpen, 
  User, 
  Plus, 
  LogOut, 
  HelpCircle,
  Menu,
  X,
  Loader2
} from 'lucide-react';
import { cn } from './lib/utils';
import { playClick, playTransition } from './lib/sounds';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "./lib/firebase";
import { doc, getDoc, collection, query, where, getDocs, Timestamp, onSnapshot } from "firebase/firestore";

// Views
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import FoodLog from './components/FoodLog';
import Recipes from './components/Recipes';
import Support from './components/Support';
import Profile from './components/Profile';
import AuthLanding from './components/AuthLanding';
import Login from './components/Login';

type View = 'auth-landing' | 'login' | 'onboarding' | 'dashboard' | 'log' | 'recipes' | 'profile' | 'support';

export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  mealType: string;
  timestamp: any;
  userId: string;
}

export default function App() {
  const [currentView, setCurrentView] = useState<View>('auth-landing');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [dailyFoods, setDailyFoods] = useState<FoodEntry[]>([]);
  const [userProfile, setUserProfile] = useState<{
    nombre: string;
    apellido: string;
    email: string;
    edad: string;
    peso: string;
    altura: string;
    pesoIdeal?: string;
    alergias: string[];
    uid?: string;
  } | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch Profile
        const userDoc = await getDoc(doc(db, "usuarios", user.uid));
        if (userDoc.exists()) {
          const profileData = { ...userDoc.data(), uid: user.uid } as any;
          setUserProfile(profileData);
          setCurrentView('dashboard');
        } else {
          setCurrentView('onboarding');
        }

        // Real-time Food Log
        const q = query(
          collection(db, "regimen_alimenticio"),
          where("userId", "==", user.uid)
        );

        const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
          const foods: FoodEntry[] = [];
          const todayStart = new Date();
          todayStart.setHours(0, 0, 0, 0);
          const tomorrowStart = new Date(todayStart);
          tomorrowStart.setDate(tomorrowStart.getDate() + 1);

          snapshot.forEach((doc) => {
            const data = doc.data();
            const timestamp = data.timestamp?.toDate();
            if (timestamp >= todayStart && timestamp < tomorrowStart) {
              foods.push({ id: doc.id, ...data } as FoodEntry);
            }
          });
          setDailyFoods(foods);
        }, (error) => {
          console.error("Error in foods snapshot:", error);
        });

        setIsLoaded(true);
        return () => {
          unsubscribeSnapshot();
        };
      } else {
        setUserProfile(null);
        setDailyFoods([]);
        setCurrentView('auth-landing');
        setIsLoaded(true);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const handleViewChange = (view: View) => {
    if (view === currentView) return;
    if (!userProfile && !['auth-landing', 'login', 'onboarding'].includes(view)) return;
    playTransition();
    setCurrentView(view);
    setIsSidebarOpen(false);
  };

  const handleLogout = async () => {
    playClick();
    try {
      await signOut(auth);
      setUserProfile(null);
      setCurrentView('auth-landing');
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Tablero', icon: LayoutDashboard },
    { id: 'log', label: 'Registrar Comida', icon: UtensilsCrossed },
    { id: 'recipes', label: 'Recetas', icon: BookOpen },
    { id: 'profile', label: 'Perfil', icon: User },
  ];

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-3xl bg-white shadow-xl flex items-center justify-center">
          <Loader2 className="text-primary animate-spin" size={32} />
        </div>
        <p className="text-primary font-black text-lg tracking-tighter uppercase animate-pulse">Organic Editorial</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-surface text-on-surface overflow-hidden">
      <AnimatePresence>
        {currentView === 'auth-landing' && (
          <AuthLanding onSelect={(mode) => setCurrentView(mode === 'login' ? 'login' : 'onboarding')} />
        )}
        {currentView === 'login' && (
          <Login 
            onBack={() => setCurrentView('auth-landing')} 
            onComplete={(data) => {
              setUserProfile({ ...data, uid: auth.currentUser?.uid });
              setCurrentView('dashboard');
            }} 
          />
        )}
      </AnimatePresence>

      {userProfile && (
        <>
          {/* Mobile Backdrop */}
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 z-[45] bg-on-surface/20 backdrop-blur-sm lg:hidden"
              />
            )}
          </AnimatePresence>

          <aside className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-surface p-6 flex flex-col transition-transform duration-300 lg:translate-x-0 editorial-shadow",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
        <div className="mb-10 flex items-center justify-between">
          <span className="text-primary font-black text-xl tracking-tighter">Organic Editorial</span>
          <button 
            className="lg:hidden p-2 text-on-surface-variant"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-8 flex items-center gap-3">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9l4P67ri8Y3yVvBXukWOWmuNaC151a0zgItWNycF8KXTfmmcudfeFlcpZy_oW_1tVOHHK76WNWvi4nIhqtksFoi4uUBjvsfvB2S31AVM0S5LmY-BiL2MVMkeRqp7i9MtxyVtilSYmDZNvpyt0EaLz37qmqUuL-FyR7QJpm6SiAuzNyJ071SWYySm-ET9M731TK0TyoPv3Mb1Imo1b9QTcDDsWDTwtY3DftJTuTQ-W2BJwnOIKI9OKy0wiAN9paCv2mxv71pGU8jc" 
            alt="User" 
            className="w-10 h-10 rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div>
            <p className="font-bold text-sm">Bienvenida, {userProfile.nombre}</p>
            <p className="text-on-surface-variant text-xs">Nutre tu día</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                playClick();
                handleViewChange(item.id as View);
              }}
              className={cn(
                "w-full flex items-center gap-3 p-4 rounded-2xl transition-all duration-300",
                currentView === item.id 
                  ? "bg-white text-primary shadow-sm font-bold translate-x-1" 
                  : "text-on-surface-variant hover:bg-white/50"
              )}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 space-y-4">
          <button 
            onClick={() => {
              playClick();
              handleViewChange('log');
            }}
            className="w-full signature-gradient text-white rounded-xl py-3 px-4 font-bold text-sm shadow-md hover:opacity-90 transition-opacity"
          >
            Añadir Comida Rápida
          </button>
          
          <div className="pt-4 border-t border-surface-container-high">
            <button 
              onClick={() => handleViewChange('support')}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-xl transition-all text-sm",
                currentView === 'support' ? "bg-primary/10 text-primary font-bold" : "text-on-surface-variant hover:bg-white/50"
              )}
            >
              <HelpCircle size={18} />
              <span>Soporte</span>
            </button>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-3 text-on-surface-variant hover:bg-white/50 rounded-xl transition-all text-sm"
            >
              <LogOut size={18} />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>
      </>
      )}

      <main className={cn(
        "flex-1 relative min-h-screen overflow-y-auto no-scrollbar transition-all duration-300",
        userProfile ? "lg:ml-72" : "lg:ml-0"
      )}>
        {userProfile && (
          <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-surface/80 backdrop-blur-md p-4 flex items-center justify-between border-b border-surface-container-high">
            <span className="text-primary font-black text-lg tracking-tighter">Organic Editorial</span>
            <button 
              className="p-2 text-on-surface-variant"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
          </header>
        )}

        <div className="p-6 lg:p-10 pt-20 lg:pt-10 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {currentView === 'onboarding' && (
                <div className="relative">
                  {!userProfile && (
                    <button 
                      onClick={() => setCurrentView('auth-landing')}
                      className="absolute top-0 left-0 z-50 p-2 text-on-surface-variant hover:text-primary transition-colors lg:-mt-4"
                    >
                      <ChevronLeft size={24} />
                    </button>
                  )}
                  <Onboarding onComplete={(data) => {
                    setUserProfile({ ...data, uid: auth.currentUser?.uid });
                    handleViewChange('dashboard');
                  }} />
                </div>
              )}
              {currentView === 'dashboard' && userProfile && (
                <Dashboard 
                  userProfile={userProfile} 
                  dailyFoods={dailyFoods} 
                />
              )}
              {currentView === 'log' && userProfile && (
                <FoodLog 
                  userProfile={userProfile} 
                  dailyFoods={dailyFoods} 
                  onFoodAdded={() => {}} 
                />
              )}
              {currentView === 'recipes' && <Recipes />}
              {currentView === 'support' && <Support />}
              {currentView === 'profile' && userProfile && (
                <Profile 
                  userProfile={userProfile} 
                  onUpdate={(data) => setUserProfile({ ...userProfile, ...data })} 
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {userProfile && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => playClick()}
            className="lg:hidden fixed bottom-8 right-8 w-14 h-14 signature-gradient text-white rounded-full shadow-2xl flex items-center justify-center z-40"
          >
            <Plus size={28} />
          </motion.button>
        )}
      </main>

      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-on-surface/20 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}


    </div>
  );
}

function ChevronLeft(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}


