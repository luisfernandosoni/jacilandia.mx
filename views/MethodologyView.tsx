
import React from 'react';
import { motion } from 'framer-motion';
import { ScrollReveal, InteractionCard, ViewContainer, GlassBadge, Magnetic, FloatingMonster, OptimizedImage } from '../components/MotionPrimitives';
import { DESIGN_SYSTEM } from '../types';

export const MethodologyView: React.FC = () => {
  return (
    <div className="w-full relative overflow-x-hidden min-h-screen">
      {/* Background Ambience - Unified Deep Field */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-[5%] right-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] left-[-5%] w-[500px] h-[500px] bg-jaci-pink/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-jaci-yellow/5 rounded-full blur-[100px]" />
      </div>

      <ViewContainer>
        {/* SECTION 1: HYBRID HERO (Vision + Play) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-24 items-center mb-32 md:mb-48 pt-12 md:pt-24">
          <motion.div className="flex flex-col gap-10">
            <ScrollReveal>
              <GlassBadge icon="auto_awesome" colorClass="text-jaci-yellow">Filosofía JACI</GlassBadge>
              <h1 className={DESIGN_SYSTEM.typography.h1}>
                Donde <span className="text-jaci-pink">jugar</span> es nuestra forma de aprender.
              </h1>
              <p className={DESIGN_SYSTEM.typography.body}>
                En JACI, no solo enseñamos materias; cultivamos la <span className="text-slate-900 font-bold underline decoration-jaci-yellow decoration-4 underline-offset-4">curiosidad infinita</span>. 
                Transformamos cada aula en un ecosistema de descubrimiento a través de nuestro Método JACI.
              </p>
            </ScrollReveal>
          </motion.div>

          <div className="relative mt-12 lg:mt-0 px-4">
             <ScrollReveal>
               <div className="relative group">
                 <div className="absolute -inset-4 md:-inset-6 border-4 border-dashed border-jaci-yellow/20 rounded-[3rem] md:rounded-[4rem] rotate-3" />
                 <div className="aspect-[4/3] rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden shadow-soft border-[8px] md:border-[12px] border-white relative z-10 bg-slate-50">
                    <div className="w-full h-full bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA4sB3k0FBFI_qENJexMKPDpIIadN6siWEcb1uScQwl1CeA8sBd_sKxm1D1oFg3A0I1FUDN9OVs6ofN7NhxlOOcqKZ_L2ctAEJIwxrxHxMK3CnEdPWifTw6t7HoaS_CFa_Ix2HkpubNRN9-2XD9i78O8xFjXz2VmPPJPmIROyJRfwW0C3ypLM-jqQ-OSkhhyj31JuwxjlxzUd-IR-3AvH4MMVJ41bzXkxQmsCZgY-BYyQosWYUpvLD1J6qVbgYr2RXmxYQM8Xdrb6u')" }}></div>
                 </div>
                 
                 {/* Monster: GULY */}
                 <div className="absolute -top-16 -right-6 md:-top-24 md:-right-12 z-20">
                   <FloatingMonster monster="GULY" size="size-36 md:size-56" />
                 </div>

                 {/* Vision Token */}
                 <div className="absolute -bottom-6 -left-6 z-30">
                  <Magnetic pullStrength={0.15}>
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-[1.5rem] shadow-2xl flex items-center justify-center border border-gray-100">
                      <div className="w-12 h-12 md:w-14 md:h-14 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30 text-white">
                        <span className="material-symbols-outlined text-2xl md:text-3xl filled">lightbulb</span>
                      </div>
                    </div>
                  </Magnetic>
                </div>
               </div>
             </ScrollReveal>
          </div>
        </div>

        {/* SECTION 2: EL MÉTODO JACI */}
        <div className="mb-48 max-w-5xl mx-auto px-4 relative">
            <ScrollReveal>
              <div className="flex flex-col lg:flex-row items-center justify-center gap-8 md:gap-12 text-center lg:text-left">
                <div className="flex flex-col items-center lg:items-start max-w-3xl">
                  <GlassBadge icon="palette" colorClass="text-jaci-purple">La Práctica</GlassBadge>
                  <h2 className={DESIGN_SYSTEM.typography.h2}>El <span className="text-jaci-yellow">Método</span> JACI</h2>
                  <p className={DESIGN_SYSTEM.typography.body + " mt-8"}>
                      Cada área del desarrollo se nutre con experiencias vivas. No memorizamos conceptos sueltos, construimos significados reales basados en la curiosidad y la experimentación constante.
                  </p>
                </div>
                
                {/* Monster: LY */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full scale-125 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <FloatingMonster monster="LY" size="size-48 md:size-64" className="relative z-10" />
                </div>
              </div>
            </ScrollReveal>
        </div>

        {/* SECTION 3: NUESTRO ADN */}
        <div className="mb-48">
          <div className="text-center mb-20 flex flex-col items-center">
            <ScrollReveal>
              <h2 className={DESIGN_SYSTEM.typography.h2}>Nuestro <span className="text-jaci-purple">ADN</span></h2>
              <p className={DESIGN_SYSTEM.typography.body + " mt-6 max-w-2xl mx-auto"}>
                Cuatro pilares fundamentales que integran ciencia, emoción y conocimiento para potenciar el genio de tus hijos.
              </p>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <ScrollReveal delay={0.1}>
              <InteractionCard borderColor={DESIGN_SYSTEM.colors.primary} className="h-full group !bg-white">
                <div className="flex flex-col gap-6 h-full items-center text-center">
                  <div className="relative h-44 w-full mb-2 flex items-center justify-center">
                    <OptimizedImage 
                      src="https://assets.jacilandia.mx/JACI_Activación Neuronal.png" 
                      alt="Activación Neuronal"
                      className="w-40 h-40 group-hover:scale-110 transition-transform duration-700 !bg-transparent"
                      aspectRatio="aspect-square"
                      objectFit="contain"
                    />
                  </div>
                  <div>
                    <h4 className="text-xl font-black font-display text-slate-900 mb-3 tracking-tight">Activación Neuronal</h4>
                    <p className="text-slate-500 text-sm leading-relaxed font-body">
                      Estimulamos las conexiones cerebrales a través del movimiento y retos cognitivos diseñados para despertar la agilidad mental.
                    </p>
                  </div>
                </div>
              </InteractionCard>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <InteractionCard borderColor={DESIGN_SYSTEM.colors.pink} className="h-full group !bg-white">
                <div className="flex flex-col gap-6 h-full items-center text-center">
                  <div className="relative h-44 w-full mb-2 flex items-center justify-center">
                    <OptimizedImage 
                      src="https://assets.jacilandia.mx/JACI_Desarrollo Emocional.png" 
                      alt="Desarrollo Emocional"
                      className="w-40 h-40 group-hover:scale-110 transition-transform duration-700 !bg-transparent"
                      aspectRatio="aspect-square"
                      objectFit="contain"
                    />
                  </div>
                  <div>
                    <h4 className="text-xl font-black font-display text-slate-900 mb-3 tracking-tight">Desarrollo Emocional</h4>
                    <p className="text-slate-500 text-sm leading-relaxed font-body">
                      Un entorno seguro donde aprenden a gestionar sus sentimientos, construyendo inteligencia emocional y autoestima.
                    </p>
                  </div>
                </div>
              </InteractionCard>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <InteractionCard borderColor={DESIGN_SYSTEM.colors.yellow} className="h-full group !bg-white">
                <div className="flex flex-col gap-6 h-full items-center text-center">
                  <div className="relative h-44 w-full mb-2 flex items-center justify-center">
                    <OptimizedImage 
                      src="https://assets.jacilandia.mx/JACI_Español.png" 
                      alt="Español"
                      className="w-40 h-40 group-hover:scale-110 transition-transform duration-700 !bg-transparent"
                      aspectRatio="aspect-square"
                      objectFit="contain"
                    />
                  </div>
                  <div>
                    <h4 className="text-xl font-black font-display text-slate-900 mb-3 tracking-tight">Habilidades de Lenguaje</h4>
                    <p className="text-slate-500 text-sm leading-relaxed font-body">
                      Dominio del español y lectura acelerada. Transformamos las letras en herramientas de comunicación poderosa.
                    </p>
                  </div>
                </div>
              </InteractionCard>
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <InteractionCard borderColor={DESIGN_SYSTEM.colors.purple} className="h-full group !bg-white">
                <div className="flex flex-col gap-6 h-full items-center text-center">
                  <div className="relative h-44 w-full mb-2 flex items-center justify-center">
                    <OptimizedImage 
                      src="https://assets.jacilandia.mx/JACI_Matématicas.png" 
                      alt="Matemáticas"
                      className="w-40 h-40 group-hover:scale-110 transition-transform duration-700 !bg-transparent"
                      aspectRatio="aspect-square"
                      objectFit="contain"
                    />
                  </div>
                  <div>
                    <h4 className="text-xl font-black font-display text-slate-900 mb-3 tracking-tight">Pensamiento Lógico</h4>
                    <p className="text-slate-500 text-sm leading-relaxed font-body">
                      Matemáticas divertidas y cálculo mental ágil. Resolvemos problemas reales con la seguridad de dominar los números.
                    </p>
                  </div>
                </div>
              </InteractionCard>
            </ScrollReveal>
          </div>
        </div>

        {/* SECTION 4: NUESTROS PROGRAMAS */}
        <div className="mb-48 flex flex-col items-center px-4">
          <ScrollReveal>
            <h2 className={DESIGN_SYSTEM.typography.h2 + " mb-16 md:mb-24 text-center"}>Nuestros <span className="text-jaci-green">Programas</span></h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
            {[
              { 
                name: 'Monstruocerebro en acción', 
                monster: 'TUFIN', 
                color: DESIGN_SYSTEM.colors.primary, 
                icon: 'psychology',
                desc: 'Neurodesarrollo dinámico y gimnasia cerebral para potenciar las capacidades cognitivas natas.'
              },
              { 
                name: 'Habilidades lectoras', 
                monster: 'POSITIVIN', 
                color: DESIGN_SYSTEM.colors.pink, 
                icon: 'menu_book',
                desc: 'Fluidez y comprensión profunda que transforman la lectura en un hábito de gozo y aprendizaje.'
              },
              { 
                name: 'Gamificación', 
                monster: 'POMPIN', 
                color: DESIGN_SYSTEM.colors.yellow, 
                icon: 'videogame_asset',
                desc: 'Usamos personajes y anclajes visuales. El aprendizaje es una aventura, no una obligación.'
              },
              { 
                name: 'Disciplina Positiva para Papás', 
                monster: 'KIKIN', 
                color: DESIGN_SYSTEM.colors.green, 
                icon: 'family_restroom',
                desc: 'Te acompañamos con herramientas prácticas para crear armonía y conexión profunda en casa.'
              }
            ].map((prog, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <InteractionCard borderColor={prog.color} className="h-full group !pb-24">
                  <div className="flex justify-between items-start mb-10">
                    <div className="size-14 rounded-2xl bg-white shadow-soft flex items-center justify-center text-slate-900 border border-slate-100">
                      <span className="material-symbols-outlined text-2xl" style={{ color: prog.color }}>{prog.icon}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mb-6">
                     <h4 className="text-xl md:text-2xl font-black font-display text-slate-900 leading-tight">{prog.name}</h4>
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed mb-12 font-body flex-grow">
                    {prog.desc}
                  </p>
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-center -mb-8 opacity-60 group-hover:opacity-100 transition-all duration-500 transform group-hover:-translate-y-2">
                      <FloatingMonster monster={prog.monster as any} size="size-24 md:size-32" />
                    </div>
                  </div>
                </InteractionCard>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* SECTION 5: SOCIAL PROOF */}
        <div className="relative mb-32">
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-jaci-pink/10 rounded-[4.5rem] blur-2xl"></div>
          <div className="relative bg-white/80 backdrop-blur-xl rounded-[4rem] p-10 md:p-16 shadow-soft border border-white overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <ScrollReveal>
                  <h3 className={DESIGN_SYSTEM.typography.h3 + " mb-10"}>
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
    <div className={DESIGN_SYSTEM.typography.label}>{label}</div>
  </div>
);
