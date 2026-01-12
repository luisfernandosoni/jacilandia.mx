import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { ViewContainer, InteractionCard, GlassBadge, ScrollReveal, Magnetic, OptimizedImage } from '../components/MotionPrimitives';
import { DESIGN_SYSTEM } from '../types';
import { useInView } from 'framer-motion';

// Extendemos el objeto window para TypeScript
declare global {
  interface Window {
    google: any;
    initMapJaci?: () => void;
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
  panoId?: string;
  fallbackImage: string;
}

const LOCATIONS: LocationConfig[] = [
  {
    id: 'centro',
    name: 'Sucursal Centro',
    label: 'Ávila Camacho',
    color: DESIGN_SYSTEM.colors.primary,
    softColor: 'bg-primary-soft',
    address: 'Av. Manuel Ávila Camacho 33',
    subtext: 'Zona Centro, 91000 Xalapa-Enríquez, Ver.',
    masterUrl: 'https://maps.app.goo.gl/xUHCvBgKd2Rddjun9',
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3761.343513689239!2d-96.927163023955!3d19.526844941320496!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85db321946399c0d%3A0xb306129188e99e43!2sAv.%20Manuel%20%C3%81vila%20Camacho%2033%2C%20Zona%20Centro%2C%20Centro%2C%2091000%20Xalapa-Enr%C3%ADquez%2C%20Ver.!5e0!3m2!1sen!2smx!4v1710000000000!5m2!1sen!2smx',
    coordinates: { lat: 19.5277903, lng: -96.9263094 },
    pov: { heading: 207.86, pitch: 0 },
    panoId: 'eyodG-vx09zeo-Gz8qQARQ',
    fallbackImage: 'https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=eyodG-vx09zeo-Gz8qQARQ&cb_client=search.gws-prod.gps&w=1200&h=800&yaw=207.86&pitch=0&thumbfov=90'
  },
  {
    id: 'americas',
    name: 'Sucursal Américas',
    label: 'Dos de Abril',
    color: DESIGN_SYSTEM.colors.yellow,
    softColor: 'bg-jaci-yellow-soft',
    address: 'Av. Américas 313',
    subtext: 'Dos de Abril, 91030 Xalapa-Enríquez, Ver.',
    masterUrl: 'https://maps.app.goo.gl/9qz1tSqh8Eyec5eD9',
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3761.161476579973!2d-96.92383852395484!3d19.53488874112276!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85db321045996023%3A0xc343453303c7336e!2sAv.%20Am%C3%A9ricas%20313%2C%20Dos%20de%20Abril%2C%2091030%20Xalapa-Enr%C3%ADquez%2C%20Ver.!5e0!3m2!1sen!2smx!4v1710000000000!5m2!1sen!2smx',
    coordinates: { lat: 19.5361253, lng: -96.9127322 },
    pov: { heading: 43.44, pitch: 0 },
    panoId: '8xATB9rNU3yfDiqaNr4NoQ',
    fallbackImage: 'https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=8xATB9rNU3yfDiqaNr4NoQ&cb_client=search.gws-prod.gps&w=1200&h=800&yaw=43.44&pitch=0&thumbfov=90'
  }
];

const StreetView: React.FC<{ location: LocationConfig }> = ({ location }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  // Usamos useInView para detectar cuándo el usuario se acerca a la card
  const isInView = useInView(containerRef, { margin: "200px 0px", once: true });

  const initPanorama = useCallback(() => {
    if (!containerRef.current || !window.google?.maps) return;

    try {
      const panorama = new window.google.maps.StreetViewPanorama(containerRef.current, {
        position: location.coordinates,
        pov: location.pov,
        pano: location.panoId,
        zoom: 0,
        disableDefaultUI: true,
        addressControl: false,
        fullscreenControl: false,
        linksControl: false,
        motionTracking: false,
        motionTrackingControl: false,
        panControl: false,
        enableCloseButton: false,
        zoomControl: false,
        showRoadLabels: false,
        clickToGo: true,
      });

      panorama.addListener('status_changed', () => {
        if (panorama.getStatus() === 'OK') {
          // Pequeño delay adicional para asegurar que el canvas se pintó
          setTimeout(() => setIsLive(true), 150);
        } else {
          setHasError(true);
        }
      });
    } catch (error) {
      setHasError(true);
    }
  }, [location]);

  useEffect(() => {
    // Solo disparamos la carga si el componente está en el viewport
    // y después de un delay que permita que las animaciones de entrada terminen (stutter prevention)
    if (!isInView || isApiLoaded) return;

    const timer = setTimeout(() => {
      // Fix: TypeScript error 'Property env does not exist on type ImportMeta'.
      // Vite handles import.meta.env at build-time. We suppress this check to allow compilation.
      // @ts-ignore
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        setHasError(true);
        return;
      }

      window.gm_authFailure = () => setHasError(true);

      const loadScript = () => {
        if (window.google?.maps) {
          setIsApiLoaded(true);
          initPanorama();
          return;
        }

        const scriptId = 'google-maps-loader';
        if (!document.getElementById(scriptId)) {
          const script = document.createElement('script');
          script.id = scriptId;
          script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&loading=async`;
          script.async = true;
          script.defer = true;
          window.initMapJaci = () => {
            window.dispatchEvent(new Event('google-maps-ready'));
          };
          script.onerror = () => setHasError(true);
          document.head.appendChild(script);
        }
        
        const handleReady = () => {
          setIsApiLoaded(true);
          initPanorama();
        };

        window.addEventListener('google-maps-ready', handleReady, { once: true });
      };

      loadScript();
    }, 800); // 800ms de buffer para dejar que Framer Motion respire

    return () => clearTimeout(timer);
  }, [isInView, isApiLoaded, initPanorama]);

  return (
    <div className="w-full h-full relative bg-slate-100 overflow-hidden">
      {/* CAPA 1: Fallback Estático (Siempre presente como base para evitar saltos) */}
      <div className="absolute inset-0 z-0">
        <OptimizedImage 
          src={location.fallbackImage} 
          alt={location.name} 
          className="w-full h-full object-cover grayscale-[15%]" 
          aspectRatio="aspect-video"
          priority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
      </div>

      {/* CAPA 2: Street View Interactivo (Fade-in cuando está listo) */}
      <div 
        ref={containerRef} 
        className={`w-full h-full absolute inset-0 z-10 transition-opacity duration-700 ease-in-out ${isLive ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
      />

      {/* Loader sutil solo si estamos intentando cargar */}
      {isInView && !isLive && !hasError && (
        <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
          <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span className="text-[8px] font-black uppercase tracking-widest text-white/60">Activando Vista...</span>
        </div>
      )}
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
            <GlassBadge icon="child_care" colorClass="text-primary">Nuestras Sedes</GlassBadge>
            <h1 className={DESIGN_SYSTEM.typography.h1 + " mt-6"}>
              Dónde sucede la <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-jaci-purple">magia</span>
            </h1>
            <p className={DESIGN_SYSTEM.typography.body + " mt-8"}>
              Espacios pensados para que tus hijos exploren con total libertad y seguridad en el corazón de Xalapa.
            </p>
          </ScrollReveal>
        </div>

        {/* Locations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full mb-20">
          {LOCATIONS.map((loc, idx) => (
            <ScrollReveal key={loc.id} delay={0.1 * (idx + 1)}>
              <InteractionCard borderColor={loc.color} className="!p-0 h-full overflow-hidden group">
                <div className="flex flex-col h-full">
                  
                  {/* Street View Container Optimizado */}
                  <div className="w-full relative aspect-video bg-slate-100 border-b border-white/20 overflow-hidden shadow-inner">
                    <StreetView location={loc} />
                    
                    {/* Badge Flotante */}
                    <div className="absolute top-6 left-6 z-30 pointer-events-none">
                      <div className="bg-white/95 backdrop-blur-xl px-4 py-2 rounded-full shadow-xl flex items-center gap-2 border border-white/20">
                        <span className={`w-2 h-2 rounded-full animate-pulse`} style={{ backgroundColor: loc.color }}></span>
                        <span className={DESIGN_SYSTEM.typography.label + " !text-slate-800 !text-[9px]"}>{loc.label}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-8 md:p-10 flex flex-col flex-1 gap-8">
                    <div>
                      <h3 className={DESIGN_SYSTEM.typography.h3 + " mb-6"}>{loc.name}</h3>
                      <div className="flex items-start gap-4 p-5 bg-slate-50/50 rounded-2xl border border-slate-100 shadow-sm">
                        <div className={`size-10 rounded-xl ${loc.softColor} flex items-center justify-center shrink-0`}>
                          <span className="material-symbols-outlined filled" style={{ color: loc.color }}>location_on</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 text-lg mb-0.5 leading-tight">{loc.address}</span>
                          <span className="text-slate-500 font-body text-sm leading-relaxed">{loc.subtext}</span>
                        </div>
                      </div>
                    </div>

                    {/* Static Map Container - Cargado solo en interacción */}
                    <div className="relative w-full aspect-[21/9] rounded-[2rem] overflow-hidden border-4 border-white shadow-soft group/map">
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
