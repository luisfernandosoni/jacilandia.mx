export enum ViewState {
  HOME = 'HOME',
  ABOUT = 'ABOUT',
  METHODOLOGY = 'METHODOLOGY',
  TESTIMONIALS = 'TESTIMONIALS',
  LOCATIONS = 'LOCATIONS',
  PRICING = 'PRICING',
  LEVELS = 'LEVELS',
  REGISTER = 'REGISTER'
}

export interface NavItem {
  label: string;
  view: ViewState;
}

export interface Testimonial {
  name: string;
  role: string;
  image: string;
  text: string;
  color: string;
}

export const DESIGN_SYSTEM = {
  tokens: {
    radius: {
      card: '2.5rem',
      container: '4rem',
      button: '1.25rem',
      full: '9999px',
    },
    blur: {
      standard: 'blur(20px)',
      deep: 'blur(40px)',
    },
    gutters: {
      section: 'py-20 md:py-32',
      container: 'px-6 md:px-12 lg:px-20',
    }
  },
  springs: {
    snappy: { type: 'spring', stiffness: 400, damping: 30, mass: 0.8 } as const,
    gentle: { type: 'spring', stiffness: 120, damping: 20, mass: 1 } as const,
    bouncy: { type: 'spring', stiffness: 500, damping: 15, mass: 0.5 } as const,
    projection: { type: 'spring', stiffness: 600, damping: 35, mass: 1.2 } as const,
    magnetic: { stiffness: 180, damping: 12, mass: 0.08 } as const,
    identity: { type: 'spring', stiffness: 300, damping: 30, mass: 1 } as const,
  },
  easings: {
    expo: [0.19, 1, 0.22, 1],
    smooth: [0.23, 1, 0.32, 1],
    outQuint: [0.22, 1, 0.36, 1],
  },
  animations: {
    fadeInUp: {
      initial: { opacity: 0, y: 15, scale: 0.98 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, y: -15, scale: 0.98 },
    },
  },
  layoutIds: {
    NAV_PILL: 'nav-active-indicator',
    BRAND_BADGE: 'brand-badge-main',
    BRAND_IDENTITY: 'jaci-brand-identity',
  },
  colors: {
    primary: '#25C0F4',
    pink: '#F472B6',
    yellow: '#FBBF24',
    purple: '#A78BFA',
    green: '#22C55E',
    slate: {
      900: '#0F172A',
      800: '#1E293B',
      500: '#64748B'
    }
  },
  physics: {
    magneticPull: 0.28,
  }
} as const;