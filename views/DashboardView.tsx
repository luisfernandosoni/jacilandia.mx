
import React, { useState, useEffect } from 'react';
import { ViewContainer, InteractionCard, ScrollReveal, GlassBadge, OptimizedImage, Magnetic } from '../components/MotionPrimitives';
import { DESIGN_SYSTEM } from '../types';

// Interfaces basadas en la respuesta de la API
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
  
  // Estado para el formulario de login
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Verificación de sesión al montar
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/user');
      const data = await res.json() as UserResponse;
      if (data.user) {
        setUser(data.user);
        fetchDrops(); // Si hay usuario, cargamos el contenido inmediatamente
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

  // --- LOADING STATE ---
  if (isLoading) {
    return (
      <ViewContainer className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <span className={DESIGN_SYSTEM.typography.label}>Conectando...</span>
        </div>
      </ViewContainer>
    );
  }

  // --- GUEST VIEW: BRUTALIST LOGIN ---
  if (!user) {
    return (
      <div className="w-full min-h-[70vh] flex items-center justify-center relative overflow-hidden">
        {/* Decorative Blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10" />

        <ViewContainer className="max-w-md w-full">
          <ScrollReveal>
            <InteractionCard borderColor={DESIGN_SYSTEM.colors.primary} className="bg-white/80 backdrop-blur-xl">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary-soft rounded-2xl flex items-center justify-center text-primary mb-8 border border-primary/20 shadow-inner">
                  <span className="material-symbols-outlined text-3xl filled">lock_person</span>
                </div>
                
                <h2 className={DESIGN_SYSTEM.typography.h2 + " mb-3"}>Acceso Tutores</h2>
                <p className={DESIGN_SYSTEM.typography.body + " mb-10 text-base"}>
                  Ingresa tu correo registrado para desbloquear tu material educativo y gestionar tu suscripción.
                </p>

                <form onSubmit={handleLogin} className="w-full flex flex-col gap-5">
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-xl group-focus-within:text-primary transition-colors">mail</span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nombre@email.com"
                      className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl outline-none focus:border-primary focus:bg-white transition-all font-body text-slate-900 placeholder:text-slate-400 shadow-inner"
                      required
                    />
                  </div>
                  
                  <Magnetic pullStrength={0.1}>
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full py-4 bg-slate-900 text-white rounded-full font-black font-display text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-primary hover:shadow-glow-primary/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Verificando...</span>
                        </>
                      ) : (
                        <span>Ingresar Ahora</span>
                      )}
                    </button>
                  </Magnetic>
                </form>
              </div>
            </InteractionCard>
          </ScrollReveal>
        </ViewContainer>
      </div>
    );
  }

  // --- USER VIEW: BENTO GRID DASHBOARD ---
  return (
    <div className="w-full min-h-screen">
      <ViewContainer>
        {/* Header Personalizado */}
        <div className="flex flex-col items-center text-center mb-20">
          <ScrollReveal>
            <GlassBadge icon="space_dashboard" colorClass="text-jaci-purple">Tu Espacio Personal</GlassBadge>
            <h1 className={DESIGN_SYSTEM.typography.h2 + " mt-8 mb-4"}>
              Colección <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-jaci-purple to-jaci-pink">Monstruomente</span>
            </h1>
            <p className={DESIGN_SYSTEM.typography.body + " max-w-xl mx-auto"}>
              Hola, <span className="text-slate-900 font-bold border-b-2 border-jaci-yellow">{user.email.split('@')[0]}</span>. 
              Aquí tienes tus herramientas para cambiar el mundo, una mente a la vez.
            </p>
          </ScrollReveal>
        </div>

        {/* The Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
          {drops.map((drop, idx) => (
            <ScrollReveal key={drop.id} delay={idx * 0.05}>
              <InteractionCard 
                borderColor={drop.is_unlocked ? DESIGN_SYSTEM.colors.green : DESIGN_SYSTEM.colors.slate[500]} 
                className={`h-full ${!drop.is_unlocked ? 'opacity-90' : ''}`}
              >
                <div className="flex flex-col h-full">
                  {/* Meta Header */}
                  <div className="flex justify-between items-center mb-6">
                    <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm ${
                      drop.is_unlocked 
                        ? 'bg-jaci-green-soft text-jaci-green border-jaci-green/20' 
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}>
                      {drop.is_unlocked ? 'Adquirido' : 'Bloqueado'}
                    </div>
                    <span className={DESIGN_SYSTEM.typography.label + " !text-slate-400"}>
                      {drop.month} {drop.year}
                    </span>
                  </div>

                  {/* Cover Image Visual */}
                  <div className={`relative aspect-[4/3] rounded-[1.8rem] overflow-hidden mb-8 shadow-sm border border-slate-100 group`}>
                    <OptimizedImage 
                      src={drop.cover_image || `https://placehold.co/600x450/f1f5f9/94a3b8?text=${drop.title}`} 
                      alt={drop.title} 
                      className={`w-full h-full object-cover transition-all duration-700 ${!drop.is_unlocked ? 'grayscale contrast-125' : 'group-hover:scale-105'}`}
                    />
                    
                    {/* Overlay para items bloqueados */}
                    {!drop.is_unlocked && (
                      <div className="absolute inset-0 bg-slate-900/10 flex items-center justify-center backdrop-blur-[2px]">
                         <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                           <span className="material-symbols-outlined text-slate-900 text-2xl">lock</span>
                         </div>
                      </div>
                    )}
                  </div>

                  {/* Info & Actions */}
                  <div className="flex flex-col flex-1">
                    <h3 className="text-2xl font-black font-display text-slate-900 mb-3 leading-tight">
                      {drop.title}
                    </h3>
                    <p className="text-slate-500 text-sm font-body mb-8 flex-1 leading-relaxed">
                      {drop.is_unlocked 
                        ? "Material completo disponible. Incluye guías PDF y actividades interactivas." 
                        : "Este contenido es exclusivo para miembros con suscripción activa."}
                    </p>

                    <Magnetic pullStrength={0.05}>
                      {drop.is_unlocked ? (
                        <button 
                          onClick={() => handleDownload(drop.id)}
                          className="w-full py-4 bg-slate-900 text-white rounded-full font-black font-display text-[10px] uppercase tracking-[0.2em] shadow-lg hover:bg-jaci-green hover:shadow-glow-green/30 transition-all flex items-center justify-center gap-2 group/btn"
                        >
                          <span className="material-symbols-outlined text-lg group-hover/btn:-translate-y-0.5 transition-transform">download</span>
                          Descargar Pack
                        </button>
                      ) : (
                        <button 
                          onClick={() => window.location.href = '?view=PRICING'}
                          className="w-full py-4 border-2 border-slate-200 text-slate-500 rounded-full font-black font-display text-[10px] uppercase tracking-[0.2em] hover:border-jaci-pink hover:text-jaci-pink hover:bg-jaci-pink-soft transition-all flex items-center justify-center gap-2"
                        >
                          Obtener Acceso
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
