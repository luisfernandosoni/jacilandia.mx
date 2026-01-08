
import React, { useState, useTransition, Suspense, useCallback, memo, lazy, createContext, useContext, useDeferredValue } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ViewState, DESIGN_SYSTEM, PerformanceProfile } from './types';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';

/**
 * Silicon Valley Standard: Main-Thread Task Scheduler
 * Optimization for React 19 concurrent rendering
 */
const scheduler = {
  yield: async () => {
    if ('scheduler' in window && (window as any).scheduler.yield) {
      return (window as any).scheduler.yield();
    }
    return new Promise(resolve => setTimeout(resolve, 0));
  },
  postTask: (task: () => void, priority: 'user-blocking' | 'user-visible' | 'background' = 'user-visible') => {
    if ('scheduler' in window && (window as any).scheduler.postTask) {
      return (window as any).scheduler.postTask(task, { priority });
    }
    return setTimeout(task, 0);
  }
};

const PerformanceContext = createContext<PerformanceProfile>(PerformanceProfile.HIGH);
export const usePerformance = () => useContext(PerformanceContext);

// Navigation Context for deep linking between views
interface NavContextType {
  navigateTo: (view: ViewState) => void;
  currentView: ViewState;
}
export const NavigationContext = createContext<NavContextType | null>(null);
export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) throw new Error("useNavigation must be used within NavigationProvider");
  return context;
};

const VIEW_LOADERS: Record<ViewState, () => Promise<any>> = {
  [ViewState.HOME]: () => import('./views/HomeView'),
  [ViewState.ABOUT]: () => import('./views/AboutView'),
  [ViewState.METHODOLOGY]: () => import('./views/MethodologyView'),
  [ViewState.LEVELS]: () => import('./views/LevelsView'),
  [ViewState.TESTIMONIALS]: () => import('./views/TestimonialsView'),
  [ViewState.LOCATIONS]: () => import('./views/LocationsView'),
  [ViewState.PRICING]: () => import('./views/PricingView'),
  [ViewState.REGISTER]: () => import('./views/RegisterView'),
  [ViewState.DASHBOARD]: () => import('./views/DashboardView'),
};

const HomeView = lazy(() => VIEW_LOADERS[ViewState.HOME]().then(m => ({ default: m.HomeView })));
const AboutView = lazy(() => VIEW_LOADERS[ViewState.ABOUT]().then(m => ({ default: m.AboutView })));
const MethodologyView = lazy(() => VIEW_LOADERS[ViewState.METHODOLOGY]().then(m => ({ default: m.MethodologyView })));
const TestimonialsView = lazy(() => VIEW_LOADERS[ViewState.TESTIMONIALS]().then(m => ({ default: m.TestimonialsView })));
const LocationsView = lazy(() => VIEW_LOADERS[ViewState.LOCATIONS]().then(m => ({ default: m.LocationsView })));
const PricingView = lazy(() => VIEW_LOADERS[ViewState.PRICING]().then(m => ({ default: m.PricingView })));
const LevelsView = lazy(() => VIEW_LOADERS[ViewState.LEVELS]().then(m => ({ default: m.LevelsView })));
const RegisterView = lazy(() => VIEW_LOADERS[ViewState.REGISTER]().then(m => ({ default: m.RegisterView })));
const DashboardView = lazy(() => VIEW_LOADERS[ViewState.DASHBOARD]().then(m => ({ default: m.DashboardView })));

export const prewarmView = (view: ViewState) => {
  const conn = (navigator as any).connection;
  if (conn && (conn.saveData || /2g/.test(conn.effectiveType))) return;

  scheduler.postTask(() => {
    const loader = VIEW_LOADERS[view];
    if (loader) loader();
  }, 'background');
};

const ViewRenderer = memo(({ view }: { view: ViewState }) => {
  const deferredView = useDeferredValue(view);
  
  switch (deferredView) {
    case ViewState.HOME: return <HomeView />;
    case ViewState.ABOUT: return <AboutView />;
    case ViewState.METHODOLOGY: return <MethodologyView />;
    case ViewState.LEVELS: return <LevelsView />;
    case ViewState.TESTIMONIALS: return <TestimonialsView />;
    case ViewState.LOCATIONS: return <LocationsView />;
    case ViewState.PRICING: return <PricingView />;
    case ViewState.REGISTER: return <RegisterView />;
    case ViewState.DASHBOARD: return <DashboardView />;
    default: return <HomeView />;
  }
});

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  const [isPending, startTransition] = useTransition();

  const handleViewChange = useCallback((view: ViewState) => {
    if (currentView === view) return;
    
    // SPRINT CORE: Iniciamos la transición de estado sin tocar el scroll aún.
    // Esto permite que la vista actual anime su salida desde su posición actual.
    startTransition(() => {
      setCurrentView(view);
    });
  }, [currentView]);

  return (
    <PerformanceContext.Provider value={PerformanceProfile.HIGH}>
      <NavigationContext.Provider value={{ currentView, navigateTo: handleViewChange }}>
        <div className={`min-h-screen flex flex-col font-body selection:bg-primary/20 transition-colors duration-700 ${isPending ? 'bg-slate-50' : 'bg-surface'}`}>
          <Navigation currentView={currentView} onChangeView={handleViewChange} />
          
          <main className="flex-grow relative overflow-x-clip">
            <AnimatePresence 
              mode="wait" 
              initial={false}
              onExitComplete={() => {
                // SPRINT CORE: El reset de scroll sucede AQUÍ.
                // Una vez que la vista anterior ha desaparecido por completo, 
                // movemos el viewport al top antes de que la nueva vista entre.
                window.scrollTo(0, 0);
              }}
            >
              <motion.div
                key={currentView}
                initial={{ opacity: 0, y: 15, scale: 0.99, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                exit={{ 
                  opacity: 0, 
                  y: -15, 
                  scale: 1.01, 
                  filter: 'blur(8px)',
                  transition: { 
                    duration: 0.3, 
                    ease: [0.32, 0, 0.67, 0] // Salida rápida y limpia
                  } 
                }}
                transition={{ 
                  duration: 0.5, 
                  ease: [0.22, 1, 0.36, 1], // Entrada suave
                  delay: 0.05 
                }}
                className="w-full will-change-[transform,opacity,filter]"
              >
                <Suspense fallback={null}>
                  <ViewRenderer view={currentView} />
                </Suspense>
              </motion.div>
            </AnimatePresence>
          </main>
          <Footer />
        </div>
      </NavigationContext.Provider>
    </PerformanceContext.Provider>
  );
};

export default App;
