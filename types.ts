
export enum ViewState {
  HOME = 'HOME',
  ABOUT = 'ABOUT',
  METHODOLOGY = 'METHODOLOGY',
  TESTIMONIALS = 'TESTIMONIALS',
  LOCATIONS = 'LOCATIONS',
  PRICING = 'PRICING',
  LEVELS = 'LEVELS',
  REGISTER = 'REGISTER',
  DASHBOARD = 'DASHBOARD'
}

export enum PerformanceProfile {
  LITE = 'LITE',
  HIGH = 'HIGH'
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
      section: 'py-24 md:py-32 lg:py-40',
      container: 'px-8 md:px-16 lg:px-24',
    }
  },
  typography: {
    h1: 'text-5xl md:text-7xl lg:text-[5.5rem] font-black font-display tracking-tight leading-[0.95]',
    h2: 'text-4xl md:text-6xl font-black font-display tracking-tight leading-[1]',
    h3: 'text-3xl md:text-5xl font-black font-display tracking-tight leading-[1.1]',
    body: 'text-lg md:text-xl text-slate-500 font-body leading-relaxed',
    label: 'text-[10px] font-black uppercase tracking-[0.2em] text-slate-400'
  },
  springs: {
    snappy: { type: 'spring', stiffness: 450, damping: 32, mass: 0.8 } as const,
    gentle: { type: 'spring', stiffness: 150, damping: 25, mass: 1 } as const,
    bouncy: { type: 'spring', stiffness: 500, damping: 20, mass: 0.6 } as const,
    projection: { type: 'spring', stiffness: 600, damping: 40, mass: 1.2 } as const,
    magnetic: { stiffness: 200, damping: 15, mass: 0.1 } as const,
    identity: { type: 'spring', stiffness: 400, damping: 30, mass: 1.2 } as const,
  },
  layoutIds: {
    NAV_PILL: 'nav-active-indicator',
    BRAND_IDENTITY: 'jaci-brand-identity',
    HERO_BADGE: 'hero-badge-projection',
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
    magneticPull: 0.32,
  }
} as const;