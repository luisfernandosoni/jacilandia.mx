
import React from 'react';
import { ViewContainer, InteractionCard, Magnetic, ScrollReveal, GlassBadge, FloatingMonster } from '../components/MotionPrimitives';
import { DESIGN_SYSTEM, ViewState } from '../types';
import { useNavigation } from '../App';

export const RegisterView: React.FC = () => {
  const { navigateTo } = useNavigation();
  const currentYear = 2026;
  const whatsappNumber = "2288382143";
  const whatsappUrl = `https://wa.me/52${whatsappNumber}?text=Hola%20JACI,%20me%20gustaría%20recibir%20información%20sobre%20las%20inscripciones%20${currentYear}.`;

  return (
    <div className="relative w-full overflow-hidden min-h-[80vh]">
      {/* Background Ambience */}
      <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-jaci-pink/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -z-10" />

      <ViewContainer className="pt-16 pb-32">
        <div className="text-center mb-24 max-w-4xl mx-auto flex flex-col items-center px-4">
          <ScrollReveal>
            <GlassBadge icon="family_history" colorClass="text-jaci-yellow">Inscripciones Xalapa {currentYear}</GlassBadge>
            <h1 className={DESIGN_SYSTEM.typography.h1 + " mt-8 mb-10"}>
              Únete a la Familia <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-jaci-pink">JACI</span>
            </h1>
            
            <div className="space-y-8 max-w-3xl mx-auto">
              <p className={DESIGN_SYSTEM.typography.body + " text-slate-600 font-medium"}>
                Tu hijo ya tiene el potencial. Solo le faltan las herramientas. No dejes pasar otro año escolar lleno de frustración. Dale a tu hijo el regalo de confiar en sí mismo. Invertir en JACI es elegir la mejor opción educativa para su futuro y tu tranquilidad.
              </p>
              <h3 className="text-2xl md:text-3xl font-black font-display text-slate-900 tracking-tight">
                ¿Listo para unirte a nuestra comunidad JACI?
              </h3>
            </div>
          </ScrollReveal>
        </div>

        <div className="max-w-4xl mx-auto px-4">
          <ScrollReveal delay={0.2}>
            <InteractionCard borderColor={DESIGN_SYSTEM.colors.primary} className="relative overflow-visible !p-0">
              {/* Monster Guardian */}
              <div className="absolute -top-16 -right-8 md:-top-20 md:-right-12 z-20">
                <FloatingMonster monster="TUFIN" size="size-32 md:size-48" />
              </div>

              <div className="flex flex-col md:flex-row items-stretch">
                {/* Visual Side with Branch Navigation */}
                <div className="md:w-2/5 relative min-h-[250px] md:min-h-full">
                  <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAAiVAKD96x9OTlkH1M7Ba_6hKmh7IbIlBtokcdJteOl1_ot5Bf5_tKC1t4jDGdzjSTRZ8kKp_D-XOAYDfgbWUkXvy_xfbWsMqXrhvJN82KoyzcHHNI3uA_Kl05_Cej3XTHqpCQIsqQttP4zSq356-sHqOyvrm4LjVZG1OkoutaVyLgn1vbFvj0k69LDhlezhSJNejAd40d2av7ZvRezHLjKMpz7QQksvtxLUfYoWXAvhs4tLw-UWB5T55a5LFByR23GH4d2FMpQqNf')" }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent md:bg-gradient-to-r" />
                  
                  <div className="absolute bottom-8 left-8 text-white flex flex-col gap-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-2 text-primary">Nuestras Sucursales</span>
                      <div className="flex flex-col gap-3">
                        <button 
                          onClick={() => navigateTo(ViewState.LOCATIONS)}
                          className="flex items-center gap-2 group/loc text-left transition-all hover:translate-x-1"
                        >
                          <span className="material-symbols-outlined text-sm text-primary filled">location_on</span>
                          <h4 className="text-xl font-black font-display group-hover/loc:text-primary transition-colors">Sucursal Centro</h4>
                        </button>
                        <button 
                          onClick={() => navigateTo(ViewState.LOCATIONS)}
                          className="flex items-center gap-2 group/loc text-left transition-all hover:translate-x-1"
                        >
                          <span className="material-symbols-outlined text-sm text-jaci-yellow filled">location_on</span>
                          <h4 className="text-xl font-black font-display group-hover/loc:text-jaci-yellow transition-colors">Sucursal Américas</h4>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Side */}
                <div className="md:w-3/5 p-8 md:p-14 bg-white">
                  <div className="mb-10">
                    <div className="flex items-baseline gap-3 mb-2">
                      <span className="text-5xl md:text-6xl font-black font-display text-slate-900 tracking-tighter">Inscripciones</span>
                    </div>
                    <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-xl">
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <span className="text-primary font-black font-display text-2xl md:text-3xl">Xalapa {currentYear}</span>
                    </div>
                  </div>

                  <p className="text-slate-500 font-body text-base leading-relaxed mb-12">
                    Estamos listos para conocer a tu pequeño monstruomente. Nuestro proceso de admisión es personalizado para asegurar el mejor inicio en su viaje educativo.
                  </p>

                  <div className="flex flex-col gap-6">
                    <Magnetic pullStrength={0.15}>
                      <a 
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-6 bg-jaci-green text-white rounded-full font-black font-display text-[11px] uppercase tracking-[0.25em] shadow-glow-green/20 hover:shadow-glow-green/40 transition-all flex items-center justify-center gap-4 group"
                      >
                        <svg className="w-6 h-6 fill-current transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.748-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217s.231.006.332.012c.109.006.252-.041.397.308.145.348.491 1.2.535 1.288.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.174.088.275.073.376-.044.101-.117.434-.506.549-.68.116-.174.232-.145.39-.087s1.011.477 1.184.564c.174.087.289.13.332.202.045.072.045.419-.1.824zM12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z"/>
                        </svg>
                        <span>Atención WhatsApp</span>
                      </a>
                    </Magnetic>
                    
                    <div className="text-center flex flex-col gap-2">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        Horarios de atención presencial
                      </p>
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                          Lunes a viernes de 12:00 a 19:00 hrs.
                        </p>
                        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                          Sábado 10:00 a 13:00 hrs.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </InteractionCard>
          </ScrollReveal>
        </div>
      </ViewContainer>
    </div>
  );
};
