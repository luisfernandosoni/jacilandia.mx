
import React from 'react';
import { ViewContainer, InteractionCard, GlassBadge, ScrollReveal, FloatingMonster, Magnetic } from '../components/MotionPrimitives';
import { DESIGN_SYSTEM } from '../types';

export const LevelsView: React.FC = () => {
  const levels = [
    {
      id: "01",
      title: "JACILINGÜES",
      subtitle: "Preescolar / 4+ años",
      monster: "TUI",
      color: "#25c0f4",
      icon: "child_care",
      desc: "Para los pequeños exploradores que inician su viaje. Navegamos juntos el 2° y 3° de preescolar. Trabajamos motricidad, seguimiento de instrucciones y los primeros pasos hacia la lectoescritura.",
      mantra: "Aprender es nuestra mayor aventura",
      result: "Que amen aprender desde el día uno."
    },
    {
      id: "02",
      title: "CAP",
      subtitle: "Lectura Acelerada / Camino a la Primaria",
      monster: "POMPIN",
      color: "#f472b6",
      icon: "menu_book",
      desc: "Nuestro programa estrella. ¿Problemas para leer? En menos de un mes, fortalecemos su cerebro para lograrlo. Fortalecemos las conexiones neuronales necesarias para la fluidez.",
      mantra: "Si puedo, es fácil, ¡LO HAGO!",
      result: "Seguridad impresionante y lectura fluida."
    },
    {
      id: "03",
      title: "MATEMONSTER",
      subtitle: "1º y 2º de Primaria",
      monster: "PEPE",
      color: "#fbbf24",
      icon: "calculate",
      desc: "Mejoramos cálculo mental, fluidez y comprensión lectora para que lo académico deje de ser una pesadilla. Un camino de éxito diseñado para el dominio numérico.",
      mantra: "Eres único, valórate",
      result: "Seguridad para enfrentar el aula y la vida social."
    },
    {
      id: "04",
      title: "NEUROMONSTER",
      subtitle: "3º y 4º de Primaria",
      monster: "POW",
      color: "#a78bfa",
      icon: "psychology",
      desc: "¡Adiós al miedo a las tablas y la ortografía! Para los genios que batallan con multiplicaciones, divisiones, fracciones o confunden la 'b' con la 'd'.",
      mantra: "Serás capaz de cualquier cosa",
      result: "Dominio académico y corrección de dislexias visuales."
    },
    {
      id: "05",
      title: "MONSTRUOMENTES",
      subtitle: "5º y 6º de Primaria",
      monster: "TOMAS",
      color: "#22c55e",
      icon: "rocket_launch",
      desc: "Preparándolos para el gran salto. Las matemáticas se complican, pero las emociones también. Aquí construimos autoestima blindada para la adolescencia.",
      mantra: "Nadie es como tú, ¡y ese es tu poder!",
      result: "Valores firmes y habilidades para surfear cualquier cambio."
    }
  ];

  return (
    <div className="w-full pb-32">
      <ViewContainer className="!px-3 sm:!px-5 md:!px-16">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-16 md:mb-28 flex flex-col items-center pt-8">
          <ScrollReveal>
            <GlassBadge icon="route" colorClass="text-jaci-purple">El Viaje de los Monstruos</GlassBadge>
            <h1 className={DESIGN_SYSTEM.typography.h1 + " mt-6 px-2"}>
              Tu camino en <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-jaci-purple to-jaci-yellow">JACI</span>
            </h1>
            <p className={DESIGN_SYSTEM.typography.body + " mt-8 px-4 text-base md:text-xl"}>
              Un recorrido diseñado para potenciar cada etapa del crecimiento, guiado por nuestros compañeros más brillantes.
            </p>
          </ScrollReveal>
        </div>

        {/* Improved Grid Layout - Tight margins for mobile visibility */}
        <div className="flex flex-wrap justify-center gap-5 md:gap-10">
          {levels.map((level, i) => (
            <div key={level.id} className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.33%-27px)] flex-grow-0 shrink-0">
              <ScrollReveal delay={i * 0.05}>
                <InteractionCard borderColor={level.color} className="h-full !p-0 group !border-l-[6px]">
                  <div className="flex flex-col h-full bg-white relative pt-20 sm:pt-24 md:pt-28">
                    
                    {/* Level Category Badge */}
                    <div className="absolute top-5 right-5 sm:top-6 sm:right-6 md:top-8 md:right-8 z-30">
                      <div className="bg-slate-50/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[9px] md:text-xs font-black uppercase tracking-widest text-slate-500 shadow-sm border border-white">
                        {level.subtitle}
                      </div>
                    </div>

                    {/* Monster Container */}
                    <div className="h-28 sm:h-32 md:h-40 relative flex items-center justify-center overflow-visible mb-2 sm:mb-4">
                      <FloatingMonster 
                        monster={level.monster as any} 
                        size="size-36 sm:size-40 md:size-48 group-hover:scale-105 transition-transform duration-500" 
                      />
                    </div>

                    {/* Content Section with Fluid Typography */}
                    <div className="p-5 sm:p-6 md:p-10 pt-4 md:pt-6 flex flex-col flex-1 relative z-10">
                      {/* Ghost Numbering */}
                      <span className="absolute right-4 top-[20%] -translate-y-1/2 text-[8rem] md:text-[11rem] font-black text-slate-200/20 select-none pointer-events-none tracking-tighter z-0">
                        {level.id}
                      </span>
                      
                      <div className="flex items-start gap-3 sm:gap-4 mb-6 sm:mb-8 relative z-10">
                        <div className="size-12 sm:size-14 md:size-16 rounded-2xl bg-white shadow-soft flex items-center justify-center border border-slate-100 shrink-0 mt-0.5">
                          <span className="material-symbols-outlined text-2xl sm:text-3xl md:text-4xl filled" style={{ color: level.color }}>{level.icon}</span>
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                          {/* Fluid Title: Clamp ensures it fits within the card width on all devices */}
                          <h3 className="text-[7.5vw] sm:text-[3.5vw] md:text-5xl font-black font-display text-slate-900 leading-[0.85] tracking-tight uppercase break-words hyphens-auto overflow-hidden">
                            {level.title}
                          </h3>
                          <p className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] mt-2 md:mt-3" style={{ color: level.color }}>
                            GUÍA: <span className="text-slate-900">{level.monster}</span>
                          </p>
                        </div>
                      </div>

                      <p className="text-sm md:text-base text-slate-500 font-body leading-relaxed mb-8 sm:mb-10 flex-1 relative z-10">
                        {level.desc}
                      </p>

                      {/* Mantra Box */}
                      <div className="mb-6 sm:mb-8 p-5 sm:p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] bg-slate-100/50 border border-slate-200/30 relative z-10 text-center">
                         <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-3 md:mb-4">Mantra Maestro</span>
                         <p className="text-base sm:text-lg md:text-2xl font-display font-black text-slate-900 leading-tight">
                           “{level.mantra}”
                         </p>
                      </div>

                      {/* Result Row */}
                      <div className="relative z-10">
                         <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-3 md:mb-4">Impacto Directo</span>
                         <div className="flex items-center gap-3 sm:gap-4 bg-slate-50/80 p-3 sm:p-4 md:p-5 rounded-2xl md:rounded-3xl border border-slate-100/80">
                           <div className="size-7 sm:size-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: level.color + '20' }}>
                             <span className="material-symbols-outlined text-[14px] md:text-[16px] font-black" style={{ color: level.color }}>check</span>
                           </div>
                           <p className="text-slate-900 font-bold text-sm md:text-lg leading-tight flex-1">{level.result}</p>
                         </div>
                      </div>
                    </div>
                  </div>
                </InteractionCard>
              </ScrollReveal>
            </div>
          ))}
        </div>

        {/* Final CTA */}
        <div className="mt-24 md:mt-36 flex flex-col items-center text-center px-4">
           <ScrollReveal>
              <p className="text-slate-500 font-body text-sm md:text-xl mb-10 md:mb-12 max-w-2xl mx-auto leading-relaxed">
                ¿No sabes por dónde empezar? Realiza nuestro test diagnóstico gratuito para encontrar el nivel ideal para tu hijo.
              </p>
              <div className="flex justify-center w-full">
                <Magnetic pullStrength={0.15}>
                  <button className="w-full sm:w-auto px-10 md:px-16 py-5 sm:py-6 md:py-7 bg-primary text-white rounded-full font-black font-display text-[9px] md:text-[11px] uppercase tracking-[0.3em] shadow-xl hover:scale-105 active:scale-95 transition-all">
                    Agendar Diagnóstico Gratis
                  </button>
                </Magnetic>
              </div>
           </ScrollReveal>
        </div>
      </ViewContainer>
    </div>
  );
};
