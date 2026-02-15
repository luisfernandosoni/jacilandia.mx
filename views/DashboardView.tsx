
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
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  
  // 🔍 Filter & Search State
  const [activeCategory, setActiveCategory] = useState<'All' | 'Series' | 'Single' | 'Workshop'>('All');
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/login-dev', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
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
      <div className="w-full min-h-[85vh] flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-[10%] left-[2%] opacity-10 md:opacity-20 rotate-12"><FloatingMonster monster="POMPIN" size="size-24 md:size-32" /></div>
        <div className="absolute bottom-[10%] right-[2%] opacity-10 md:opacity-20 -rotate-12"><FloatingMonster monster="TUFIN" size="size-24 md:size-32" /></div>
        <ScrollReveal className="w-full max-w-[440px] relative z-10">
          <div className="relative bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(15,23,42,0.12)] border border-slate-50 flex flex-col items-center px-8 py-12 md:px-14 md:py-20">
            <div className="absolute -top-12 -right-4 md:-top-10 md:-right-6 z-20"><FloatingMonster monster="TOMAS" size="size-20 md:size-24" /></div>
            <div className="mb-12 text-center">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-primary/5 rounded-[2rem] flex items-center justify-center border border-primary/10 mx-auto mb-8">
                <span className="material-symbols-outlined text-2xl md:text-3xl text-primary">person</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black font-display text-slate-900 leading-[0.95] tracking-tight mb-8">Acceso al Panel</h2>
            </div>
            <form onSubmit={handleLogin} className="w-full space-y-8">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@correo.com" className={`w-full h-16 md:h-20 pl-6 pr-6 bg-white border-2 rounded-[1.5rem] font-body text-slate-900 focus:outline-none focus:ring-8 focus:ring-primary/5 transition-all ${loginError ? 'border-red-400' : 'border-primary'}`} required />
              {loginError && <p className="text-red-500 text-xs font-black uppercase text-center">{loginError}</p>}
              <div className="pt-2 w-full flex justify-center">
                <Magnetic pullStrength={0.12}>
                  <button type="submit" disabled={isSubmitting} className="h-16 md:h-20 px-10 md:px-14 bg-slate-900 text-white rounded-[1.75rem] font-black font-display text-[10px] uppercase tracking-[0.3em] shadow-xl hover:shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50">
                    {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'INGRESAR'}
                  </button>
                </Magnetic>
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
                      placeholder="Buscar drops..."
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
