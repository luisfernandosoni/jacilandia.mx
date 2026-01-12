
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ViewContainer, ScrollReveal, InteractionCard, GlassBadge, OptimizedImage, FloatingMonster } from '../components/MotionPrimitives';
import { DESIGN_SYSTEM } from '../types';

export const AboutView: React.FC = () => {
  return (
    <div className="relative w-full overflow-hidden min-h-screen" lang="es">
      {/* Background Subtle Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-[10%] right-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[20%] left-[-10%] w-[600px] h-[600px] bg-jaci-purple/5 rounded-full blur-[120px]" />
      </div>

      <ViewContainer className="pt-20 lg:pt-32 pb-40">
        
        {/* NUESTRA HISTORIA BADGE - Movido arriba del grid para permitir alineación perfecta abajo */}
        <div className="flex justify-start mb-12 lg:mb-16">
          <ScrollReveal>
            <GlassBadge icon="history_edu" colorClass="text-jaci-purple">Nuestra Historia</GlassBadge>
          </ScrollReveal>
        </div>

        {/* SECTION 1: FOUNDER HERO - Alineación perfecta entre imagen y texto */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start mb-40">
          
          {/* Image Column */}
          <div className="lg:col-span-5 order-2 lg:order-1 relative">
            <ScrollReveal>
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 via-white/0 to-jaci-pink/20 rounded-[3.5rem] blur-2xl group-hover:blur-3xl transition-all duration-700" />
                
                <div className="relative rounded-[3rem] overflow-hidden border-[8px] border-white shadow-soft bg-slate-50 aspect-[4/5]">
                  <OptimizedImage 
                    src="https://assets.jacilandia.mx/JessydeJACI.jpg" 
                    alt="Mtra. Jessica Cadenas"
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-1000"
                    aspectRatio="aspect-[4/5]"
                    priority="high"
                  />
                  
                  {/* Floating Badge */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-white/95 backdrop-blur-xl p-4 rounded-2xl shadow-lg border border-white/50 flex items-center gap-4">
                      <div className="w-12 h-12 bg-jaci-purple rounded-xl flex items-center justify-center text-white shadow-md">
                        <span className="material-symbols-outlined text-2xl filled">auto_awesome</span>
                      </div>
                      <div>
                        <p className="text-slate-900 font-black font-display text-lg leading-none">Jessica Cadenas</p>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Fundadora de JACI</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative Monster: POMPIN */}
                <div className="absolute -top-12 -left-12 opacity-80 z-20">
                  <FloatingMonster monster="POMPIN" size="size-32 md:size-40" delay={0.5} />
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Content Column */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <ScrollReveal delay={0.2}>
              <h1 className={DESIGN_SYSTEM.typography.h1 + " mb-8"}>
                La <span className="text-transparent bg-clip-text bg-gradient-to-r from-jaci-purple to-primary">mente</span> detrás.
              </h1>
              
              <div className="space-y-6 text-lg md:text-xl text-slate-500 font-body leading-relaxed">
                <p>
                  <span className="text-slate-900 font-bold">¿Quién está detrás de JACI?</span> Soy Jessica Cadenas y hace 8 años tuve una revelación: los niños no fallan por falta de capacidad, fallan por falta de confianza y metodología adaptada a su neurodesarrollo.
                </p>
                <p>
                  JACI nació en Xalapa, Veracruz, con la inquietud de fusionar el <span className="text-jaci-pink font-bold underline decoration-jaci-pink/30 underline-offset-4">juego</span> con el aprendizaje riguroso.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-12">
                <div className="p-6 md:p-8 rounded-[2rem] bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-jaci-green/20 transition-all duration-500 group/stat flex flex-col min-w-0 overflow-hidden">
                  <span className="material-symbols-outlined text-4xl text-jaci-green mb-6 filled group-hover/stat:scale-110 transition-transform">trending_up</span>
                  <h4 className="font-black font-display text-slate-900 text-[clamp(1.1rem,2.5vw,1.5rem)] mb-4 leading-tight tracking-tight break-words hyphens-auto text-balance">Resultados Reales</h4>
                  <p className="text-sm text-slate-600 font-medium font-body leading-relaxed">Más de 2,000 niños han desbloqueado su máximo potencial con nosotros.</p>
                </div>
                <div className="p-6 md:p-8 rounded-[2rem] bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-jaci-purple/20 transition-all duration-500 group/stat flex flex-col min-w-0 overflow-hidden">
                  <span className="material-symbols-outlined text-4xl text-jaci-purple mb-6 filled group-hover/stat:scale-110 transition-transform">psychology_alt</span>
                  <h4 className="font-black font-display text-slate-900 text-[clamp(1.1rem,2.5vw,1.5rem)] mb-4 leading-tight tracking-tight break-words hyphens-auto text-balance">Experta en Neurodesarrollo</h4>
                  <p className="text-sm text-slate-600 font-medium font-body leading-relaxed">Mi enfoque mezcla la activación neuronal con el corazón, creando una generación de niños felices y capaces.</p>
                </div>
                <div className="p-6 md:p-8 rounded-[2rem] bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-500 group/stat flex flex-col min-w-0 overflow-hidden">
                  <span className="material-symbols-outlined text-4xl text-primary mb-6 filled group-hover/stat:scale-110 transition-transform">emoji_events</span>
                  <h4 className="font-black font-display text-slate-900 text-[clamp(1.1rem,2.5vw,1.5rem)] mb-4 leading-tight tracking-tight break-words hyphens-auto text-balance">Pioneros en Xalapa</h4>
                  <p className="text-sm text-slate-600 font-medium font-body leading-relaxed">Creadores de un método divertido y funcional para enseñar a leer.</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* SECTION 2: CREDENTIALS WALL */}
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className={DESIGN_SYSTEM.typography.h2}>Formación de <span className="text-jaci-pink">clase mundial</span> en Xalapa</h2>
              <p className={DESIGN_SYSTEM.typography.body + " mt-4"}>Nuestra fundadora es egresada de la Benemérita Escuela Normal Veracruzana.</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <ScrollReveal delay={0.1}>
              <InteractionCard borderColor={DESIGN_SYSTEM.colors.primary} className="h-full bg-slate-50/30">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
                    <span className="material-symbols-outlined text-2xl filled">school</span>
                  </div>
                  <h3 className="text-2xl font-black font-display text-slate-900">Formación Académica</h3>
                </div>
                
                <ul className="space-y-4">
                   <li className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-primary/20 shadow-sm mb-4">
                      <div className="mt-1 text-primary">
                        <span className="material-symbols-outlined text-xl filled">history_edu</span>
                      </div>
                      <div>
                        <span className="text-slate-900 font-black font-display text-base block mb-0.5">Educación Especial</span>
                        <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block">Benemérita Escuela Normal Veracruzana</span>
                      </div>
                   </li>

                   <li className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-jaci-purple/20 shadow-sm mb-6">
                      <div className="mt-1 text-jaci-purple">
                        <span className="material-symbols-outlined text-xl filled">psychology_alt</span>
                      </div>
                      <div>
                        <span className="text-slate-900 font-black font-display text-base block mb-0.5">Master Internacional en Psicología Infantojuvenil</span>
                        <span className="text-jaci-purple text-xs font-bold uppercase tracking-wider block">(Especialización Global)</span>
                      </div>
                   </li>

                  {[
                    <>Diplomado Internacional en <strong>Autismo</strong> y <strong>TDAH</strong></>,
                    <>Diplomado en Intervención en alumnos con <strong>TDAH</strong></>,
                    <>Diplomado en <strong>Neurobiología</strong> del desarrollo</>,
                    <>Diplomado en <strong>Funciones ejecutivas</strong></>,
                    <>Diplomado en <strong>Regulación emocional</strong> UNAM</>,
                    <>Diplomado en <strong>Mindfulness</strong></>,
                    <>Diplomado en <strong>Ciencias de la felicidad</strong></>,
                    <>Diplomado en Juegos y movimientos para la <strong>activación neuronal</strong></>
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 pl-2">
                      <span className="material-symbols-outlined text-primary text-base mt-0.5 filled opacity-70">check_circle</span>
                      <span className="text-slate-800 font-body text-sm font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </InteractionCard>
            </ScrollReveal>

            <div className="flex flex-col gap-8">
              <ScrollReveal delay={0.2}>
                <InteractionCard borderColor={DESIGN_SYSTEM.colors.green} className="bg-slate-50/30">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-jaci-green rounded-xl flex items-center justify-center text-white shadow-lg shadow-jaci-green/30">
                      <span className="material-symbols-outlined text-2xl filled">verified</span>
                    </div>
                    <h3 className="text-2xl font-black font-display text-slate-900">Certificaciones</h3>
                  </div>
                  <ul className="space-y-6">
                    <li className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-jaci-green text-lg mt-0.5 filled">workspace_premium</span>
                      <div>
                        <span className="text-slate-900 font-black block text-base">Disciplina Positiva</span>
                        <span className="text-slate-600 text-sm font-medium">Certificada por la <strong>PDA</strong></span>
                      </div>
                    </li>
                  </ul>
                </InteractionCard>
              </ScrollReveal>

              <ScrollReveal delay={0.3}>
                <InteractionCard borderColor={DESIGN_SYSTEM.colors.yellow} className="bg-slate-50/30 flex-1">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-jaci-yellow rounded-xl flex items-center justify-center text-white shadow-lg shadow-jaci-yellow/30">
                      <span className="material-symbols-outlined text-2xl filled">stars</span>
                    </div>
                    <h3 className="text-2xl font-black font-display text-slate-900">Estándares SEP-CONOCER</h3>
                  </div>
                  <div className="space-y-4">
                    {[
                      { code: "EC1158", desc: "Habilidades socioemocionales y metodologías" },
                      { code: "EC0301", desc: "Diseño de cursos de formación" },
                      { code: "EC0217.01", desc: "Impartición de cursos de formación" },
                      { code: "EC0076", desc: "Evaluación de la competencia" }
                    ].map((std, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-jaci-yellow/40 hover:shadow-md transition-all">
                        <div className="flex flex-col items-center justify-center bg-slate-900 text-white min-w-[75px] py-2 rounded-xl">
                          <span className="text-[10px] font-black uppercase tracking-wider leading-none mb-1 opacity-60">CÓDIGO</span>
                          <span className="text-sm font-black tracking-tighter">{std.code}</span>
                        </div>
                        <span className="text-slate-900 text-sm font-black leading-tight">{std.desc}</span>
                      </div>
                    ))}
                  </div>
                </InteractionCard>
              </ScrollReveal>
            </div>
          </div>
        </div>

      </ViewContainer>
    </div>
  );
};
