
import React from 'react';
import { ViewContainer, InteractionCard, GlassBadge, ScrollReveal, Magnetic, OptimizedImage } from '../components/MotionPrimitives';
import { DESIGN_SYSTEM } from '../types';

export const LocationsView: React.FC = () => {
  const LOCATIONS = [
    {
      id: 'centro',
      name: 'Ávila Camacho',
      label: 'Sucursal Centro',
      color: DESIGN_SYSTEM.colors.primary,
      softColor: 'bg-primary-soft',
      address: 'Av. Manuel Ávila Camacho 33',
      subtext: 'Zona Centro, 91000 Xalapa-Enríquez, Ver.',
      // Street View de la fachada de Ávila Camacho 33 (Heading ~245 para ver la entrada)
      image: 'https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=Yj4X_pU6z_fG0oD9T-Q1g&cb_client=search.gws-prod.gps&w=1200&h=800&yaw=245&pitch=0&thumbfov=90',
      masterUrl: 'https://maps.app.goo.gl/xUHCvBgKd2Rddjun9',
      embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3761.343513689239!2d-96.927163023955!3d19.526844941320496!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85db321946399c0d%3A0xb306129188e99e43!2sAv.%20Manuel%20%C3%81vila%20Camacho%2033%2C%20Zona%20Centro%2C%20Centro%2C%2091000%20Xalapa-Enr%C3%ADquez%2C%20Ver.!5e0!3m2!1sen!2smx!4v1710000000000!5m2!1sen!2smx'
    },
    {
      id: 'americas',
      name: 'Av. Américas',
      label: 'Sucursal Américas',
      color: DESIGN_SYSTEM.colors.yellow,
      softColor: 'bg-jaci-yellow-soft',
      address: 'Av. Américas 313',
      subtext: 'Dos de Abril, 91030 Xalapa-Enríquez, Ver.',
      // Street View de la fachada de Av. Américas 313 (Heading ~110 para ver la entrada)
      image: 'https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=U4vO0u_5v_z_p_p_p_p_p&cb_client=search.gws-prod.gps&w=1200&h=800&yaw=110&pitch=0&thumbfov=90',
      masterUrl: 'https://maps.app.goo.gl/9qz1tSqh8Eyec5eD9',
      embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3761.161476579973!2d-96.92383852395484!3d19.53488874112276!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85db321045996023%3A0xc343453303c7336e!2sAv.%20Am%C3%A9ricas%20313%2C%20Dos%20de%20Abril%2C%2091030%20Xalapa-Enr%C3%ADquez%2C%20Ver.!5e0!3m2!1sen!2smx!4v1710000000000!5m2!1sen!2smx'
    }
  ];

  return (
    <div className="w-full">
      <ViewContainer className="flex flex-col items-center">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-24 flex flex-col items-center">
          <ScrollReveal>
            <GlassBadge icon="distance">Campus Xalapa</GlassBadge>
            <h1 className={DESIGN_SYSTEM.typography.h1 + " mt-6"}>
              Nuestras sedes en <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-jaci-purple">JACI</span>
            </h1>
            <p className={DESIGN_SYSTEM.typography.body + " mt-8"}>
              Ubicaciones estratégicas diseñadas bajo la neuroarquitectura para potenciar el aprendizaje y la seguridad de tus hijos.
            </p>
          </ScrollReveal>
        </div>

        {/* Locations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full mb-20">
          {LOCATIONS.map((loc, idx) => (
            <ScrollReveal key={loc.id} delay={0.1 * (idx + 1)}>
              <InteractionCard borderColor={loc.color} className="!p-0 h-full overflow-hidden group">
                <div className="flex flex-col h-full">
                  <div className="w-full relative group overflow-hidden">
                    <OptimizedImage 
                      src={loc.image} 
                      alt={loc.label}
                      aspectRatio="aspect-video"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity z-10" />
                    <div className="absolute top-8 left-8 z-20">
                      <div className="bg-white/95 backdrop-blur-xl px-4 py-2 rounded-full shadow-lg flex items-center gap-2 border border-white/20">
                        <span className={`w-2 h-2 rounded-full animate-pulse`} style={{ backgroundColor: loc.color }}></span>
                        <span className={DESIGN_SYSTEM.typography.label + " !text-slate-800"}>{loc.label}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-8 md:p-10 flex flex-col flex-1 gap-10">
                    <div>
                      <h3 className={DESIGN_SYSTEM.typography.h3 + " mb-6"}>{loc.name}</h3>
                      <div className="flex items-start gap-4 p-5 bg-slate-50/50 rounded-2xl border border-slate-100 shadow-sm">
                        <div className={`size-10 rounded-xl ${loc.softColor} flex items-center justify-center shrink-0`}>
                          <span className="material-symbols-outlined filled" style={{ color: loc.color }}>location_on</span>
                        </div>
                        <p className="text-slate-600 font-body text-base leading-relaxed">
                          <span className="font-bold text-slate-900 block text-lg mb-1">{loc.address}</span>
                          {loc.subtext}
                        </p>
                      </div>
                    </div>

                    {/* Unified Interactive Map Container */}
                    <div className="relative w-full aspect-square md:aspect-video rounded-[2.5rem] overflow-hidden border-8 border-white shadow-soft group/map">
                      {/* Master Link Overlay: Captures all clicks and redirects to the master URL */}
                      <a 
                        href={loc.masterUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 z-30 cursor-pointer"
                        title="Ver mapa completo"
                      >
                        <div className="absolute inset-0 bg-primary/0 group-hover/map:bg-primary/5 transition-colors duration-500" />
                      </a>
                      
                      <iframe 
                        className="w-full h-full border-0 grayscale group-hover/map:grayscale-0 transition-all duration-700 pointer-events-none" 
                        src={loc.embedUrl}
                        allowFullScreen={true}
                        loading="lazy"
                        tabIndex={-1}
                      ></iframe>

                      {/* Explicit larger map indicator */}
                      <div className="absolute bottom-4 right-4 z-40 pointer-events-none opacity-0 group-hover/map:opacity-100 transition-opacity duration-500 translate-y-2 group-hover/map:translate-y-0">
                         <div className="bg-slate-900/90 backdrop-blur-md text-white text-[8px] font-black uppercase tracking-widest px-4 py-2 rounded-full flex items-center gap-2">
                           <span className="material-symbols-outlined text-xs">open_in_new</span>
                           Ver más grande
                         </div>
                      </div>
                    </div>

                    <Magnetic pullStrength={0.1}>
                      <a 
                        href={loc.masterUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full py-5 bg-slate-900 text-white rounded-full font-black font-display text-[10px] uppercase tracking-[0.2em] shadow-2xl hover:bg-primary transition-all duration-500 flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined text-sm">directions</span>
                        Ver en Google Maps
                      </a>
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
