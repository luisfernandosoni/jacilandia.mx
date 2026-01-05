import React from 'react';
import { motion } from 'framer-motion';
import { ViewContainer, ScrollReveal, ParallaxSection, Magnetic, InteractionCard, GlassBadge } from '../components/MotionPrimitives';
import { DESIGN_SYSTEM } from '../types';

export const AboutView: React.FC = () => {
  return (
    <div className="relative w-full overflow-hidden min-h-screen">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
        <ParallaxSection speed={0.2} className="absolute top-[15%] right-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[140px]" />
        <ParallaxSection speed={0.4} className="absolute bottom-[10%] left-[-5%] w-[400px] h-[400px] bg-jaci-pink/5 rounded-full blur-[120px]" />
        
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 15, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-10 right-10 opacity-40 text-jaci-purple hidden lg:block"
        >
          <span className="material-symbols-outlined text-7xl filled">auto_awesome</span>
        </motion.div>
      </div>

      <ViewContainer className="pt-24 lg:pt-32 pb-40 max-w-7xl mx-auto">
        
        {/* Section 1: The Balanced Vision Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-40">
          <div className="flex flex-col gap-8">
            <ScrollReveal>
              <div className="flex flex-col gap-6">
                <GlassBadge icon="visibility">Nuestra Visión</GlassBadge>
                <h2 className="text-5xl md:text-7xl font-black font-display text-slate-900 leading-[0.95] tracking-tight mt-6">
                  Redefiniendo el <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-jaci-purple">aprendizaje</span> <br/>
                  moderno.
                </h2>
                <p className="text-lg md:text-xl text-gray-500 font-body leading-relaxed mt-4">
                  En JACI, no solo enseñamos materias; cultivamos la <span className="text-slate-900 font-bold underline decoration-jaci-yellow decoration-4 underline-offset-4">curiosidad infinita</span>. 
                  Transformamos cada aula en un ecosistema de descubrimiento.
                </p>
              </div>
            </ScrollReveal>
          </div>

          <div className="relative">
            <ParallaxSection speed={0.1}>
              <div className="relative group">
                <div className="absolute -inset-6 bg-gradient-to-br from-primary via-jaci-pink to-jaci-yellow rounded-[4.5rem] opacity-10 blur-3xl group-hover:opacity-20 transition-opacity"></div>
                <div className="relative aspect-square rounded-[3.5rem] overflow-hidden border-[16px] border-white shadow-soft bg-white">
                  <div className="w-full h-full bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA4sB3k0FBFYI_qENJexMKPDpIIadN6siWEcb1uScQwl1CeA8sBd_sKxm1D1oFg3A0I1FUDN9OVs6ofN7NhxlOOcqKZ_L2ctAEJIwxrxHxMC3CnEdPWifTw6t7HoaS_CFa_Ix2HkpubNRN9-2XD9i78O8xFjXz2VmPPJPmIROyJRfwW0C3ypLM-jqQ-OSkhhyj31JuwxjlxzUd-IR-3AvH4MMVJ41bzXkxQmsCZgY-BYyQosWYUpvLD1J6qVbgYr2RXmxYQM8Xdrb6u')" }}></div>
                </div>
                
                <div className="absolute -bottom-6 -left-6 z-20">
                  <Magnetic pullStrength={0.25}>
                    <motion.div 
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                      className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-[1.5rem] shadow-2xl flex items-center justify-center border border-gray-100"
                    >
                      <div className="w-12 h-12 md:w-14 md:h-14 bg-jaci-yellow rounded-xl flex items-center justify-center shadow-lg shadow-jaci-yellow/30">
                        <span className="material-symbols-outlined text-white text-2xl md:text-3xl filled">lightbulb</span>
                      </div>
                    </motion.div>
                  </Magnetic>
                </div>
              </div>
            </ParallaxSection>
          </div>
        </div>

        {/* Section 2: Values - Unified with InteractionCard */}
        <div className="mb-48">
          <div className="text-center mb-24 flex flex-col items-center">
            <ScrollReveal>
              <GlassBadge icon="dna" colorClass="text-jaci-pink">Nuestro ADN</GlassBadge>
              <h3 className="text-4xl md:text-6xl font-black font-display text-slate-900 mb-8 tracking-tight mt-6">Lo que nos hace únicos</h3>
              <p className="text-slate-500 font-body text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">Cuatro pilares que sostienen nuestro compromiso con el futuro de tus hijos.</p>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ScrollReveal delay={0.1}>
              <InteractionCard borderColor={DESIGN_SYSTEM.colors.primary} className="h-full">
                <div className="flex flex-col gap-8 h-full">
                  <div className="w-16 h-16 rounded-2xl bg-primary-soft text-primary flex items-center justify-center border border-primary/20">
                    <span className="material-symbols-outlined text-3xl filled">psychology</span>
                  </div>
                  <div>
                    <h4 className="text-2xl font-black font-display text-slate-900 mb-4 tracking-tight">Mente Ágil</h4>
                    <p className="text-slate-500 text-sm leading-relaxed font-body">Estimulamos el pensamiento crítico y la curiosidad innata desde los 3 años.</p>
                  </div>
                </div>
              </InteractionCard>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <InteractionCard borderColor={DESIGN_SYSTEM.colors.pink} className="h-full">
                <div className="flex flex-col gap-8 h-full">
                  <div className="w-16 h-16 rounded-2xl bg-jaci-pink-soft text-jaci-pink flex items-center justify-center border border-jaci-pink/20">
                    <span className="material-symbols-outlined text-3xl filled">favorite</span>
                  </div>
                  <div>
                    <h4 className="text-2xl font-black font-display text-slate-900 mb-4 tracking-tight">Corazón Empático</h4>
                    <p className="text-slate-500 text-sm leading-relaxed font-body">La inteligencia emocional y la gestión de sentimientos es nuestra prioridad #1.</p>
                  </div>
                </div>
              </InteractionCard>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <InteractionCard borderColor={DESIGN_SYSTEM.colors.yellow} className="h-full">
                <div className="flex flex-col gap-8 h-full">
                  <div className="w-16 h-16 rounded-2xl bg-jaci-yellow-soft text-jaci-yellow flex items-center justify-center border border-jaci-yellow/20">
                    <span className="material-symbols-outlined text-3xl filled">rocket_launch</span>
                  </div>
                  <div>
                    <h4 className="text-2xl font-black font-display text-slate-900 mb-4 tracking-tight">Impulso Creativo</h4>
                    <p className="text-slate-500 text-sm leading-relaxed font-body">Sin miedo al error; premiamos la experimentación y la resolución lúdica.</p>
                  </div>
                </div>
              </InteractionCard>
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <InteractionCard borderColor={DESIGN_SYSTEM.colors.purple} className="h-full">
                <div className="flex flex-col gap-8 h-full">
                  <div className="w-16 h-16 rounded-2xl bg-jaci-purple-soft text-jaci-purple flex items-center justify-center border border-jaci-purple/20">
                    <span className="material-symbols-outlined text-3xl filled">groups</span>
                  </div>
                  <div>
                    <h4 className="text-2xl font-black font-display text-slate-900 mb-4 tracking-tight">Comunidad Viva</h4>
                    <p className="text-slate-500 text-sm leading-relaxed font-body">Un ecosistema de colaboración constante entre guías, padres y alumnos.</p>
                  </div>
                </div>
              </InteractionCard>
            </ScrollReveal>
          </div>
        </div>

        {/* Section 3: Floating Stats Card */}
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-jaci-pink/10 rounded-[4.5rem] blur-2xl"></div>
          <div className="relative bg-white/80 backdrop-blur-xl rounded-[4rem] p-10 md:p-16 shadow-soft border border-white overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <ScrollReveal>
                  <h3 className="text-3xl md:text-5xl font-black font-display text-slate-900 mb-10 leading-tight tracking-tight">
                    Más que una escuela, <br/>
                    una <span className="text-jaci-pink">segunda casa</span>.
                  </h3>
                  <div className="space-y-8">
                    <ImpactPoint title="15+ Años de Magia" desc="Evolucionando con las mejores pedagogías internacionales." />
                    <ImpactPoint title="Entorno Protegido" desc="Campus diseñado bajo estándares de neuroarquitectura." />
                    <ImpactPoint title="Resultados Reales" desc="Alumnos con autonomía, alegría y propósito." />
                  </div>
                </ScrollReveal>
              </div>

              <div className="flex flex-col gap-10">
                <div className="grid grid-cols-2 gap-12">
                  <StatBox count="500+" label="Graduados" color="text-primary" />
                  <StatBox count="98%" label="Felicidad" color="text-jaci-pink" />
                </div>
                <ScrollReveal>
                  <div className="p-8 bg-slate-50/50 rounded-[2rem] border border-slate-100 flex items-start gap-5 shadow-sm">
                    <span className="material-symbols-outlined text-jaci-yellow text-4xl filled">format_quote</span>
                    <p className="text-slate-600 italic font-body text-base leading-relaxed">
                      "JACI cambió la forma en que mi hijo ve el mundo. Ahora tiene hambre de saber cómo funciona todo y una empatía que nos asombra."
                      <span className="not-italic font-black text-[10px] uppercase tracking-widest text-slate-400 mt-4 block">— Familia González</span>
                    </p>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </div>

      </ViewContainer>
    </div>
  );
};

const ImpactPoint: React.FC<{ title: string, desc: string }> = ({ title, desc }) => (
  <div className="flex gap-4">
    <div className="w-6 h-6 rounded-full bg-jaci-green-soft flex items-center justify-center text-jaci-green shrink-0 mt-1 border border-jaci-green/10">
      <span className="material-symbols-outlined text-[14px] font-black">check</span>
    </div>
    <div>
      <h5 className="font-black font-display text-slate-900 text-lg tracking-tight mb-1">{title}</h5>
      <p className="text-slate-500 text-sm font-body leading-relaxed">{desc}</p>
    </div>
  </div>
);

const StatBox: React.FC<{ count: string, label: string, color: string }> = ({ count, label, color }) => (
  <div className="flex flex-col">
    <div className={`text-5xl md:text-6xl font-black font-display ${color} tracking-tighter mb-2`}>{count}</div>
    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{label}</div>
  </div>
);