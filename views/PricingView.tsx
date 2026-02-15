import React, { useState } from 'react';
import { ViewContainer, InteractionCard, Magnetic, ScrollReveal, GlassBadge } from '../components/MotionPrimitives';
import { DESIGN_SYSTEM } from '../types';
import { usePerformance } from '../App';

export const PricingView: React.FC = () => {
  usePerformance();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubscribe = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const response = await fetch('/api/checkout/subscription', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.status === 401) {
        window.location.href = '/?view=DASHBOARD'; 
        return;
      }

      const data = await response.json() as { init_point?: string, error?: string };
      
      if (data.error) throw new Error(data.error);

      if (data.init_point) {
        window.location.href = data.init_point;
      }
    } catch (e) {
      console.error("Payment Handshake Error:", e);
      alert("Hubo un error al conectar con el servidor de pagos. Por favor intenta de nuevo.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full">
      <ViewContainer>
        <div className="text-center max-w-4xl mx-auto flex flex-col items-center mb-24">
          <ScrollReveal>
            <GlassBadge icon="verified" colorClass="text-jaci-pink">Acceso Premium Monstruomente</GlassBadge>
            <h1 className={DESIGN_SYSTEM.typography.h1 + " mt-8"}>
              JACI en Casa: <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-jaci-pink to-jaci-purple">Club Monstruomentes</span>
            </h1>
            <p className={`${DESIGN_SYSTEM.typography.body} mt-10`}>
              Lleva la magia de JACI a tu hogar con la membresía mensual de recursos educativos diseñados para potenciar el genio de tus hijos.
            </p>
          </ScrollReveal>
        </div>

        <div className="flex flex-col items-center mb-32">
          <ScrollReveal delay={0.2} className="w-full max-w-lg">
            <div className="relative group">
              {/* Dynamic Aura Glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-jaci-pink/20 to-jaci-purple/20 rounded-[3rem] blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
              
              <InteractionCard borderColor={DESIGN_SYSTEM.colors.pink} className="relative h-full border-2 border-jaci-pink/30 bg-white/90 backdrop-blur-xl">
                <div className="absolute top-0 right-0 bg-jaci-pink text-white text-[9px] font-black uppercase tracking-[0.2em] px-8 py-3 rounded-bl-[2rem] shadow-sm z-20">
                  Plan Único Premium
                </div>
                
                <div className="flex flex-col items-center text-center mt-4">
                  <div className="size-20 rounded-[2rem] bg-jaci-pink-soft text-jaci-pink flex items-center justify-center mb-8 border border-jaci-pink/20">
                    <span className="material-symbols-outlined text-4xl filled">auto_awesome</span>
                  </div>
                  
                  <h3 className="text-3xl font-black font-display text-slate-900 mb-4">Membresía Digital</h3>
                  
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-6xl md:text-7xl font-black font-display text-slate-900">$99</span>
                    <div className="flex items-baseline flex-col items-start">
                      <span className="text-lg font-black text-jaci-pink tracking-tight leading-none">MXN</span>
                      <span className="text-sm font-bold text-slate-400">/ mes</span>
                    </div>
                  </div>
                  
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-12">Cancela cuando quieras</p>
                </div>

                <div className="space-y-6 mb-12 px-4">
                  {[
                    'Drop mensual de recursos premium',
                    'Acceso inmediato a la colección vigente',
                    'Licencia para uso personal ilimitado',
                    'Dashboard de descargas dedicado',
                    'Soporte prioritario 24/7'
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-4 text-slate-700 font-body font-bold text-base">
                      <div className="size-6 rounded-full bg-jaci-pink/10 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-jaci-pink text-[16px] filled">check_circle</span>
                      </div>
                      {feature}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-6">
                  <Magnetic pullStrength={0.1}>
                    <button 
                      onClick={handleSubscribe}
                      disabled={isProcessing}
                      className={`w-full py-6 rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-2xl transition-all duration-500 font-display flex items-center justify-center gap-3 ${
                        isProcessing 
                          ? 'bg-slate-700 text-white cursor-wait' 
                          : 'bg-slate-900 text-white hover:bg-jaci-pink hover:scale-[1.02] active:scale-95'
                      }`}
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Procesando...</span>
                        </>
                      ) : (
                        'Comenzar ahora'
                      )}
                    </button>
                  </Magnetic>
                  
                  <button 
                    onClick={() => window.location.href = '/?view=DASHBOARD'}
                    className="group flex items-center justify-center gap-2 text-slate-400 hover:text-slate-900 transition-colors py-2"
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest">¿Ya eres miembro?</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary group-hover:underline">Accede a tus descargas</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
                
                <p className="text-center mt-8 text-slate-400 text-[9px] font-medium uppercase tracking-widest">
                  Pagos seguros vía MercadoPago
                </p>
              </InteractionCard>
            </div>
          </ScrollReveal>
        </div>
      </ViewContainer>
    </div>
  );
};
