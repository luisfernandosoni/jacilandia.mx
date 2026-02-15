
import React, { useState, useEffect } from 'react';
import { ViewContainer, InteractionCard, ScrollReveal, GlassBadge, OptimizedImage, Magnetic, FloatingMonster } from '../components/MotionPrimitives';
import { motion, AnimatePresence } from 'framer-motion';
import { DESIGN_SYSTEM } from '../types';
import { useDataCache } from '../App';
import { DropExplorer } from '../components/DropExplorer';

interface User { id: string; email: string; }
interface Drop { id: string; title: string; month: string; year: number; cover_image: string | null; is_unlocked: boolean; released_at: string; }
interface UserResponse { user: User | null; }
interface LoginResponse { success: boolean; user: User; error?: string; }

export const DashboardView: React.FC = () => {
  const { cache, setCache } = useDataCache();
  const [user, setUser] = useState<User | null>(cache.user?.user || null);
  const [drops, setDrops] = useState<Drop[]>(cache.drops || []);
  const [isLoading, setIsLoading] = useState(!cache.user && !cache.drops);
  // 🔍 Auth State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'reset-request' | 'reset-verify'>('login');

  // 🔍 Filter & Search State
  const [activeCategory, setActiveCategory] = useState<'Todos' | 'Series' | 'Sencillos' | 'Talleres'>('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  // 🔍 Filter Logic
  const filteredDrops = drops.filter(drop => {
    const matchesSearch = drop.title.toLowerCase().includes(searchQuery.toLowerCase());
    // In this MVP, tags are not yet in the DB model returned by API, we'll default to matches.
    // If tags exist in Drop interface, we'd use: const matchesCategory = activeCategory === 'All' || drop.tags?.includes(activeCategory);
    return matchesSearch;
  });

  const handleOneOffPurchase = async (dropId: string) => {
    try {
      const res = await fetch(`/api/checkout/buy/${dropId}`, { method: 'POST' });
      const data = await res.json();
      if (data.init_point) window.location.href = data.init_point;
    } catch (e) {
      console.error("Purchase failed", e);
    }
  };

  useEffect(() => {
    const init = async () => {
      if (!cache.user) {
        try {
          const res = await fetch('/api/user');
          const data = await res.json() as UserResponse;
          setCache('user', data);
          if (data.user) setUser(data.user);
        } catch (e) {}
      }
      
      if (user && !cache.drops) {
        try {
          const res = await fetch('/api/drops');
          if (!res.ok) throw new Error("No se pudierón cargar los contenidos.");
          const data = await res.json() as Drop[];
          setCache('drops', data);
          setDrops(data);
        } catch (e: any) {
          setLoginError(e.message);
        }
      }
      setIsLoading(false);
    };
    init();
  }, [cache.user, cache.drops, user, setCache]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('view') === 'RESET_PASSWORD' && params.get('token')) {
      setAuthMode('reset-verify');
    }
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setAuthSuccess(null);
    setIsSubmitting(true);

    const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/register';
    
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json() as LoginResponse;
      if (res.ok && data.success) {
        setUser(data.user);
        setCache('user', { user: data.user });
        const dropRes = await fetch('/api/drops');
        const dropData = await dropRes.json() as Drop[];
        setCache('drops', dropData);
        setDrops(dropData);
      } else {
        setLoginError(data.error || "Error al intentar ingresar.");
      }
    } catch (error) {
      setLoginError("Problema de conexión.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/reset-password/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) setAuthSuccess(data.message);
      else setLoginError(data.error);
    } catch (e) {
      setLoginError("Error de comunicación.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError(null);
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    
    try {
      const res = await fetch('/api/auth/reset-password/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });
      if (res.ok) {
        const data = await res.json();
        // Redirect or refresh to show dashboard
        window.location.href = '/?view=DASHBOARD';
      } else {
        const data = await res.json();
        setLoginError(data.error);
      }
    } catch (e) {
      setLoginError("Error al restablecer contraseña.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setCache('user', { user: null });
      setCache('drops', null);
      setDrops([]);
    } catch (error) {}
  };

  if (isLoading) {
    return (
      <ViewContainer className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      </ViewContainer>
    );
  }

  const [selectedDropId, setSelectedDropId] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="w-full min-h-[90vh] flex items-center justify-center p-4 relative overflow-hidden bg-slate-50/50">
        <div className="absolute top-[10%] left-[2%] opacity-10 md:opacity-20 rotate-12"><FloatingMonster monster="POMPIN" size="size-24 md:size-32" /></div>
        <div className="absolute bottom-[10%] right-[2%] opacity-10 md:opacity-20 -rotate-12"><FloatingMonster monster="TUFIN" size="size-24 md:size-32" /></div>
        
        <ScrollReveal className="w-full max-w-[480px] relative z-10">
          <div className="relative bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(15,23,42,0.12)] border border-slate-100 flex flex-col items-center px-6 py-10 md:px-12 md:py-16">
            <div className="absolute -top-12 -right-4 md:-top-10 md:-right-6 z-20"><FloatingMonster monster="TOMAS" size="size-20 md:size-24" /></div>
            
            <div className="mb-10 text-center w-full">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/5 rounded-[1.75rem] flex items-center justify-center border border-primary/10 mx-auto mb-6">
                <span className="material-symbols-outlined text-2xl md:text-3xl text-primary">
                  {authMode === 'reset-request' ? 'mail_lock' : 'lock_open'}
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black font-display text-slate-900 leading-tight tracking-tight mb-2">
                {authMode === 'login' ? 'Bienvenido a JACI' : 
                 authMode === 'register' ? 'Crea tu Cuenta' : 
                 authMode === 'reset-verify' ? 'Nueva Contraseña' : 'Recuperar Acceso'}
              </h2>
              <p className="text-slate-500 font-body text-sm">
                {authMode === 'login' ? 'Ingresa para acceder a tu bóveda.' : 
                 authMode === 'register' ? 'Únete al Club Monstruomentes.' : 
                 authMode === 'reset-verify' ? 'Ingresa tu nueva contraseña para acceder.' : 'Te enviaremos un enlace de recuperación.'}
              </p>
            </div>

            {/* Auth Mode Switcher */}
            {authMode !== 'reset-request' && authMode !== 'reset-verify' && (
              <div className="flex w-full bg-slate-50 p-1.5 rounded-2xl mb-10">
                <button 
                  onClick={() => { setAuthMode('login'); setLoginError(null); }}
                  className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${authMode === 'login' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Ingresar
                </button>
                <button 
                  onClick={() => { setAuthMode('register'); setLoginError(null); }}
                  className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${authMode === 'register' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Registrarse
                </button>
              </div>
            )}

            <form onSubmit={
              authMode === 'reset-request' ? handleResetRequest : 
              authMode === 'reset-verify' ? handleResetVerify : handleAuth
            } className="w-full space-y-6">
              <div className="space-y-4">
                {authMode !== 'reset-verify' && (
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-lg group-focus-within:text-primary transition-colors">mail</span>
                    <input 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      placeholder="tu@correo.com" 
                      className={`w-full h-16 pl-14 pr-6 bg-slate-50 border-2 rounded-2xl font-body text-slate-900 focus:outline-none focus:ring-8 focus:ring-primary/5 focus:bg-white transition-all ${loginError ? 'border-red-400' : 'border-slate-100 focus:border-primary'}`} 
                      required 
                    />
                  </div>
                )}

                {authMode !== 'reset-request' && (
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-lg group-focus-within:text-primary transition-colors">key</span>
                    <input 
                      type={showPassword ? "text" : "password"}
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      placeholder="Contraseña" 
                      className={`w-full h-16 pl-14 pr-14 bg-slate-50 border-2 rounded-2xl font-body text-slate-900 focus:outline-none focus:ring-8 focus:ring-primary/5 focus:bg-white transition-all ${loginError ? 'border-red-400' : 'border-slate-100 focus:border-primary'}`} 
                      required 
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg">{showPassword ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                )}
              </div>

              {loginError && <p className="text-red-500 text-[10px] font-black uppercase text-center tracking-tight animate-bounce">{loginError}</p>}
              {authSuccess && <p className="text-jaci-green text-[10px] font-black uppercase text-center tracking-tight">{authSuccess}</p>}

              {authMode === 'login' && (
                <div className="flex justify-end">
                  <button 
                    type="button" 
                    onClick={() => { setAuthMode('reset-request'); setLoginError(null); }}
                    className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
              )}

              <div className="pt-4 w-full flex flex-col gap-6">
                <Magnetic pullStrength={0.1}>
                  <button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="w-full h-16 bg-slate-900 text-white rounded-2xl font-black font-display text-[11px] uppercase tracking-[0.3em] shadow-xl hover:shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 
                     authMode === 'login' ? 'INGRESAR' : 
                     authMode === 'register' ? 'CREAR CUENTA' : 
                     authMode === 'reset-verify' ? 'GUARDAR Y INGRESAR' : 'ENVIAR ENLACE'}
                  </button>
                </Magnetic>

                {(authMode === 'reset-request' || authMode === 'reset-verify') && (
                  <button 
                    type="button"
                    onClick={() => { setAuthMode('login'); setLoginError(null); }}
                    className="flex items-center justify-center gap-2 text-slate-400 hover:text-slate-900 transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">arrow_back</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Volver al login</span>
                  </button>
                )}

                {(authMode === 'login' || authMode === 'register') && (
                  <>
                    <div className="relative flex items-center gap-4 py-2">
                      <div className="flex-1 h-px bg-slate-100" />
                      <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.25em]">O continuar con</span>
                      <div className="flex-1 h-px bg-slate-100" />
                    </div>

                    <Magnetic pullStrength={0.08}>
                      <a 
                        href="/api/auth/login/google"
                        className="w-full h-16 bg-white border-2 border-slate-100 text-slate-900 rounded-2xl font-black font-display text-[10px] uppercase tracking-[0.2em] shadow-sm hover:border-primary/20 hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Google
                      </a>
                    </Magnetic>
                  </>
                )}
              </div>
            </form>
          </div>
        </ScrollReveal>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen pb-24 relative overflow-x-hidden">
      <AnimatePresence mode="wait">
        {selectedDropId ? (
          <DropExplorer 
            key="explorer" 
            dropId={selectedDropId} 
            onBack={() => setSelectedDropId(null)} 
          />
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute top-[8%] right-[2%] z-0 opacity-40 md:opacity-100"><FloatingMonster monster="POSITIVIN" size="size-32 md:size-48" /></div>
            <ViewContainer className="relative z-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
                <div className="flex flex-col items-start px-4">
                  <ScrollReveal>
                    <GlassBadge icon="account_circle" colorClass="text-primary">Bóveda Digital</GlassBadge>
                    <h1 className={DESIGN_SYSTEM.typography.h2 + " mt-6"}>Tu Colección <span className="text-primary">JACI</span></h1>
                    <p className={DESIGN_SYSTEM.typography.body + " mt-4 max-w-xl"}>Bienvenido a tu espacio creativo, <span className="font-bold text-slate-900">{user.email}</span>.</p>
                  </ScrollReveal>
                </div>

                <div className="flex flex-col md:flex-row gap-6 w-full md:w-auto px-4">
                  <div className="flex bg-slate-100 p-1 rounded-2xl">
                    {(['Todos', 'Series', 'Sencillos', 'Talleres'] as const).map(cat => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-6 py-2.5 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${activeCategory === cat ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Membership Upsell Banner (@marketing-psychology) */}
                {!drops.some(d => d.is_unlocked) && (
                  <ScrollReveal delay={0.3} className="w-full px-4 mb-12">
                     <motion.div 
                       whileHover={{ y: -5 }}
                       className="relative w-full overflow-hidden rounded-[2.5rem] bg-slate-900 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 border border-white/10 shadow-2xl"
                     >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -z-10 translate-x-1/2 -translate-y-1/2" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-jaci-pink/10 rounded-full blur-[60px] -z-10 -translate-x-1/2 translate-y-1/2" />
                        
                        <div className="flex flex-col items-start text-center md:text-left">
                          <div className="inline-flex items-center gap-2 bg-primary/20 px-4 py-2 rounded-full mb-6">
                            <span className="material-symbols-outlined text-sm text-primary filled">auto_awesome</span>
                            <span className="text-primary font-black text-[10px] uppercase tracking-widest">JACI en Casa</span>
                          </div>
                          <h2 className="text-3xl md:text-4xl font-black font-display text-white mb-4">Únete al Club Monstruomentes</h2>
                          <p className="text-white/60 font-body text-sm md:text-base max-w-lg">
                            Desbloquea el acceso ilimitado a toda la bóveda y recibe un nuevo pack de recursos educativos cada mes.
                          </p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                           <div className="flex flex-col items-center">
                              <span className="text-3xl font-black font-display text-white">$99 <span className="text-xs text-white/40">MXN/mes</span></span>
                              <span className="text-[10px] font-bold text-primary uppercase tracking-widest mt-1">Cancela cuando quieras</span>
                           </div>
                           <Magnetic pullStrength={0.15}>
                             <button 
                               onClick={() => window.location.href = '/?view=PRICING'}
                               className="px-10 py-5 bg-primary text-white rounded-full font-black font-display text-[10px] uppercase tracking-[0.25em] shadow-glow-primary/20 hover:scale-105 active:scale-95 transition-all"
                             >
                               Comenzar ahora
                             </button>
                           </Magnetic>
                        </div>

                        <div className="absolute -bottom-6 -right-6 opacity-20 pointer-events-none">
                          <FloatingMonster monster="POMPIN" size="size-40" />
                        </div>
                     </motion.div>
                  </ScrollReveal>
                )}
                <div className="px-4 w-full md:w-auto flex flex-col md:flex-row gap-4">
                  <div className="relative group min-w-[240px]">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                    <input 
                      type="text"
                      placeholder="Buscar contenidos..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full h-12 pl-11 pr-4 bg-slate-50 border border-slate-100 rounded-xl focus:border-primary focus:outline-none transition-all text-xs font-medium"
                    />
                  </div>
                  <ScrollReveal delay={0.2}>
                    <Magnetic pullStrength={0.1}><button onClick={handleLogout} className="w-full md:w-auto px-8 py-3 bg-slate-100 text-slate-500 rounded-full font-black text-[9px] uppercase tracking-[0.2em] hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-2"><span className="material-symbols-outlined text-lg">logout</span>Salir</button></Magnetic>
                  </ScrollReveal>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
                {filteredDrops.map((drop, idx) => (
                  <ScrollReveal key={drop.id} delay={idx * 0.1}>
                    <InteractionCard borderColor={drop.is_unlocked ? DESIGN_SYSTEM.colors.green : DESIGN_SYSTEM.colors.slate[800]} className="h-full !p-0 overflow-hidden group/card">
                      <div className="flex flex-col h-full">
                        <div className="relative aspect-[16/11] overflow-hidden group/img">
                          <OptimizedImage src={drop.cover_image || `https://placehold.co/800x600/f8fafc/64748b?text=${drop.title}`} alt={drop.title} className={`w-full h-full object-cover transition-transform duration-1000 ${drop.is_unlocked ? 'group-hover/img:scale-110' : 'grayscale opacity-60'}`} />
                          {!drop.is_unlocked && (
                            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[4px] flex items-center justify-center">
                              <div className="size-14 bg-white rounded-full flex items-center justify-center shadow-2xl" aria-label="Contenido bloqueado">
                                <span className="material-symbols-outlined text-slate-900 filled" aria-hidden="true">lock</span>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="p-8 md:p-10 flex flex-col flex-1">
                          <span className={DESIGN_SYSTEM.typography.label}>{drop.month} {drop.year}</span>
                          <h3 className="text-xl md:text-2xl font-black font-display text-slate-900 mb-4 transition-colors group-hover/card:text-primary">{drop.title}</h3>
                          <p className="text-slate-500 font-body text-sm mb-10 flex-1">{drop.is_unlocked ? "Contenido listo para descargar." : "Disponible en el Club Monstruomentes."}</p>
                          
                          <div className="flex flex-col gap-3">
                            <button 
                              onClick={() => drop.is_unlocked && setSelectedDropId(drop.id)}
                              className={`w-full py-4 rounded-full font-black text-[9px] uppercase tracking-[0.25em] transition-all flex items-center justify-center gap-2 ${drop.is_unlocked ? 'bg-slate-900 text-white hover:bg-jaci-green' : 'bg-slate-100 text-slate-400'}`}
                            >
                              <span className="material-symbols-outlined text-lg">{drop.is_unlocked ? 'explore' : 'lock'}</span>
                              {drop.is_unlocked ? 'Explorar' : 'Bloqueado'}
                            </button>

                            {!drop.is_unlocked && (
                              <button 
                                onClick={() => handleOneOffPurchase(drop.id)}
                                className="w-full py-4 bg-slate-900 text-white rounded-full font-black text-[9px] uppercase tracking-[0.25em] hover:bg-primary transition-all flex items-center justify-center gap-2"
                              >
                                <span className="material-symbols-outlined text-lg">payments</span>
                                Comprar Drop ($99)
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </InteractionCard>
                  </ScrollReveal>
                ))}
              </div>
            </ViewContainer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
