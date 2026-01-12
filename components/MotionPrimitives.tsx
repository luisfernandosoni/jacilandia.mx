import React, { useRef, memo, useCallback, useState, useMemo, useEffect } from 'react';
import { motion, HTMLMotionProps, useSpring, useScroll, useTransform, useReducedMotion, useInView, useVelocity } from 'framer-motion';
import { DESIGN_SYSTEM, PerformanceProfile, JACI_SQUAD } from '../types';
import { usePerformance } from '../App';

// Utilidad global para optimización de imágenes vía Cloudflare
export const getCloudflareImageUrl = (src: string, options: { width: number, quality?: number, fit?: string, blur?: number }) => {
  if (!src) return '';
  const baseTransform = "/cdn-cgi/image/";
  const quality = options.quality || 85;
  const fit = options.fit || 'contain';
  const blurParam = options.blur ? `,blur=${options.blur}` : '';
  const config = `width=${options.width},quality=${quality},format=auto,fit=${fit}${blurParam}`;
  
  const cleanPath = src.replace('https://assets.jacilandia.mx', '');
  const finalPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
  const sourceImage = src.includes('jacilandia.mx') ? `https://assets.jacilandia.mx${finalPath}` : src;
  
  return `${baseTransform}${config}/${encodeURIComponent(sourceImage)}`;
};

interface ViewContainerProps extends HTMLMotionProps<'section'> {
  children: React.ReactNode;
  className?: string;
}

export const ViewContainer = memo(({ children, className = "", ...props }: ViewContainerProps) => (
  <motion.section
    initial="hidden"
    animate="visible"
    variants={{
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.1 }
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
          opacity: 1, 
          y: 0, 
          transition: { ...DESIGN_SYSTEM.springs.gentle, duration: 0.5 }
        }
      }}
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

export const OptimizedImage: React.FC<{ 
  src: string; 
  alt: string; 
  className?: string; 
  aspectRatio?: string;
  priority?: 'high' | 'low' | 'auto';
  objectFit?: 'cover' | 'contain';
  sizes?: string;
  isTransparent?: boolean;
}> = memo(({ src, alt, className = "", aspectRatio = "aspect-[16/10]", priority = "auto", objectFit = 'cover', sizes, isTransparent = false }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const perf = usePerformance();
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "50% 0px", once: true }); 

  // Detectamos si es un PNG para forzar transparencia total
  const needsTransparency = isTransparent || src.toLowerCase().endsWith('.png');
  
  const srcSet = useMemo(() => {
    return `
      ${getCloudflareImageUrl(src, { width: 400, fit: objectFit })} 400w,
      ${getCloudflareImageUrl(src, { width: 640, fit: objectFit })} 640w,
      ${getCloudflareImageUrl(src, { width: 960, fit: objectFit })} 960w,
      ${getCloudflareImageUrl(src, { width: 1280, fit: objectFit })} 1280w,
      ${getCloudflareImageUrl(src, { width: 1920, fit: objectFit })} 1920w
    `;
  }, [src, objectFit]);

  const defaultSizes = sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw";

  return (
    <div 
      ref={ref}
      className={`relative overflow-hidden ${aspectRatio} ${needsTransparency ? 'bg-transparent' : 'bg-slate-100'} ${className}`} 
      style={{ 
        contain: 'paint',
        aspectRatio: aspectRatio.includes('[') ? aspectRatio.split('-')[1].replace('[','').replace(']','') : 'auto',
        backgroundColor: needsTransparency ? 'transparent' : undefined
      }}
    >
      {(isInView || priority === 'high') && (
        <motion.img
          src={getCloudflareImageUrl(src, { width: 1280, fit: objectFit })}
          srcSet={srcSet}
          sizes={defaultSizes}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className={`relative z-10 w-full h-full object-${objectFit} transform-gpu`}
          loading={priority === 'high' ? 'eager' : 'lazy'}
          decoding="async"
          // @ts-ignore
          fetchpriority={priority}
          style={{ 
            willChange: 'opacity',
            backfaceVisibility: 'hidden',
            backgroundColor: 'transparent'
          }}
        />
      )}
    </div>
  );
});

export const FloatingMonster: React.FC<{ 
  monster?: keyof typeof JACI_SQUAD; 
  src?: string;
  className?: string;
  delay?: number;
  size?: string;
  priority?: boolean;
}> = memo(({ monster, src, className = "", delay = 0, size = "size-32", priority = false }) => {
  const prefersReducedMotion = useReducedMotion();
  const perf = usePerformance();
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  
  const smoothVelocity = useSpring(scrollVelocity, { stiffness: 60, damping: 20 });
  const velocityY = useTransform(smoothVelocity, [-3000, 3000], [40, -40]);
  const velocityRotate = useTransform(smoothVelocity, [-3000, 3000], [-10, 10]);

  const finalSrc = src || (monster ? JACI_SQUAD[monster] : "");

  if (perf === PerformanceProfile.LITE) {
    return (
      <img 
        src={getCloudflareImageUrl(finalSrc, { width: 300, fit: 'contain' })} 
        alt="" 
        className={`${size} object-contain ${className} drop-shadow-md`} 
        loading={priority ? "eager" : "lazy"}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.2, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        delay: delay, 
        duration: 0.45, 
        ease: [0.23, 1, 0.32, 1], // Power4.easeOut equivalent for snap
      }}
      style={{ 
        translateY: prefersReducedMotion ? 0 : velocityY, 
        rotate: prefersReducedMotion ? 0 : velocityRotate,
        willChange: 'transform'
      }}
      className={`${size} ${className} relative`}
    >
      <motion.div
        animate={prefersReducedMotion ? {} : {
          y: [0, -25, 0],
          rotate: [0, 4, -4, 0]
        }}
        transition={prefersReducedMotion ? {} : {
          y: { ...DESIGN_SYSTEM.springs.float, delay: delay + 0.3 },
          rotate: { ...DESIGN_SYSTEM.springs.float, delay: delay + 0.3, duration: 5 }
        }}
        className="w-full h-full"
      >
        <OptimizedImage 
          src={finalSrc} 
          alt={monster || "monster"} 
          className="w-full h-full !bg-transparent"
          aspectRatio="aspect-square"
          objectFit="contain"
          isTransparent={true}
          // Fix: Type 'true' is not assignable to type '"auto" | "high" | "low"'. Using 'high' to match original logic and satisfy the union type.
          priority={priority ? 'high' : 'high'} // Forzar prioridad para monstruos
          sizes={`(max-width: 768px) 150px, 300px`}
        />
      </motion.div>
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
