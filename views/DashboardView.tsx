
import React, { useState, useEffect } from 'react';
import { ViewContainer, InteractionCard, ScrollReveal, GlassBadge, OptimizedImage, Magnetic, FloatingMonster } from '../components/MotionPrimitives';
import { DESIGN_SYSTEM } from '../types';

interface User {
  id: string;
  email: string;
}

interface Drop {
  id: string;
  title: string;
  month: string;
  year: number;
  cover_image: string | null;
  is_unlocked: boolean;
  released_at: string;
}

interface UserResponse {
  user: User | null;
}

interface LoginResponse {
  success: boolean;
  user: User;
  error?: string;
}

export const DashboardView: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [drops, setDrops] = useState<Drop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/user');
      const data = await res.json() as UserResponse;
      if (data.user) {
        setUser(data.user);
        fetchDrops();
      } else {
        setIsLoading(false);
      }
    } catch (e) {
      console.error("Error verificando sesión", e);
      setIsLoading(false);
    }
  };

  const fetchDrops = async () => {
    try {
      const res = await fetch('/api/drops');
      const data = await res.json() as Drop[];
      setDrops(data);
    } catch (e) {
      console.error("Error cargando drops", e);
    } finally {
      setIsLoading(false);
    }
  };

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
        fetchDrops();
      } else {
        setLoginError(data.error || "Error al intentar ingresar. Revisa tu correo.");
      }
    } catch (error) {
      setLoginError("Problema de conexión con el servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setDrops([]);
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  const handleDownload = (id: string) => {
    window.open(`/api/download/${id}`, '_blank');
  };

  if (isLoading) {
    return (
      <ViewContainer className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <span className={DESIGN_SYSTEM.typography.label}>Sincronizando...</span>
        </div>
      </ViewContainer>
    );
  }

  // --- GUEST VIEW ---
  if (!user) {
    return (
      <div className="w-full min-h-[85vh] flex items-center justify-center p-8 relative">
        {/* Background companions for login */}
        <div className="absolute top-1/4 left-[5%] opacity-20 rotate-12">
          <FloatingMonster monster="POMPIN" size="size-32" />
        </div>
        <div className="absolute bottom-1/4 right-[5%] opacity-20 -rotate-12">
          <FloatingMonster monster="TUFIN" size="size-32" />
        </div>

        <ScrollReveal className="w-full max-w-[440px]">
          <div className="relative bg-white rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(15,23,42,0.12)] border border-slate-50 overflow-hidden flex flex-col items-center px-10 py-16 md:px-14 md:py-20">
            {/* Peeking monster for login area */}
            <div className="absolute -top-10 -right-6">
              <FloatingMonster monster="TOMAS" size="size-24" />
            </div>

            <div className="absolute left-0 top-[15%] bottom-[15%] w-[5px] bg-primary rounded-r-full shadow-[0_0_20px_rgba(37,192,244,0.3)]" />
            <div className="mb-12 text-center">
              <div className="w-24 h-24 bg-primary/5 rounded-[2.5rem] flex items-center justify-center border border-primary/10 mx-auto mb-8">
                <div className="flex items-center gap-1.5 text-primary">
                  <span className="material-symbols-outlined text-3xl font-light">person</span>
                  <div className="w-4 h-[2px] bg-primary/20 rounded-full" />
                  <span className="material-symbols-outlined text-3xl filled">lock</span>
                </div>
              </div>
              <h2 className="text-5xl font-black font-display text-slate-900 leading-[0.95] tracking-tight mb-8">
                Acceso al <br/> Contenido
              </h2>
              <p className="text-slate-400 font-body text-[1rem] leading-relaxed max-w-[300px] mx-auto opacity-80">
                Ingresa tu correo registrado para desbloquear tu material educativo y gestionar tu suscripción.
              </p>
            </div>
            <form onSubmit={handleLogin} className="w-full space-y-8">
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-primary">
                  <span className="material-symbols-outlined text-2xl">mail</span>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  className={`w-full h-20 pl-16 pr-14 bg-white border-2 rounded-[2rem] font-body text-slate-900 placeholder:text-slate-200 focus:outline-none focus:ring-8 focus:ring-primary/5 transition-all text-lg font-medium ${loginError ? 'border-red-400' : 'border-primary'}`}
                  required
                />
                <div className={`absolute right-6 top-1/2 -translate-y-1/2 ${loginError ? 'text-red-500' : 'text-blue-600'}`}>
                  <span className="material-symbols-outlined text-2xl filled">
                    {loginError ? 'error' : 'verified'}
                  </span>
                </div>
              </div>
              {loginError && <p className="text-red-500 text-xs font-black uppercase tracking-widest text-center">{loginError}</p>}
              <div className="pt-2 w-full flex justify-center">
                <Magnetic pullStrength={0.12}>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="h-20 px-14 bg-slate-900 text-white rounded-[2.5rem] font-black font-display text-[11px] uppercase tracking-[0.35em] shadow-xl hover:shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'INGRESAR AHORA'}
                  </button>
                </Magnetic>
              </div>
            </form>
          </div>
        </ScrollReveal>
      </div>
    );
  }

  // --- USER VIEW ---
  return (
    <div className="w-full min-h-screen pb-24 relative">
      <div className="absolute top-[10%] right-[5%] z-0">
        <FloatingMonster monster="POSITIVIN" size="size-48" />
      </div>

      <ViewContainer>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-20 gap-8">
          <div className="flex flex-col items-start">
            <ScrollReveal>
              <GlassBadge icon="account_circle" colorClass="text-primary">Panel de Control</GlassBadge>
              <h1 className={DESIGN_SYSTEM.typography.h2 + " mt-8"}>
                Tu Colección <span className="text-primary">JACI</span>
              </h1>
              <p className={DESIGN_SYSTEM.typography.body + " mt-4 max-w-xl"}>
                Bienvenido, <span className="font-bold text-slate-900">{user.email}</span>. Aquí encontrarás todo el material pedagógico de tu suscripción.
              </p>
            </ScrollReveal>
          </div>
          
          <ScrollReveal delay={0.2}>
            <Magnetic pullStrength={0.1}>
              <button 
                onClick={handleLogout}
                className="px-8 py-4 bg-slate-100 text-slate-500 rounded-full font-black font-display text-[10px] uppercase tracking-[0.2em] hover:bg-slate-900 hover:text-white transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">logout</span>
                Cerrar Sesión
              </button>
            </Magnetic>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {drops.map((drop, idx) => (
            <ScrollReveal key={drop.id} delay={idx * 0.1}>
              <InteractionCard 
                borderColor={drop.is_unlocked ? DESIGN_SYSTEM.colors.green : DESIGN_SYSTEM.colors.slate[800]}
                className="h-full !p-0 overflow-hidden group/card"
              >
                <div className="flex flex-col h-full">
                  <div className="relative aspect-[16/11] overflow-hidden group/img">
                    <OptimizedImage 
                      src={drop.cover_image || `https://placehold.co/800x600/f8fafc/64748b?text=${drop.title}`}
                      alt={drop.title}
                      className={`w-full h-full object-cover transition-transform duration-1000 ${drop.is_unlocked ? 'group-hover/img:scale-110' : 'grayscale opacity-60'}`}
                    />
                    {!drop.is_unlocked && (
                      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[4px] flex items-center justify-center">
                         <div className="size-16 bg-white rounded-full flex items-center justify-center shadow-2xl">
                           <span className="material-symbols-outlined text-slate-900 text-3xl filled">lock</span>
                         </div>
                      </div>
                    )}
                    <div className="absolute top-6 left-6 z-20">
                      <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest backdrop-blur-md border border-white/20 shadow-lg ${
                        drop.is_unlocked ? 'bg-jaci-green/90 text-white' : 'bg-slate-900/80 text-white'
                      }`}>
                        {drop.is_unlocked ? 'Contenido Activo' : 'Suscripción Necesaria'}
                      </div>
                    </div>
                  </div>

                  <div className="p-10 flex flex-col flex-1">
                    <div className="flex justify-between items-center mb-6">
                      <span className={DESIGN_SYSTEM.typography.label}>{drop.month} {drop.year}</span>
                      <div className="size-2 bg-slate-200 rounded-full"></div>
                    </div>
                    <h3 className="text-2xl font-black font-display text-slate-900 mb-4 leading-tight group-hover/card:text-primary transition-colors">{drop.title}</h3>
                    <p className="text-slate-500 font-body text-base leading-relaxed mb-10 flex-1">
                      {drop.is_unlocked ? "Este pack incluye 12 actividades dinámicas, 3 guías PDF y videos exclusivos." : "Desbloquea este material uniéndote a nuestra membresía mensual."}
                    </p>
                    <Magnetic pullStrength={0.08}>
                      {drop.is_unlocked ? (
                        <button onClick={() => handleDownload(drop.id)} className="w-full py-5 bg-slate-900 text-white rounded-full font-black font-display text-[10px] uppercase tracking-[0.25em] shadow-xl hover:bg-jaci-green transition-all flex items-center justify-center gap-2">
                          <span className="material-symbols-outlined text-lg">cloud_download</span>
                          Descargar Pack
                        </button>
                      ) : (
                        <button onClick={() => window.location.href = '?view=PRICING'} className="w-full py-5 border-2 border-slate-100 text-slate-400 rounded-full font-black font-display text-[10px] uppercase tracking-[0.25em] hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all flex items-center justify-center gap-2">
                          <span className="material-symbols-outlined text-lg">star</span>
                          Suscribirme Ahora
                        </button>
                      )}
                    </Magnetic>
                  </div>
                </div>
              </InteractionCard>
            </ScrollReveal>
          ))}
        </div>
      </ViewContainer>
    </div>
  );
};
