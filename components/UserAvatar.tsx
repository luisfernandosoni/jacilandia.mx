import React, { useState, useMemo } from 'react';
import { DESIGN_SYSTEM } from '../types';

interface UserAvatarProps {
  src?: string | null;
  name: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ src, name, className = "", size = 'md' }) => {
  const [imageError, setImageError] = useState(false);

  // Deterministic color selection based on name hash
  const { color, initials } = useMemo(() => {
    const cleanName = name.trim() || '?';
    
    // Generate Initials (max 2)
    const parts = cleanName.split(' ').filter(p => p.length > 0);
    const initials = parts.length >= 2 
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : cleanName.slice(0, 2).toUpperCase();

    // Generate Hash for Color
    let hash = 0;
    for (let i = 0; i < cleanName.length; i++) {
      hash = cleanName.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // JACI Brand Palette (from types.ts)
    const palette = [
      DESIGN_SYSTEM.colors.primary, // Cyan
      DESIGN_SYSTEM.colors.pink,    // Pink
      DESIGN_SYSTEM.colors.yellow,  // Yellow
      DESIGN_SYSTEM.colors.purple,  // Purple
      DESIGN_SYSTEM.colors.green    // Green
    ];
    
    const color = palette[Math.abs(hash) % palette.length];
    
    return { color, initials };
  }, [name]);

  // Dimensions based on size prop (optional, defaults to creating an SVG data URI)
  // For this implementation, we will render a DIV or IMG directly.

  if (!src || imageError) {
    return (
      <div 
        className={`flex items-center justify-center font-black text-white select-none ${className}`}
        style={{ 
          backgroundColor: color,
          width: '100%', 
          height: '100%' 
        }}
        aria-label={`Avatar de ${name}`}
        role="img"
      >
        <span style={{ fontSize: '40%' }}>{initials}</span>
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={`Avatar de ${name}`} 
      className={`w-full h-full object-cover ${className}`}
      onError={() => setImageError(true)}
    />
  );
};
