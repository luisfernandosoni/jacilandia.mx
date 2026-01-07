import React, { useState, useEffect } from 'react';
import { ViewContainer, InteractionCard, ScrollReveal, GlassBadge, OptimizedImage, Magnetic } from '../components/MotionPrimitives';
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
}

export const DashboardView: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [drops, setDrops] = useState<Drop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/login-dev', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json() as LoginResponse;
      if (data.success) {
        setUser(data.user);
        fetchDrops();
      }
    } catch (error) {
      console.error("Error de login", error);
    } finally {
      setIsSubmitting(false);
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

  // --- GUEST VIEW: LOGIN EXACTO A LA REFERENCIA ---
  if (!user) {
    return (
      <div className="w-full min-h-[85vh] flex items-center justify-center p-6">
        <ScrollReveal className="w-full max-w-[420px]">
          <div className="relative bg-white rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.06)] border border-slate-100 overflow-hidden flex flex-col items-center px-10 py-16">
            {/* El característico borde azul lateral de la imagen */}
            <div className="absolute left-0 top-[10%] bottom-[10%] w-[3px] bg-primary rounded-r-full" />
            
            {/* Icon Box */}
            <div className="w-20 h-20 bg-primary-soft rounded-[2rem] flex items-center justify-center text-primary mb-10">
              <span className="material-symbols-outlined text-4xl filled">person_lock</span>
            </div>

            <h2 className="text-[2.8rem] font-black font-display text-slate-900 leading-tight mb-6 text-center">
              Acceso <br/> Tutores
            </h2>

            <p className="text-slate-400 font-body text-center text-[1.15rem] leading-relaxed mb-12 px-2">
              Ingresa tu correo registrado para desbloquear tu material educativo y gestionar tu suscripción.
            </p>

            <form onSubmit={handleLogin} className="w-full space-y-6">
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-primary">
                  <span className="material-symbols-outlined text-2xl">mail</span>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="f@gmail.co"
                  className="w-full h-16 pl-14 pr-14 bg-white border-2 border-primary rounded-2xl font-body text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all text-lg"
                  required
                />
                <div className="absolute right-5 top-1/2 -translate-y-1/2 text-blue-600">
                   <span className="material-symbols-outlined filled text-2xl">verified_user</span>
                </div>
              </div>

              <Magnetic pullStrength={0.1}>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-16 bg-[#0f172a] text-white rounded-full font-black font-display text-[11px] uppercase tracking-[0.25em] shadow-xl hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center disabled:opacity-50"
                >
                  {isSubmitting ? 'VERIFICANDO...' : 'INGRESAR AHORA'}
                </button>
              </Magnetic>
            </form>
          </div>
        </ScrollReveal>
      </div>
    );
  }

  // --- USER VIEW: DASHBOARD REFINADO ---
  return (
    <div className="w-full min-h-screen pb-24">
      <ViewContainer>
        <div className="text-center max-w-3xl mx-auto mb-20 flex flex-col items-center">
          <ScrollReveal>
            <GlassBadge icon="account_circle" colorClass="text-primary">Panel de Control</GlassBadge>
            <h1 className={DESIGN_SYSTEM.typography.h2 + " mt-8"}>
              Tu Colección <span className="text-primary">JACI</span>
            </h1>
            <p className={DESIGN_SYSTEM.typography.body + " mt-8"}>
              Bienvenido de nuevo. Aquí encontrarás todo el material pedagógico de tu suscripción actual.
            </p>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {drops.map((drop, idx) => (
            <ScrollReveal key={drop.id} delay={idx * 0.1}>
              <InteractionCard 
                borderColor={drop.is_unlocked ? DESIGN_SYSTEM.colors.green : DESIGN_SYSTEM.colors.slate[800]}
                className="h-full !p-0 overflow-hidden"
              >
                <div className="flex flex-col h-full">
                  {/* Hero Image inside Card */}
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

                  {/* Body Padding Matching LevelsView */}
                  <div className="p-10 flex flex-col flex-1">
                    <div className="flex justify-between items-center mb-6">
                      <span className={DESIGN_SYSTEM.typography.label}>{drop.month} {drop.year}</span>
                      <div className="size-2 bg-slate-200 rounded-full"></div>
                    </div>

                    <h3 className="text-2xl font-black font-display text-slate-900 mb-4 leading-tight">
                      {drop.title}
                    </h3>
                    
                    <p className="text-slate-500 font-body text-base leading-relaxed mb-10 flex-1">
                      {drop.is_unlocked 
                        ? "Este pack incluye 12 actividades dinámicas, 3 guías PDF y videos exclusivos de esta temporada." 
                        : "Desbloquea este material y miles de recursos más uniéndote a nuestra membresía mensual."}
                    </p>

                    <Magnetic pullStrength={0.08}>
                      {drop.is_unlocked ? (
                        <button 
                          onClick={() => handleDownload(drop.id)}
                          className="w-full py-5 bg-slate-900 text-white rounded-full font-black font-display text-[10px] uppercase tracking-[0.25em] shadow-xl hover:bg-jaci-green transition-all flex items-center justify-center gap-2 group/btn"
                        >
                          <span className="material-symbols-outlined text-lg">cloud_download</span>
                          Descargar Pack
                        </button>
                      ) : (
                        <button 
                          onClick={() => window.location.href = '?view=PRICING'}
                          className="w-full py-5 border-2 border-slate-100 text-slate-400 rounded-full font-black font-display text-[10px] uppercase tracking-[0.25em] hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all flex items-center justify-center gap-2"
                        >
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
