import React from 'react';
import { ViewContainer, InteractionCard, GlassBadge, ScrollReveal, OptimizedImage } from '../components/MotionPrimitives';
import { DESIGN_SYSTEM } from '../types';

export const LevelsView: React.FC = () => {
  return (
    <div className="w-full">
      <ViewContainer>
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-24 flex flex-col items-center">
          <ScrollReveal>
            <GlassBadge icon="route" colorClass="text-jaci-purple">Ruta Educativa</GlassBadge>
            <h1 className={DESIGN_SYSTEM.typography.h1 + " mt-6"}>
              Tu camino en <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-jaci-purple to-jaci-yellow">JACI</span>
            </h1>
            <p className={DESIGN_SYSTEM.typography.body + " mt-8"}>
              Un recorrido diseñado para potenciar cada etapa del crecimiento, desde los primeros pasos hasta la autonomía total.
            </p>
          </ScrollReveal>
        </div>

        {/* Timeline Track */}
        <div className="relative w-full overflow-x-auto no-scrollbar pb-32 pt-12 px-4 snap-x snap-mandatory flex items-stretch gap-8 scroll-smooth">
          {[
            {
              id: "01",
              title: "CAP",
              subtitle: "Camino a la Primaria",
              age: "3 - 5 años",
              color: DESIGN_SYSTEM.colors.primary,
              icon: "child_care",
              img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBNZlftM73AD9x8L97Rhl_5DejCEzh3EgdYA_XIQRZ07xYRS5BQGsEQSOEh7rKYByF3NrstYqTX-HHqsZR6EMM8gUL0g89JD9VkOrJbwYxfpWv0zohD--WcFXhSfZ4mPtMk6mD8nBmkE4Wbua0VZ1MwrSh1E7TcTh0F6mDJ2rYlp_FGapjh144xOImeCJFgEVRB9JSEJbKdEkS5lw2BTKldvRToREzYIkB1FCBHDscEY27DWRmFf4HeXE6S2y51a0_VMmFy6sgz8xe8",
              desc: "Un entorno seguro donde los fundamentos del aprendizaje se construyen a través del juego y la exploración sensorial."
            },
            {
              id: "02",
              title: "Matemonster",
              subtitle: "Matemáticas Divertidas",
              age: "6 - 7 años",
              color: DESIGN_SYSTEM.colors.purple,
              icon: "calculate",
              img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAIiF5AreFo-Byd6qnAIoaqvMCoRo0VsDe7FZd97SaOSMKkM8INqb4jl-ii5oJKRxUbIDU7cP4iEc10c0qkKPfdJC-JGR9BV-IYYfwDOXq6l-ti4_yQM2Li3Xsxrq2Uwacj-p-oLBfcldbmWqjEZOtH7lA7oqdvlp76et2lAGqjk6AE5sW_E_j_oifAUGpTHb_rd8hwB5t2fwH56tnsNXykjVp6srrpQzk1UShfJfpW1f_Zhab1MW49dlduChAMvVBLt8USHQR70h2m",
              desc: "Transformamos los números en aventuras. Los niños descubren la lógica matemática de forma intuitiva y lúdica."
            },
            {
              id: "03",
              title: "Neuromonster",
              subtitle: "Desarrollo Lógico",
              age: "8 - 9 años",
              color: DESIGN_SYSTEM.colors.green,
              icon: "psychology",
              img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD0Gb4EvZz9Kkff8m6j207jaAhLwJWOBmiqHQlbEtd0AdLBtk9MVBwpjnWvKeu3E4se5oQn4s-gcczEaN1u01PoHaS60UssJRET3Vx13gCGw-x95BllhWXCvH8OKis7RGQai9lXv5_cBHK8dNqPKwIZN3e_hgvBWQMzEhiiVcITncYoidnZJIAajcTawbMM5tzr4M8rRevu8v76mGjkTT2LCccgseys1P-xuuqt7I7SDFT17jttb3sNP7FjX2Y09ioviAhYidmea523",
              desc: "Enfocado en potenciar el pensamiento crítico y la resolución de problemas a través de retos estimulantes."
            }
          ].map((level, i) => (
            <ScrollReveal key={level.id} delay={i * 0.1} className="min-w-[320px] md:min-w-[400px] snap-center">
              <InteractionCard borderColor={level.color} className="h-full !p-0">
                <div className="flex flex-col h-full">
                  <div className="relative overflow-hidden group">
                    <OptimizedImage src={level.img} alt={level.title} />
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-xl px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-800 shadow-md border border-white z-20">
                      {level.age}
                    </div>
                  </div>
                  <div className="p-8 md:p-10 flex flex-col flex-1 relative">
                    <span className="absolute -top-10 left-6 text-8xl font-black text-slate-900/5 select-none pointer-events-none group-hover:text-slate-900/10 transition-colors duration-500 leading-none">{level.id}</span>
                    <div className="flex items-center gap-4 mb-6 relative z-10">
                      <div className="size-12 rounded-2xl bg-white shadow-soft flex items-center justify-center border border-slate-100 group-hover:scale-110 transition-transform duration-500">
                        <span className="material-symbols-outlined text-2xl filled" style={{ color: level.color }}>{level.icon}</span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-black font-display text-slate-900 tracking-tight leading-none mb-1">{level.title}</h3>
                        <p className={DESIGN_SYSTEM.typography.label} style={{ color: level.color }}>{level.subtitle}</p>
                      </div>
                    </div>
                    <p className="text-base text-slate-500 font-body leading-relaxed mb-8 flex-1 relative z-10">
                      {level.desc}
                    </p>
                    <button className="w-full py-5 border-2 border-slate-100 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-500 font-display relative z-10">
                      Ver Programa
                    </button>
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