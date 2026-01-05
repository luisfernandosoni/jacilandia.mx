
import React from 'react';
import { ViewContainer, InteractionCard, GlassBadge, ScrollReveal, Magnetic } from '../components/MotionPrimitives';
import { DESIGN_SYSTEM } from '../types';

export const LocationsView: React.FC = () => {
  return (
    <div className="w-full">
      <ViewContainer className="flex flex-col items-center">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-24 flex flex-col items-center">
          <ScrollReveal>
            <GlassBadge icon="distance">Campus Xalapa</GlassBadge>
            <h1 className="text-5xl md:text-7xl font-black font-display text-slate-900 tracking-tight leading-[0.95] mb-8 mt-6">
              Nuestras sedes en <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-jaci-purple">JACI</span>
            </h1>
            <p className="text-xl text-slate-500 font-body leading-relaxed">
              Ubicaciones estratégicas diseñadas bajo la neuroarquitectura para potenciar el aprendizaje y la seguridad de tus hijos.
            </p>
          </ScrollReveal>
        </div>

        {/* Locations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full mb-20">
          
          {/* Sucursal Centro - Ávila Camacho */}
          <ScrollReveal delay={0.1}>
            <InteractionCard borderColor={DESIGN_SYSTEM.colors.primary} className="!p-0 h-full overflow-hidden">
              <div className="flex flex-col h-full">
                <div className="h-72 md:h-96 w-full relative group">
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA-UKXNC-U7dc2fO-B0B9Cnyo3Dy8WyrvaMgN7UdSVnbGNkfu1shrCQzxAdNWCN31Bdwekwo0YAF7faiQ24E1yAIFDuSKdexMt3AnIcVeTIxtPDaB2BurM1lXhZdZeTtkhuuOJuODUbNt9qzZ6wnsGPcf3Ju_6sGx0Lqt74Q6tXSSAt7or1Z6VgPTaeRVNAvQpIBzr1BsD9iyEQ1hkSSlMwZCxIfKme-bJdXjdcdOM49lu_7uhVOaKqwo_nIi99pqAHaPakpbA4lNfb')" }}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  <div className="absolute top-8 left-8">
                    <div className="bg-white/95 backdrop-blur-xl px-4 py-2 rounded-full shadow-lg flex items-center gap-2 border border-white/20">
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-800">Sucursal Centro</span>
                    </div>
                  </div>
                </div>
                <div className="p-8 md:p-10 flex flex-col flex-1 gap-10">
                  <div>
                    <h3 className="text-4xl font-black font-display text-slate-900 mb-6 tracking-tight">Ávila Camacho</h3>
                    <div className="flex items-start gap-4 p-5 bg-slate-50/50 rounded-2xl border border-slate-100 shadow-sm">
                      <div className="size-10 rounded-xl bg-primary-soft text-primary flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined filled">location_on</span>
                      </div>
                      <p className="text-slate-600 font-body text-base leading-relaxed">
                        <span className="font-bold text-slate-900 block text-lg mb-1">Av. Manuel Ávila Camacho 33</span>
                        Zona Centro, 91000 Xalapa-Enríquez, Ver.
                      </p>
                    </div>
                  </div>
                  <div className="w-full h-64 rounded-[2.5rem] overflow-hidden border-8 border-white shadow-soft">
                    <iframe 
                      className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-700" 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3761.343513689239!2d-96.927163023955!3d19.526844941320496!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85db321946399c0d%3A0xb306129188e99e43!2sAv.%20Manuel%20%C3%81vila%20Camacho%2033%2C%20Zona%20Centro%2C%20Centro%2C%2091000%20Xalapa-Enr%C3%ADquez%2C%20Ver.!5e0!3m2!1sen!2smx!4v1710000000000!5m2!1sen!2smx"
                      allowFullScreen={true}
                      loading="lazy"
                    ></iframe>
                  </div>
                  <Magnetic pullStrength={0.1}>
                    <a 
                      href="https://maps.app.goo.gl/xUHCvBgKd2Rddjun9" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full py-5 bg-slate-900 text-white rounded-full font-black font-display text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-primary transition-all duration-500 flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">directions</span>
                      Ver en Google Maps
                    </a>
                  </Magnetic>
                </div>
              </div>
            </InteractionCard>
          </ScrollReveal>

          {/* Sucursal Americas */}
          <ScrollReveal delay={0.2}>
            <InteractionCard borderColor={DESIGN_SYSTEM.colors.yellow} className="!p-0 h-full overflow-hidden">
              <div className="flex flex-col h-full">
                <div className="h-72 md:h-96 w-full relative group">
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBAOchqhHrJPsbyE3vRkZtteyO_Pln_uubs-Sar_HIs8KSro7IRmhrtlzFquPj-1i8ovNZXwCJum1ssX9lzkUMM504vuG8Yf3f4wpDq7kx8_5IC6MjtdmAR-46Axyqy8h-W-Ct6RMH-zM-ElFU9jqGz46UvJxCtpzOh-7y_yKefDvi6NCb-1AYvY-_rMt_tBBCb6dRVF17FEKPZqKWSCRQvA9j7Wyn0wZgNy721DvJFiUQP70C4Ot29ClLyLVJU_g4rut4fTOZbMt5H')" }}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  <div className="absolute top-8 left-8">
                    <div className="bg-white/95 backdrop-blur-xl px-4 py-2 rounded-full shadow-lg flex items-center gap-2 border border-white/20">
                      <span className="w-2 h-2 rounded-full bg-jaci-yellow animate-pulse"></span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-800">Sucursal Américas</span>
                    </div>
                  </div>
                </div>
                <div className="p-8 md:p-10 flex flex-col flex-1 gap-10">
                  <div>
                    <h3 className="text-4xl font-black font-display text-slate-900 mb-6 tracking-tight">Av. Américas</h3>
                    <div className="flex items-start gap-4 p-5 bg-slate-50/50 rounded-2xl border border-slate-100 shadow-sm">
                      <div className="size-10 rounded-xl bg-jaci-yellow-soft text-jaci-yellow flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined filled">location_on</span>
                      </div>
                      <p className="text-slate-600 font-body text-base leading-relaxed">
                        <span className="font-bold text-slate-900 block text-lg mb-1">Av. Américas 313</span>
                        Dos de Abril, 91030 Xalapa-Enríquez, Ver.
                      </p>
                    </div>
                  </div>
                  <div className="w-full h-64 rounded-[2.5rem] overflow-hidden border-8 border-white shadow-soft">
                    <iframe 
                      className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-700" 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3761.161476579973!2d-96.92383852395484!3d19.53488874112276!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85db321045996023%3A0xc343453303c7336e!2sAv.%20Am%C3%A9ricas%20313%2C%20Dos%20de%20Abril%2C%2091030%20Xalapa-Enr%C3%ADquez%2C%20Ver.!5e0!3m2!1sen!2smx!4v1710000000000!5m2!1sen!2smx"
                      allowFullScreen={true}
                      loading="lazy"
                    ></iframe>
                  </div>
                  <Magnetic pullStrength={0.1}>
                    <a 
                      href="https://maps.app.goo.gl/9qz1tSqh8Eyec5eD9" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full py-5 bg-slate-900 text-white rounded-full font-black font-display text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-jaci-yellow hover:text-slate-900 transition-all duration-500 flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">directions</span>
                      Ver en Google Maps
                    </a>
                  </Magnetic>
                </div>
              </div>
            </InteractionCard>
          </ScrollReveal>
        </div>
      </ViewContainer>
    </div>
  );
};
