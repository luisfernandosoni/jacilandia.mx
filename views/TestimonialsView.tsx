import React from 'react';
import { motion } from 'framer-motion';
import { ViewContainer, InteractionCard, ScrollReveal, GlassBadge } from '../components/MotionPrimitives';
import { Testimonial, DESIGN_SYSTEM } from '../types';

const testimonials: Testimonial[] = [
  {
    name: "María González",
    role: "Madre de alumno",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXu44SmGmKP9fCCh__syP6BTma23MBBixCa8b1Dc17_1Ky9e8WOOuUlFVo5RKMQ7mQgrn1SzC9kXLRcijDhkVNlMCP-mZEmJQ-uOrSKjS9CC1-dv5LIUcNOjDbftC-fUuDP7SSDMzAAO0RF5P8cOnnPz8PoEHgQjNVDzSbD8aKpluHYHWBu62WFFTVdp0ZKhjoF65z_B8UdGXnfuOSte51Ofy_eiAwd2NjzibrcpbG-oYMwkVl7S4q18ydM-faN1MlYuFg_sDI6O_7X8",
    text: "Los maestros son increíbles y el ambiente es muy acogedor. Desde que mi hijo entró a JACI, notamos un cambio positivo en su actitud. ¡Está feliz!",
    color: "#25C0F4"
  },
  {
    name: "Carlos Ruiz",
    role: "Padre de familia",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCoIICYRdp2BSAH2_SuR5-jRPSQmlpgk0RCHn2BCFMExj7EgIXVKe2ae6kH0-7ZLLzp-OhdXJ_EOVzogAXwj7jqLYoYoNmPVQfx03UI23Fhld9VxlaqNzoek8Ke1ssBmvXcEgokHMuoyRf1iY29Rb-bhFo1L4XoFf3TVfoGKl0IPSIvQMBPGht8agrXyaqegPcxOkktyklAHBgfoN7EuxDhGGH7tjTPS0cIzyVoUgHrBJabbXeQt3J_PX-aN9pOWxS_AJCetJECmofL",
    text: "El nivel académico ha superado nuestras expectativas. La comunicación es fluida y siempre están atentos a las necesidades de mi hija.",
    color: "#22C55E"
  },
  {
    name: "Sofía Martínez",
    role: "Ex-Alumna",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDR0tySkbEHibDpUmBg98e7VMYS2WU-3PLgx4v5Vu64NW3ztcI10feFLHuHq5oPi6mm_WsbwxgU60kRi1EH3JmOlUVdHymJz1Z0jhShZpmvBUt-13OYeJU71R7Un3vAYj1NtJEEO0pkNUfOAxaRUioWNnVMwmi3udtmAjHfU-b3ZnQ6NOOvd6FbIC0khiYreGCx9EkKvf1ZldT4DxECDgKXPrJdTCNK88bgMj1CFQKQCQAjvmF5IaMg3Nw5DR9CtFzqLSEN-fjqdsqt",
    text: "JACI no es solo una escuela, es una segunda casa. Los valores que aprendí aquí me han acompañado en toda mi carrera universitaria.",
    color: "#F472B6"
  }
];

export const TestimonialsView: React.FC = () => {
  return (
    <div className="relative w-full">
      <ViewContainer>
        <div className="text-center max-w-3xl mx-auto flex flex-col items-center mb-24">
          <ScrollReveal>
            <GlassBadge icon="forum" colorClass="text-jaci-pink">Testimonios</GlassBadge>
            <h1 className="text-5xl md:text-7xl font-black font-display text-slate-900 tracking-tight leading-[0.95] mb-8 mt-6">
              Lo que dicen nuestras <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-jaci-purple">familias</span>
            </h1>
            <p className="text-xl text-slate-500 font-body leading-relaxed">
              Historias reales de padres y alumnos que forman parte de nuestro crecimiento diario y nuestra magia.
            </p>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {testimonials.map((t, idx) => (
            <ScrollReveal key={idx} delay={idx * 0.1}>
              <InteractionCard borderColor={t.color} className="h-full">
                <div className="flex flex-col gap-8 h-full">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="bg-center bg-no-repeat bg-cover rounded-2xl size-14 shadow-sm border-2 border-white" style={{ backgroundImage: `url('${t.image}')` }}></div>
                      <div className={`absolute -bottom-2 -right-2 bg-slate-900 text-white rounded-full p-1.5 border-2 border-white shadow-lg`}>
                        <span className="material-symbols-outlined text-[12px] block filled">format_quote</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-slate-900 text-lg font-black leading-tight font-display tracking-tight">{t.name}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{t.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 text-jaci-yellow">
                    {[1,2,3,4,5].map(star => <span key={star} className="material-symbols-outlined text-[18px] filled">star</span>)}
                  </div>
                  <p className="text-slate-600 text-base leading-relaxed font-body italic flex-1">"{t.text}"</p>
                </div>
              </InteractionCard>
            </ScrollReveal>
          ))}
        </div>
      </ViewContainer>
    </div>
  );
};