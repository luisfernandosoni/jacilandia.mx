
import React, { useRef, memo, useCallback, useState, useMemo, useEffect } from 'react';
import { motion, HTMLMotionProps, useSpring, useScroll, useTransform, useReducedMotion, useInView } from 'framer-motion';
import { DESIGN_SYSTEM, PerformanceProfile } from '../types';
import { usePerformance } from '../App';

interface ViewContainerProps extends HTMLMotionProps<'section'> {
  children: React.ReactNode;
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
      contain: 'layout style paint',
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
}

export const InteractionCard: React.FC<InteractionCardProps> = memo(({ children, borderColor = 'rgba(37,192,244,0.15)', className = "", ...props }) => {
  const prefersReducedMotion = useReducedMotion();
  const perf = usePerformance();
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "15% 0px 15% 0px", once: false });

  const cardStyle = useMemo(() => ({
    borderLeft: `4px solid ${borderColor}`,
    transformStyle: 'preserve-3d' as const,
    perspective: '1000px',
    willChange: isInView && (isHovered || prefersReducedMotion === false) ? 'transform, opacity' : 'auto',
    contain: 'layout style paint',
    backgroundColor: (perf === PerformanceProfile.HIGH && isInView) ? 'rgba(255, 255, 255, 0.8)' : '#ffffff',
    backdropFilter: (perf === PerformanceProfile.HIGH && isInView) ? 'blur(16px)' : 'none',
    transform: 'translateZ(0)',
  }), [borderColor, isHovered, isInView, perf, prefersReducedMotion]);

  return (
    <motion.div
      ref={ref}
      variants={{
        hidden: { opacity: 0, y: 20, scale: 0.98 },
        visible: { 
          opacity: isInView ? 1 : 0, 
          y: isInView ? 0 : 20, 
          scale: isInView ? 1 : 0.98,
          transition: { ...DESIGN_SYSTEM.springs.gentle, duration: 0.5 }
        }
      }}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={prefersReducedMotion || !isInView ? {} : { 
        y: -10, 
        scale: 1.01,
        transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } 
      }}
      className={`group relative rounded-[2.5rem] p-8 md:p-10 shadow-soft border border-white/40 flex flex-col justify-between overflow-hidden ${className}`}
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
}> = memo(({ src, alt, className = "", aspectRatio = "aspect-[16/10]", priority = "auto" }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "25% 0px", once: true });

  return (
    <div 
      ref={ref}
      className={`relative overflow-hidden ${aspectRatio} bg-slate-100 ${className}`} 
      style={{ 
        contain: 'paint',
        aspectRatio: aspectRatio.includes('[') ? aspectRatio.split('-')[1].replace('[','').replace(']','') : 'auto'
      }}
    >
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-200">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        </div>
      )}
      {isInView && (
        <motion.img
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 1.1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="w-full h-full object-cover"
          loading={priority === 'high' ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority}
          style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
        />
      )}
    </div>
  );
});

export const GlassBadge: React.FC<{ icon: string; children: React.ReactNode; colorClass?: string }> = memo(({ icon, children, colorClass = "text-primary" }) => {
  const perf = usePerformance();
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "5% 0px", once: false });

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      className={`inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-white/60 shadow-sm mb-10 w-fit mx-auto lg:mx-0 ${perf === PerformanceProfile.HIGH && isInView ? 'bg-white/80 backdrop-blur-xl' : 'bg-white'}`}
      style={{ transform: 'translateZ(0)', contain: 'content' }}
    >
      <span className={`material-symbols-outlined text-[18px] ${colorClass}`}>{icon}</span>
      <span className="text-slate-500 text-[10px] font-black tracking-[0.2em] uppercase">{children}</span>
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

export const ParallaxSection: React.FC<{ children?: React.ReactNode; speed?: number; className?: string }> = ({ children, speed = 1, className = "" }) => {
  const ref = useRef(null);
  const perf = usePerformance();
  const isInView = useInView(ref, { margin: "25% 0px", once: false });
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -100 * speed]);
  const smoothY = useSpring(y, { stiffness: 400, damping: 90, mass: 1 });

  if (perf === PerformanceProfile.LITE || !isInView) {
    return <div ref={ref} className={className}>{children}</div>;
  }

  return (
    <motion.div ref={ref} style={{ y: smoothY, transition: 'none', willChange: 'transform' }} className={className}>
      {children}
    </motion.div>
  );
};

export const ScrollReveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = memo(({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-10% 0px", once: true });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ ...DESIGN_SYSTEM.springs.gentle, delay, duration: 0.6 }}
      className={className}
      style={{ transform: 'translateZ(0)', contain: 'layout paint' }}
    >
      {children}
    </motion.div>
  );
});
