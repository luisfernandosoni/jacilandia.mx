
import React, { useState, useTransition, Suspense, useCallback, memo, lazy, createContext, useContext, useDeferredValue, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ViewState, DESIGN_SYSTEM, PerformanceProfile, VIEW_THEMES } from './types';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';

// --- GLOBAL DATA COORDINATOR ---
const DataCacheContext = createContext<{
  cache: Record<string, any>;
  setCache: (key: string, data: any) => void;
  prefetch: (key: string, fetcher: () => Promise<any>) => void;
}>({ cache: {}, setCache: () => {}, prefetch: () => {} });

export const useDataCache = () => useContext(DataCacheContext);

const PerformanceContext = createContext<PerformanceProfile>(PerformanceProfile.HIGH);
export const usePerformance = () => useContext(PerformanceContext);

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

// --- ATMOSPHERIC UTILS ---
export const applyAtmosphere = (view: ViewState) => {
  const theme = VIEW_THEMES[view];
  const root = document.documentElement;
  root.style.setProperty('--theme-primary', theme.primary);
  root.style.setProperty('--theme-secondary', theme.secondary);
  root.style.setProperty('--theme-accent', theme.accent);
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  const [isPending, startTransition] = useTransition();
  const [perfProfile, setPerfProfile] = useState<PerformanceProfile>(PerformanceProfile.HIGH);
  const [dataCache, setDataCache] = useState<Record<string, any>>({});
  const mainContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial atmosphere
    applyAtmosphere(currentView);
    
    const detectPerformance = () => {
      const memory = (navigator as any).deviceMemory || 8;
      const cores = navigator.hardwareConcurrency || 4;
      const connection = (navigator as any).connection;
      const isWeak = connection && (connection.saveData || /2g|3g/.test(connection.effectiveType));

      if (memory < 4 || cores < 4 || isWeak) {
        setPerfProfile(PerformanceProfile.LITE);
        document.getElementById('mesh-bg')?.style.setProperty('display', 'none');
      }
    };
    detectPerformance();
  }, []);

  const setCacheValue = useCallback((key: string, data: any) => {
    setDataCache(prev => ({ ...prev, [key]: data }));
  }, []);

  const prefetchData = useCallback((key: string, fetcher: () => Promise<any>) => {
    if (dataCache[key]) return;
    fetcher().then(data => setCacheValue(key, data)).catch(() => {});
  }, [dataCache, setCacheValue]);

  const handleViewChange = useCallback((view: ViewState) => {
    if (currentView === view) return;
    
    // Smooth transition of atmosphere BEFORE the react transition for perceived speed
    applyAtmosphere(view);
    
    startTransition(() => {
      setCurrentView(view);
    });
  }, [currentView]);

  return (
    <DataCacheContext.Provider value={{ cache: dataCache, setCache: setCacheValue, prefetch: prefetchData }}>
      <PerformanceContext.Provider value={perfProfile}>
        <NavigationContext.Provider value={{ currentView, navigateTo: handleViewChange }}>
          <div className={`min-h-screen flex flex-col font-body selection:bg-primary/20 transition-colors duration-700 ${isPending ? 'bg-slate-50' : 'bg-surface'}`}>
            <Navigation currentView={currentView} onChangeView={handleViewChange} />
            
            <main id="main-content" ref={mainContentRef} className="flex-grow relative overflow-x-clip outline-none">
              <AnimatePresence mode="wait" initial={false} onExitComplete={() => window.scrollTo(0, 0)}>
                <motion.div
                  key={currentView}
                  initial={perfProfile === PerformanceProfile.HIGH ? { opacity: 0, y: 15, scale: 0.99, filter: 'blur(8px)' } : { opacity: 0 }}
                  animate={perfProfile === PerformanceProfile.HIGH ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' } : { opacity: 1 }}
                  exit={perfProfile === PerformanceProfile.HIGH ? { opacity: 0, y: -15, scale: 1.01, filter: 'blur(8px)', transition: { duration: 0.3, ease: [0.32, 0, 0.67, 0] } } : { opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
                  className="w-full will-change-[transform,opacity]"
                >
                  <Suspense fallback={null}>
                    {(() => {
                      const deferredView = useDeferredValue(currentView);
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
                    })()}
                  </Suspense>
                </motion.div>
              </AnimatePresence>
            </main>
            <Footer />
          </div>
        </NavigationContext.Provider>
      </PerformanceContext.Provider>
    </DataCacheContext.Provider>
  );
};

export const prewarmView = (view: ViewState) => {
  const prewarm = () => {
    const loader = VIEW_LOADERS[view];
    if (loader) loader();
  };
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(prewarm, { timeout: 2000 });
  } else {
    setTimeout(prewarm, 100);
  }
};

export default App;
