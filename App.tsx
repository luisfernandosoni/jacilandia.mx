
import React, { useState, useTransition, Suspense, useCallback, memo, lazy, useEffect, createContext, useContext, useDeferredValue } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ViewState, DESIGN_SYSTEM, PerformanceProfile } from './types';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';

/**
 * Silicon Valley Standard: Main-Thread Task Scheduler
 * Breaks down long execution tasks into smaller chunks to maintain 60fps and low INP.
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

// Speculative Registry
const CRITICAL_ASSETS: Record<string, string[]> = {
  [ViewState.HOME]: ["https://raw.githubusercontent.com/soniglf/JACIResources/84c35cf151659486d49458cee28c1f353f42f47d/JACI_Color.png"],
  [ViewState.METHODOLOGY]: ["https://lh3.googleusercontent.com/aida-public/AB6AXuA4sB3k0FBFYI_qENJexMKPDpIIadN6siWEcb1uScQwl1CeA8sBd_sKxm1D1oFg3A0I1FUDN9OVs6ofN7NhxlOOcqKZ_L2ctAEJIwxrxHxMC3CnEdPWifTw6t7HoaS_CFa_Ix2HkpubNRN9-2XD9i78O8xFjXz2VmPPJPmIROyJRfwW0C3ypLM-jqQ-OSkhhyj31JuwxjlxzUd-IR-3AvH4MMVJ41bzXkxQmsCZgY-BYyQosWYUpvLD1J6qVbgYr2RXmxYQM8Xdrb6u"],
  [ViewState.LEVELS]: ["https://lh3.googleusercontent.com/aida-public/AB6AXuBNZlftM73AD9x8L97Rhl_5DejCEzh3EgdYA_XIQRZ07xYRS5BQGsEQSOEh7rKYByF3NrstYqTX-HHqsZR6EMM8gUL0g89JD9VkOrJbwYxfpWv0zohD--WcFXhSfZ4mPtMk6mD8nBmkE4Wbua0VZ1MwrSh1E7TcTh0F6mDJ2rYlp_FGapjh144xOImeCJFgEVRB9JSEJbKdEkS5lw2BTKldvRToREzYIkB1FCBHDscEY27DWRmFf4HeXE6S2y51a0_VMmFy6sgz8xe8"],
  [ViewState.LOCATIONS]: ["https://lh3.googleusercontent.com/aida-public/AB6AXuA-UKXNC-U7dc2fO-B0B9Cnyo3Dy8WyrvaMgN7UdSVnbGNkfu1shrCQzxAdNWCN31Bdwekwo0YAF7faiQ24E1yAIFDuSKdexMt3AnIcVeTIxtPDaB2BurM1lXhZdZeTtkhuuOJuODUbNt9qzZ6wnsGPcf3Ju_6sGx0Lqt74Q6tXSSAt7or1Z6VgPTaeRVNAvQpIBzr1BsD9iyEQ1hkSSlMwZCxIfKme-bJdXjdcdOM49lu_7uhVOaKqwo_nIi99pqAHaPakpbA4lNfb"]
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
  [ViewState.DASHBOARD]: () => import('./views/DashboardView'), // <--- NUEVO
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

    const assets = CRITICAL_ASSETS[view];
    if (assets) {
      assets.forEach(url => {
        const img = new Image();
        (img as any).fetchPriority = "low";
        img.src = url;
      });
    }
  }, 'background');
};

/**
 * Segmented View Renderer
 * Uses DeferredValue to decouple state updates from heavy UI rendering.
 */
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
    case ViewState.DASHBOARD: return <DashboardView />; // <--- NUEVO
    default: return <HomeView />;
  }
});

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  const [isPending, startTransition] = useTransition();
  const [performance, setPerformance] = useState<PerformanceProfile>(PerformanceProfile.HIGH);

  /**
   * Silicon Valley Standard: URL Callback Monitor
   * Detects payment or auth status directly from query params.
   */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const payment = params.get('payment');
    const auth = params.get('auth');
    const targetView = params.get('view');

    let newView: ViewState | null = null;

    if (payment === 'success') {
      newView = ViewState.PRICING;
    } else if (auth === 'callback') {
      newView = ViewState.REGISTER;
    } else if (targetView && Object.values(ViewState).includes(targetView as ViewState)) {
      newView = targetView as ViewState;
    }

    if (newView) {
      setCurrentView(newView);
      // Clean URL for professional appearance
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  useEffect(() => {
    const memory = (navigator as any).deviceMemory || 8;
    const cores = navigator.hardwareConcurrency || 8;
    const conn = (navigator as any).connection?.effectiveType || '4g';
    
    if (memory < 4 || cores < 4 || /2g|3g/.test(conn)) {
      setPerformance(PerformanceProfile.LITE);
    }
  }, []);

  const handleViewChange = useCallback(async (view: ViewState) => {
    if (currentView === view) return;

    // Silicon Valley Tactic: Yield before heavy transition
    await scheduler.yield();

    startTransition(() => {
      if ((document as any).startViewTransition) {
        (document as any).startViewTransition(() => setCurrentView(view));
      } else {
        setCurrentView(view);
      }
    });
  }, [currentView]);

  return (
    <PerformanceContext.Provider value={performance}>
      <div className={`min-h-screen flex flex-col font-body selection:bg-primary/20 transition-colors duration-1000 ${isPending ? 'bg-slate-50/50' : 'bg-surface'}`}>
        <Navigation currentView={currentView} onChangeView={handleViewChange} />
        
        <main className="flex-grow relative overflow-hidden" style={{ contain: 'layout paint' }}>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={currentView}
              initial={{ opacity: 0, scale: 0.99, filter: 'blur(4px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.01, filter: 'blur(4px)' }}
              transition={DESIGN_SYSTEM.springs.snappy}
              className="w-full will-change-transform"
            >
              <Suspense fallback={
                <div className="h-[60vh] w-full flex items-center justify-center">
                  <div className="flex flex-col items-center gap-6">
                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Sincronizando Monstruomentes...</p>
                  </div>
                </div>
              }>
                <ViewRenderer view={currentView} />
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </main>

        <Footer />
      </div>
    </PerformanceContext.Provider>
  );
};

export default App;
