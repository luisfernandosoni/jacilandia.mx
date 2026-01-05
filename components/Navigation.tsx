import React from 'react';
import { motion } from 'framer-motion';
import { DESIGN_SYSTEM } from '../types';
import { Magnetic } from './MotionPrimitives';

export const Navigation: React.FC = () => {
  return (
    <header className="sticky top-0 z-[100] w-full bg-white/40 backdrop-blur-2xl border-b border-white/20 transition-all duration-500">
      <div className="max-w-[1600px] mx-auto px-8 md:px-12 h-20 flex items-center justify-center">
        <Magnetic pullStrength={0.05}>
          <div className="flex items-center group pointer-events-none">
            <div className="relative w-11 h-11">
              <motion.img 
                layoutId={DESIGN_SYSTEM.layoutIds.BRAND_IDENTITY}
                transition={DESIGN_SYSTEM.springs.identity}
                src="https://raw.githubusercontent.com/soniglf/JACIResources/84c35cf151659486d49458cee28c1f353f42f47d/JACI_Color.png" 
                alt="JACI" 
                className="absolute inset-0 w-full h-full object-contain"
                style={{ backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
              />
            </div>
          </div>
        </Magnetic>
      </div>
    </header>
  );
};