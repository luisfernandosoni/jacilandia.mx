
import React, { useState, useTransition, Suspense, useCallback, memo, lazy, createContext, useContext, useDeferredValue, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ViewState, DESIGN_SYSTEM, PerformanceProfile, VIEW_THEMES, JACI_SQUAD } from './types';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { Meta } from './components/Meta';

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
  [ViewState.ADMIN]: () => import('./views/AdminView'),
  [ViewState.PRIVACY]: () => import('./views/PrivacyView'),
  [ViewState.RESET_PASSWORD]: () => import('./views/DashboardView'), // Reuse Dashboard for Auth flows
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
const AdminView = lazy(() => VIEW_LOADERS[ViewState.ADMIN]());
const PrivacyView = lazy(() => VIEW_LOADERS[ViewState.PRIVACY]().then(m => ({ default: m.PrivacyView })));

// --- ATMOSPHERIC UTILS ---
export const applyAtmosphere = (view: ViewState) => {
  const theme = VIEW_THEMES[view];
  const root = document.documentElement;
  root.style.setProperty('--theme-primary', theme.primary);
  root.style.setProperty('--theme-secondary', theme.secondary);
  root.style.setProperty('--theme-accent', theme.accent);
};

// --- PREDICTIVE ASSET WARMER ---
const warmUpAssets = (perf: PerformanceProfile) => {
  if (typeof window === 'undefined') return;

  const CRITICAL_ASSETS = [
    JACI_SQUAD.GULY, JACI_SQUAD.LY, JACI_SQUAD.POMPIN, JACI_SQUAD.PEPE,
    "https://assets.jacilandia.mx/JessydeJACI.jpg"
  ];

  const getUrl = (src: string, width: number) => {
    const cleanPath = src.replace('https://assets.jacilandia.mx', '');
    const finalPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
    const sourceImage = src.includes('jacilandia.mx') ? `https://assets.jacilandia.mx${finalPath}` : src;
    const quality = perf === PerformanceProfile.LITE ? 60 : 75;
    return `/cdn-cgi/image/width=${width},quality=${quality},format=auto/${sourceImage}`;
  };

  const task = () => {
    CRITICAL_ASSETS.forEach(src => {
      [400, 1280].forEach(width => {
        const url = getUrl(src, width);
        const img = new Image();
        img.src = url; 
      });
    });
  };

  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(task, { timeout: 5000 });
  } else {
    setTimeout(task, 3000);
  }
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  const [isPending, startTransition] = useTransition();
  const [perfProfile, setPerfProfile] = useState<PerformanceProfile>(PerformanceProfile.HIGH);
  const [dataCache, setDataCache] = useState<Record<string, any>>({});
  const mainContentRef = useRef<HTMLDivElement>(null);
  const deferredView = useDeferredValue(currentView);

  const handleViewChange = useCallback((view: ViewState) => {
    if (currentView === view) return;
    applyAtmosphere(view);
    startTransition(() => {
      setCurrentView(view);
    });
  }, [currentView]);

  useEffect(() => {
    // Initial atmosphere
    applyAtmosphere(currentView);

    // Initial user fetch
    prefetchData('user', () => fetch('/api/user').then(r => r.json()));
    
    // Performance detection
    const detectPerformance = () => {
      const memory = (navigator as any).deviceMemory || 8;
      const cores = navigator.hardwareConcurrency || 4;
      const connection = (navigator as any).connection;
      const isWeak = connection && (connection.saveData || /2g|3g/.test(connection.effectiveType));

      if (memory < 4 || cores < 4 || isWeak) {
        setPerfProfile(PerformanceProfile.LITE);
        document.getElementById('mesh-bg')?.style.setProperty('display', 'none');
      } else {
        warmUpAssets(PerformanceProfile.HIGH);
      }
    };
    detectPerformance();

    // URL View listener for jacilandia.mx/privacidad style (using params for SPA)
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view') as ViewState;
    if (viewParam && Object.values(ViewState).includes(viewParam)) {
      handleViewChange(viewParam);
    }

    if (params.get('payment') === 'success') {
      setSuccessMessage("¡Pago completado con éxito! Bienvenido a la bóveda.");
      // Atmosphere shift to primary (success color)
      applyAtmosphere(currentView);
      window.history.replaceState({}, '', window.location.pathname);
      setTimeout(() => setSuccessMessage(null), 5000);
    }
  }, []);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const setCacheValue = useCallback((key: string, data: any) => {
    setDataCache(prev => ({ ...prev, [key]: data }));
  }, []);

  const prefetchData = useCallback((key: string, fetcher: () => Promise<any>) => {
    if (dataCache[key]) return;
    fetcher()
      .then(data => setCacheValue(key, data))
      .catch(err => {
        console.error(`[DataCache] Prefetch failed for ${key}:`, err);
        setCacheValue(key, { error: err.message || "Error al obtener datos" });
      });
  }, [dataCache, setCacheValue]);

  return (
    <DataCacheContext.Provider value={{ cache: dataCache, setCache: setCacheValue, prefetch: prefetchData }}>
      <PerformanceContext.Provider value={perfProfile}>
        <NavigationContext.Provider value={{ currentView, navigateTo: handleViewChange }}>
          <div className={`min-h-screen flex flex-col font-body selection:bg-primary/20 transition-colors duration-700 ${isPending ? 'bg-slate-50' : 'bg-surface'}`}>
            <AnimatePresence>
              {successMessage && (
                <>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[190] bg-primary/5 backdrop-blur-md pointer-events-none"
                  />
                  <motion.div 
                    initial={{ opacity: 0, y: -60, scale: 0.8, filter: 'blur(20px)' }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 0.9, filter: 'blur(20px)', transition: { duration: 0.3 } }}
                    transition={DESIGN_SYSTEM.springs.snappy}
                    className="fixed top-32 left-1/2 -translate-x-1/2 z-[200] pr-10 pl-6 py-5 bg-white/70 backdrop-blur-3xl text-slate-900 rounded-[3rem] text-[0.75rem] font-black uppercase tracking-[0.25em] shadow-[0_40px_80px_-20px_rgba(37,192,244,0.3)] flex items-center gap-6 border border-white/40 group"
                  >
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white shadow-[0_0_20px_rgba(37,192,244,0.5)]">
                        <motion.span 
                          initial={{ scale: 0, rotate: -45 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
                          className="material-symbols-outlined text-xl filled"
                        >
                          auto_awesome
                        </motion.span>
                      </div>
                      <motion.div 
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute inset-0 bg-primary rounded-full blur-lg -z-10"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-primary text-[0.6rem] mb-1">Éxito Desbloqueado</span>
                      {successMessage}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
            <Navigation currentView={currentView} onChangeView={handleViewChange} />
            
            <main 
              id="main-content" 
              ref={mainContentRef} 
              className={`flex-grow relative overflow-x-clip outline-none transition-[min-height] duration-500 ease-in-out ${perfProfile === PerformanceProfile.HIGH ? 'min-h-[85vh]' : 'min-h-[70vh]'}`}
            >
              <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
                <motion.div
                  key={currentView}
                  initial={perfProfile === PerformanceProfile.HIGH ? { opacity: 0, y: 15, scale: 0.99, filter: 'blur(8px)' } : { opacity: 0 }}
                  animate={perfProfile === PerformanceProfile.HIGH ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' } : { opacity: 1 }}
                  exit={perfProfile === PerformanceProfile.HIGH ? { opacity: 0, y: -15, scale: 1.01, filter: 'blur(8px)', transition: { duration: 0.3, ease: [0.32, 0, 0.67, 0] } } : { opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
                  className="w-full will-change-[transform,opacity]"
                >
                  <Suspense fallback={<div className="w-full h-[60vh] flex items-center justify-center" aria-hidden="true" />}>
                    <>
                      <Meta view={deferredView} />
                      {(() => {
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
                          case ViewState.ADMIN: return <AdminView />;
                          case ViewState.PRIVACY: return <PrivacyView />;
                          case ViewState.RESET_PASSWORD: return <DashboardView />;
                          default: return <HomeView />;
                        }
                      })()}
                    </>
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
