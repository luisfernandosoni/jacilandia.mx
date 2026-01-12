
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

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
}

export const VIEW_THEMES: Record<ViewState, ThemeColors> = {
  [ViewState.HOME]: { primary: 'rgba(37, 192, 244, 0.12)', secondary: 'rgba(244, 114, 182, 0.12)', accent: 'rgba(251, 191, 36, 0.08)' },
  [ViewState.ABOUT]: { primary: 'rgba(167, 139, 250, 0.12)', secondary: 'rgba(37, 192, 244, 0.1)', accent: 'rgba(244, 114, 182, 0.05)' },
  [ViewState.METHODOLOGY]: { primary: 'rgba(251, 191, 36, 0.12)', secondary: 'rgba(244, 114, 182, 0.12)', accent: 'rgba(37, 192, 244, 0.1)' },
  [ViewState.LEVELS]: { primary: 'rgba(167, 139, 250, 0.15)', secondary: 'rgba(37, 192, 244, 0.1)', accent: 'rgba(34, 197, 94, 0.1)' },
  [ViewState.TESTIMONIALS]: { primary: 'rgba(244, 114, 182, 0.15)', secondary: 'rgba(167, 139, 250, 0.1)', accent: 'rgba(37, 192, 244, 0.08)' },
  [ViewState.LOCATIONS]: { primary: 'rgba(37, 192, 244, 0.15)', secondary: 'rgba(251, 191, 36, 0.1)', accent: 'rgba(34, 197, 94, 0.05)' },
  [ViewState.PRICING]: { primary: 'rgba(244, 114, 182, 0.18)', secondary: 'rgba(167, 139, 250, 0.15)', accent: 'rgba(37, 192, 244, 0.1)' },
  [ViewState.REGISTER]: { primary: 'rgba(34, 197, 94, 0.12)', secondary: 'rgba(37, 192, 244, 0.1)', accent: 'rgba(244, 114, 182, 0.08)' },
  [ViewState.DASHBOARD]: { primary: 'rgba(15, 23, 42, 0.05)', secondary: 'rgba(37, 192, 244, 0.08)', accent: 'rgba(255, 255, 255, 0)' }
};

export const JACI_SQUAD = {
  BUW: "https://assets.jacilandia.mx/Buw.png",
  GRAPPY: "https://assets.jacilandia.mx/Grappy.png",
  GULY: "https://assets.jacilandia.mx/Guly.png",
  KIKIN: "https://assets.jacilandia.mx/Kikin.png",
  LY: "https://assets.jacilandia.mx/Ly.png",
  PEPE: "https://assets.jacilandia.mx/Pepe.png",
  POMPIN: "https://assets.jacilandia.mx/Pompín.png",
  POSITIVIN: "https://assets.jacilandia.mx/Positivin.png",
  POW: "https://assets.jacilandia.mx/Pow.png",
  TOMAS: "https://assets.jacilandia.mx/Tomás.png",
  TUFIN: "https://assets.jacilandia.mx/Tufín.png",
  TUI: "https://assets.jacilandia.mx/Tui.png"
} as const;

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
      section: 'py-[clamp(4rem,10vh,10rem)]',
      container: 'px-[clamp(1.25rem,5vw,6rem)]',
    }
  },
  typography: {
    h1: 'text-[clamp(2.5rem,5vw+1rem,5.5rem)] font-black font-display tracking-tight leading-[0.95] text-balance',
    h2: 'text-[clamp(2rem,4vw+1rem,3.75rem)] font-black font-display tracking-tight leading-[1] text-balance',
    h3: 'text-[clamp(1.5rem,3vw+1rem,3rem)] font-black font-display tracking-tight leading-[1.1] text-balance',
    body: 'text-[clamp(1rem,1vw+0.75rem,1.25rem)] text-slate-500 font-body leading-relaxed',
    label: 'text-[0.75rem] md:text-xs font-black uppercase tracking-[0.15em] text-slate-400' 
  },
  springs: {
    snappy: { type: 'spring', stiffness: 450, damping: 32, mass: 0.8 } as const,
    gentle: { type: 'spring', stiffness: 150, damping: 25, mass: 1 } as const,
    bouncy: { type: 'spring', stiffness: 500, damping: 20, mass: 0.6 } as const,
    projection: { type: 'spring', stiffness: 600, damping: 40, mass: 1.2 } as const,
    magnetic: { stiffness: 200, damping: 15, mass: 0.1 } as const,
    identity: { type: 'spring', stiffness: 400, damping: 30, mass: 1.2 } as const,
    float: { repeat: Infinity, repeatType: 'reverse', duration: 4, ease: "easeInOut" } as const,
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
    accessible: {
      primary: '#007B9E',
      pink: '#B51B68',
      yellow: '#926F00',
      purple: '#6D28D9',
      green: '#15803D'
    },
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
