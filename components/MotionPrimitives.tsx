import React, { useRef } from 'react';
import { motion, HTMLMotionProps, useSpring, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { DESIGN_SYSTEM } from '../types';

interface ViewContainerProps extends HTMLMotionProps<'section'> {
  children: React.ReactNode;
}

export const ViewContainer: React.FC<ViewContainerProps> = ({ children, className = "", ...props }) => (
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
    className={`relative z-10 w-full ${DESIGN_SYSTEM.tokens.gutters.container} ${DESIGN_SYSTEM.tokens.gutters.section} max-w-7xl mx-auto ${className}`}
    {...props}
  >
    {children}
  </motion.section>
);

interface InteractionCardProps extends HTMLMotionProps<'div'> {
  borderColor?: string;
  children: React.ReactNode;
}

export const InteractionCard: React.FC<InteractionCardProps> = ({ children, borderColor = 'rgba(37,192,244,0.15)', className = "", ...props }) => {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: DESIGN_SYSTEM.springs.gentle }
      }}
      whileHover={prefersReducedMotion ? {} : { y: -12, borderColor: borderColor.replace('0.15', '0.6'), scale: 1.01 }}
      className={`group relative bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 md:p-10 shadow-soft border border-white/40 transition-all duration-500 flex flex-col justify-between overflow-hidden will-change-transform ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const GlassBadge: React.FC<{ icon: string; children: React.ReactNode; colorClass?: string }> = ({ icon, children, colorClass = "text-primary" }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-white/40 shadow-sm text-[10px] font-black tracking-[0.15em] uppercase mb-8 w-fit mx-auto lg:mx-0"
  >
    <span className={`material-symbols-outlined text-[16px] ${colorClass}`}>{icon}</span>
    <span className="text-slate-500">{children}</span>
  </motion.div>
);

interface MagneticProps {
  children: React.ReactNode;
  pullStrength?: number;
}

export const Magnetic: React.FC<MagneticProps> = ({ children, pullStrength = DESIGN_SYSTEM.physics.magneticPull }) => {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  
  const x = useSpring(0, DESIGN_SYSTEM.springs.magnetic);
  const y = useSpring(0, DESIGN_SYSTEM.physics.magneticPull > 0 ? DESIGN_SYSTEM.springs.magnetic : { stiffness: 100 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current || prefersReducedMotion) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    x.set(middleX * pullStrength);
    y.set(middleY * pullStrength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y, display: 'inline-block', willChange: 'transform' }}
    >
      {children}
    </motion.div>
  );
};

export const ParallaxSection: React.FC<{ children?: React.ReactNode; speed?: number; className?: string }> = ({ children, speed = 1, className = "" }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -120 * speed]);
  const smoothY = useSpring(y, { stiffness: 400, damping: 90, mass: 1 });

  return (
    <motion.div ref={ref} style={{ y: smoothY, willChange: 'transform' }} className={className}>
      {children}
    </motion.div>
  );
};

export const ScrollReveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 30, scale: 0.98 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true, margin: "-10%" }}
    transition={{ ...DESIGN_SYSTEM.springs.gentle, delay }}
    className={`will-change-[opacity,transform] ${className}`}
  >
    {children}
  </motion.div>
);