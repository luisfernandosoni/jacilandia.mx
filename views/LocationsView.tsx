
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ViewContainer, InteractionCard, GlassBadge, ScrollReveal, Magnetic, OptimizedImage } from '../components/MotionPrimitives';
import { DESIGN_SYSTEM } from '../types';

// Tipado para TypeScript y Google Maps
declare global {
  interface Window {
    google: any;
    gm_authFailure?: () => void;
  }
}

interface LocationConfig {
  id: string;
  name: string;
  label: string;
  color: string;
  softColor: string;
  address: string;
  subtext: string;
  masterUrl: string;
  embedUrl: string;
  coordinates: { lat: number; lng: number };
  pov: { heading: number; pitch: number };
  fallbackImage: string;
}

const LOCATIONS: LocationConfig[] = [
  {
    id: 'centro',
    name: 'Ávila Camacho',
    label: 'Sucursal Centro',
    color: DESIGN_SYSTEM.colors.primary,
    softColor: 'bg-primary-soft',
    address: 'Av. Manuel Ávila Camacho 33',
    subtext: 'Zona Centro, 91000 Xalapa-Enríquez, Ver.',
    masterUrl: 'https://maps.app.goo.gl/xUHCvBgKd2Rddjun9',
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3761.343513689239!2d-96.927163023955!3d19.526844941320496!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85db321946399c0d%3A0xb306129188e99e43!2sAv.%20Manuel%20%C3%81vila%20Camacho%2033%2C%20Zona%20Centro%2C%20Centro%2C%2091000%20Xalapa-Enr%C3%ADquez%2C%20Ver.!5e0!3m2!1sen!2smx!4v1710000000000!5m2!1sen!2smx',
    coordinates: { lat: 19.526845, lng: -96.927163 },
    pov: { heading: 235, pitch: 5 },
    fallbackImage: 'https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=Yj4X_pU6z_fG0oD9T-Q1g&cb_client=search.gws-prod.gps&w=1200&h=800&yaw=245&pitch=0&thumbfov=90'
  },
  {
    id: 'americas',
    name: 'Av. Américas',
    label: 'Sucursal Américas',
    color: DESIGN_SYSTEM.colors.yellow,
    softColor: 'bg-jaci-yellow-soft',
    address: 'Av. Américas 313',
    subtext: 'Dos de Abril, 91030 Xalapa-Enríquez, Ver.',
    masterUrl: 'https://maps.app.goo.gl/9qz1tSqh8Eyec5eD9',
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3761.161476579973!2d-96.92383852395484!3d19.53488874112276!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85db321045996023%3A0xc343453303c7336e!2sAv.%20Am%C3%A9ricas%20313%2C%20Dos%20de%20Abril%2C%2091030%20Xalapa-Enr%C3%ADquez%2C%20Ver.!5e0!3m2!1sen!2smx!4v1710000000000!5m2!1sen!2smx',
    coordinates: { lat: 19.534889, lng: -96.923839 },
    pov: { heading: 110, pitch: 0 },
    fallbackImage: 'https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=U4vO0u_5v_z_p_p_p_p_p&cb_client=search.gws-prod.gps&w=1200&h=800&yaw=110&pitch=0&thumbfov=90'
  }
];

/**
 * Componente StreetView robusto con Fallback.
 * Intenta cargar el panorama interactivo. Si falla (por API Key, red, cuota), muestra la imagen estática.
 */
const StreetView: React.FC<{ location: LocationConfig }> = ({ location }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const initMap = useCallback(() => {
    if (!containerRef.current || !window.google || !window.google.maps) return;

    try {
      const panorama = new window.google.maps.StreetViewPanorama(containerRef.current, {
        position: location.coordinates,
        pov: location.pov,
        zoom: 0,
        addressControl: false,
        linksControl: false,
        panControl: false,
        enableCloseButton: false,
        fullscreenControl: false,
        zoomControl: false,
        motionTracking: false,
        motionTrackingControl: false,
        showRoadLabels: false,
        disableDefaultUI: true, // Interfaz limpia
        clickToGo: true,
      });
      
      // Listener para saber cuando el panorama está listo y quitar el loader
      panorama.addListener("status_changed", () => {
        if (panorama.getStatus() === "OK") {
          setIsLoading(false);
        } else {
          console.warn(`Street View status not OK for ${location.name}:`, panorama.getStatus());
          setIsError(true);
        }
      });

    } catch (e) {
      console.error("Error initializing Street View:", e);
      setIsError(true);
    }
  }, [location]);

  useEffect(() => {
    // 1. Obtener API Key de forma segura
    let apiKey = '';
    
    try {
      // Intentamos leer la variable estándar de Vite
      // Fix: Cast import.meta to any to avoid TS error 'Property env does not exist on type ImportMeta'
      apiKey = (import.meta as any).env.VITE_GOOGLE_MAPS_API_KEY || '';
    } catch (e) {
      // Si import.meta.env falla, asumimos error
      console.warn("Could not read env vars");
    }

    // Si no hay key, vamos directo al fallback
    if (!apiKey) {
      console.warn("Missing VITE_GOOGLE_MAPS_API_KEY");
      setIsError(true);
      setIsLoading(false);
      return;
    }

    // 2. Manejo global de errores de autenticación de Google Maps
    window.gm_authFailure = () => {
      console.error("Google Maps Authentication Failure");
      setIsError(true);
      setIsLoading(false);
    };

    // 3. Carga del Script
    if (window.google && window.google.maps) {
      initMap();
    } else {
      const scriptId = 'google-maps-script';
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMapJaci`;
        script.async = true;
        script.defer = true;
        
        // Callback global para cuando termine de cargar
        (window as any).initMapJaci = () => {
          // Disparamos un evento custom para notificar a todas las instancias
          window.dispatchEvent(new Event('google-maps-loaded'));
        };

        script.onerror = () => setIsError(true);
        document.head.appendChild(script);
      }

      // Escuchar el evento de carga si ya se estaba cargando
      const handleLoad = () => initMap();
      window.addEventListener('google-maps-loaded', handleLoad);
      return () => window.removeEventListener('google-maps-loaded', handleLoad);
    }
  }, [initMap]);

  // Renderizado del Fallback (Imagen Estática)
  if (isError) {
    return (
      <div className="w-full h-full relative group">
        <OptimizedImage 
          src={location.fallbackImage} 
          alt={location.name}
          className="w-full h-full object-cover"
          aspectRatio="aspect-video"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
      </div>
    );
  }

  return (
    <div className="w-full h-full relative bg-slate-200">
      {/* Contenedor del Mapa */}
      <div ref={containerRef} className="w-full h-full absolute inset-0 z-0" />
      
      {/* Loader Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-10 bg-slate-100 animate-pulse flex items-center justify-center">
          <span className="material-symbols-outlined text-4xl text-slate-300 animate-spin">sync</span>
        </div>
      )}

      {/* Interacción Hint Overlay (Desaparece al interactuar si Google lo permite, o se mantiene para estética) */}
      <div className="absolute inset-0 pointer-events-none z-20 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent opacity-60" />
    </div>
  );
};

export const LocationsView: React.FC = () => {
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
                  
                  {/* Street View / Image Container */}
                  <div className="w-full relative aspect-video bg-slate-100 border-b border-white/20 overflow-hidden">
                    <StreetView location={loc} />
                    
                    {/* Badge Flotante */}
                    <div className="absolute top-8 left-8 z-30 pointer-events-none">
                      <div className="bg-white/95 backdrop-blur-xl px-4 py-2 rounded-full shadow-lg flex items-center gap-2 border border-white/20">
                        <span className={`w-2 h-2 rounded-full animate-pulse`} style={{ backgroundColor: loc.color }}></span>
                        <span className={DESIGN_SYSTEM.typography.label + " !text-slate-800"}>{loc.label}</span>
                      </div>
                    </div>

                    {/* Indicador de 360 */}
                    <div className="absolute bottom-4 right-4 z-30 pointer-events-none">
                      <div className="bg-black/50 backdrop-blur-md text-white text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-2">
                        <span className="material-symbols-outlined text-[12px]">360</span>
                        Explorar
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

                    {/* Static Map Container (Contexto) */}
                    <div className="relative w-full aspect-[21/9] rounded-[2rem] overflow-hidden border-4 border-white shadow-sm group/map">
                      <a 
                        href={loc.masterUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 z-30 cursor-pointer"
                        title="Abrir en Google Maps"
                      >
                        <div className="absolute inset-0 bg-primary/0 group-hover/map:bg-primary/5 transition-colors duration-500" />
                      </a>
                      
                      <iframe 
                        className="w-full h-full border-0 grayscale group-hover/map:grayscale-0 transition-all duration-700 pointer-events-none opacity-60 group-hover/map:opacity-100" 
                        src={loc.embedUrl}
                        loading="lazy"
                        tabIndex={-1}
                      ></iframe>
                    </div>

                    <Magnetic pullStrength={0.1}>
                      <a 
                        href={loc.masterUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full py-5 bg-slate-900 text-white rounded-full font-black font-display text-[10px] uppercase tracking-[0.2em] shadow-2xl hover:bg-primary transition-all duration-500 flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined text-sm">directions</span>
                        Cómo llegar
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
