
import React, { useRef, memo, useCallback, useState, useMemo } from 'react';
import { motion, HTMLMotionProps, useSpring, useScroll, useTransform, useReducedMotion, useInView, useVelocity } from 'framer-motion';
import { DESIGN_SYSTEM, PerformanceProfile, JACI_SQUAD } from '../types';
import { usePerformance } from '../App';

interface ViewContainerProps extends HTMLMotionProps<'section'> {
  children: React.ReactNode;
  className?: string;
}

export const ViewContainer: React.FC<ViewContainerProps> = memo(({ children, className = "", ...props }) => (
  <motion.section
    initial="hidden"
    animate="visible"
    variants={{
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.03, delayChildren: 0.01 }
      }
    }}
    style={{ 
      contentVisibility: 'auto', 
      containIntrinsicSize: '1px 800px',
      contain: 'layout style',
      transform: 'translateZ(0)',
      backfaceVisibility: 'hidden'
    }}
    className={`relative z-10 w-full ${DESIGN_SYSTEM.tokens.gutters.container} ${DESIGN_SYSTEM.tokens.gutters.section} max-w-[1600px] mx-auto ${className}`}
    {...props}
  >
    {children}
  </motion.section>
));

interface InteractionCardProps extends HTMLMotionProps<'div'> {
  borderColor?: string;
  children: React.ReactNode;
  className?: string;
}

export const InteractionCard: React.FC<InteractionCardProps> = memo(({ children, borderColor = 'rgba(37,192,244,0.15)', className = "", ...props }) => {
  const prefersReducedMotion = useReducedMotion();
  const perf = usePerformance();
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "20% 0px", once: false });

  const cardStyle = useMemo(() => {
    const isHigh = perf === PerformanceProfile.HIGH;
    return {
      borderLeft: `4px solid ${borderColor}`,
      transformStyle: isHigh ? 'preserve-3d' as const : 'flat' as const,
      perspective: isHigh ? '1000px' : 'none',
      willChange: isInView && isHigh && !prefersReducedMotion ? 'transform, opacity' : 'auto',
      contain: 'layout style',
      backgroundColor: (isHigh && isInView) ? 'rgba(255, 255, 255, 0.8)' : '#ffffff',
      backdropFilter: (isHigh && isInView) ? 'blur(16px)' : 'none',
      transform: 'translateZ(0)',
    };
  }, [borderColor, isInView, perf, prefersReducedMotion]);

  return (
    <motion.div
      ref={ref}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: isInView ? 1 : 0, 
          y: isInView ? 0 : 20, 
          transition: { ...DESIGN_SYSTEM.springs.gentle, duration: 0.5 }
        }
      }}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      whileHover={prefersReducedMotion || !isInView || perf === PerformanceProfile.LITE ? {} : { 
        y: -10, 
        scale: 1.01,
        transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } 
      }}
      className={`group relative rounded-[2.5rem] p-6 md:p-8 lg:p-10 shadow-soft border border-white/40 flex flex-col justify-between overflow-hidden ${className}`}
      style={cardStyle}
      {...props}
    >
      <div className="relative z-10 h-full flex flex-col">
        {children}
      </div>
      {(perf === PerformanceProfile.HIGH && isInView) && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      )}
    </motion.div>
  );
});

// --- CLOUDFLARE IMAGES INTEGRATION ENGINE ---
export const OptimizedImage: React.FC<{ 
  src: string; 
  alt: string; 
  className?: string; 
  aspectRatio?: string;
  priority?: 'high' | 'low' | 'auto';
  objectFit?: 'cover' | 'contain';
}> = memo(({ src, alt, className = "", aspectRatio = "aspect-[16/10]", priority = "auto", objectFit = 'cover' }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const perf = usePerformance();
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "25% 0px", once: true });

  const getCloudflareUrl = useCallback((width: number) => {
    // Si la imagen ya viene de nuestro dominio de assets, aplicamos el pipeline de redimensionamiento de Cloudflare
    // El formato esperado para Cloudflare Images (Free/Transform) es:
    // /cdn-cgi/image/width=X,quality=Y,format=auto,fit=Z/FULL_PATH_TO_IMAGE
    
    // Asumimos que assets.jacilandia.mx es el dominio configurado en Cloudflare con R2
    const baseTransform = "/cdn-cgi/image/";
    const quality = perf === PerformanceProfile.LITE ? 60 : 85;
    const options = `width=${width},quality=${quality},format=auto,fit=${objectFit}`;
    
    // Si la URL es externa, Cloudflare necesita la URL completa
    // Si es interna, solo la ruta. Aquí lo manejamos de forma resiliente.
    const cleanSrc = src.replace('https://assets.jacilandia.mx/', '');
    const absolutePath = src.startsWith('http') ? src : `https://assets.jacilandia.mx/${cleanSrc}`;
    
    return `${baseTransform}${options}/${absolutePath}`;
  }, [src, perf, objectFit]);

  const srcSet = useMemo(() => {
    const widths = [400, 800, 1200, 1600];
    return widths.map(w => `${getCloudflareUrl(w)} ${w}w`).join(', ');
  }, [getCloudflareUrl]);

  return (
    <div 
      ref={ref}
      className={`relative overflow-hidden ${aspectRatio} bg-slate-100/50 ${className}`} 
      style={{ 
        contain: 'paint',
        aspectRatio: aspectRatio.includes('[') ? aspectRatio.split('-')[1].replace('[','').replace(']','') : 'auto'
      }}
    >
      {/* Skeleton / Placeholder de baja resolución */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-200/50">
          {perf === PerformanceProfile.HIGH && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
          )}
        </div>
      )}

      {isInView && (
        <motion.img
          src={getCloudflareUrl(1200)}
          srcSet={srcSet}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          initial={perf === PerformanceProfile.HIGH ? { opacity: 0, scale: 1.05, filter: 'blur(10px)' } : { opacity: 0 }}
          animate={isLoaded ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : { opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className={`w-full h-full object-${objectFit} transform-gpu`}
          loading={priority === 'high' ? 'eager' : 'lazy'}
          decoding="async"
          // @ts-ignore - Atributo experimental soportado por browsers modernos
          fetchpriority={priority}
          style={{ 
            willChange: 'transform, opacity',
            backfaceVisibility: 'hidden'
          }}
        />
      )}
    </div>
  );
});

export const FloatingMonster: React.FC<{ 
  monster: keyof typeof JACI_SQUAD; 
  className?: string;
  delay?: number;
  size?: string;
}> = memo(({ monster, className = "", delay = 0, size = "size-32" }) => {
  const prefersReducedMotion = useReducedMotion();
  const perf = usePerformance();
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  
  const smoothVelocity = useSpring(scrollVelocity, { stiffness: 60, damping: 20 });
  const velocityY = useTransform(smoothVelocity, [-3000, 3000], [40, -40]);
  const velocityRotate = useTransform(smoothVelocity, [-3000, 3000], [-15, 15]);

  // Usamos OptimizedImage internamente para los monstruos con fit contain
  if (perf === PerformanceProfile.LITE) {
    return (
      <img 
        src={JACI_SQUAD[monster]} 
        alt="" 
        className={`${size} object-contain ${className} drop-shadow-md`} 
      />
    );
  }

  return (
    <motion.div
      style={{ 
        y: prefersReducedMotion ? 0 : velocityY, 
        rotate: prefersReducedMotion ? 0 : velocityRotate,
        willChange: 'transform'
      }}
      className={`${size} ${className} relative`}
    >
       <OptimizedImage 
         src={JACI_SQUAD[monster]} 
         alt={monster} 
         className="w-full h-full !bg-transparent"
         aspectRatio="aspect-square"
         objectFit="contain"
         priority={delay === 0 ? 'high' : 'auto'}
       />
    </motion.div>
  );
});

export const GlassBadge: React.FC<{ icon: string; children: React.ReactNode; colorClass?: string; className?: string }> = memo(({ icon, children, colorClass = "text-primary", className = "" }) => {
  const perf = usePerformance();
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "5% 0px", once: false });

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      className={`inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-white/60 shadow-sm mb-10 w-fit mx-auto lg:mx-0 ${perf === PerformanceProfile.HIGH && isInView ? 'bg-white/80 backdrop-blur-xl' : 'bg-white'} ${className}`}
      style={{ transform: 'translateZ(0)', contain: 'content' }}
    >
      <span className={`material-symbols-outlined text-lg ${colorClass}`}>{icon}</span>
      <span className="text-slate-500 text-[0.625rem] font-black tracking-[0.2em] uppercase">{children}</span>
    </motion.div>
  );
});

interface MagneticProps {
  children: React.ReactNode;
  pullStrength?: number;
}

export const Magnetic: React.FC<MagneticProps> = ({ children, pullStrength = DESIGN_SYSTEM.physics.magneticPull }) => {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const perf = usePerformance();
  const isInView = useInView(ref, { margin: "5% 0px", once: false });
  
  const x = useSpring(0, DESIGN_SYSTEM.springs.magnetic);
  const y = useSpring(0, DESIGN_SYSTEM.springs.magnetic);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current || prefersReducedMotion || perf === PerformanceProfile.LITE || !isInView) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    x.set(middleX * pullStrength);
    y.set(middleY * pullStrength);
  }, [x, y, pullStrength, prefersReducedMotion, perf, isInView]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y, display: 'inline-block', willChange: isInView ? 'transform' : 'auto' }}
    >
      {children}
    </motion.div>
  );
};

export const ScrollReveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string; isText?: boolean }> = memo(({ children, delay = 0, className = "", isText = false }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-10% 0px", once: true });
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const perf = usePerformance();
  const prefersReducedMotion = useReducedMotion();

  const smoothVelocity = useSpring(scrollVelocity, { stiffness: 100, damping: 30 });
  const skew = useTransform(smoothVelocity, [-4000, 4000], [-5, 5]);
  const scale = useTransform(smoothVelocity, [-4000, 4000], [1.05, 0.95]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      style={isText && perf === PerformanceProfile.HIGH && !prefersReducedMotion ? { skewY: skew, scaleY: scale } : {}}
      transition={{ ...DESIGN_SYSTEM.springs.gentle, delay, duration: 0.6 }}
      className={className}
    >
      {children}
    </motion.div>
  );
});
