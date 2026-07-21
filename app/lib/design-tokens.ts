// app/lib/design-tokens.ts

/* ===========================
   COLORS
=========================== */

export const colors = {
  // Backgrounds
  background: "bg-white",
  backgroundAlt: "bg-slate-50",

  surface: "bg-white",
  surfaceDark: "bg-slate-800",
  footer: "bg-slate-900",

  // Borders
  border: "border-slate-200",
  borderLight: "border-slate-100",
  borderDark: "border-slate-700",

  // Text
  text: "text-slate-900",
  textSecondary: "text-slate-700",
  textMuted: "text-slate-600",
  textLight: "text-slate-400",
  textInverse: "text-white",

  // Brand
  brand: "bg-emerald-600",
  brandHover: "hover:bg-emerald-700",
  brandText: "text-emerald-600",
  brandBorder: "border-emerald-600",

  // Badge
  badge: "bg-emerald-50 text-emerald-700",
  badgeDark: "bg-emerald-950/60 text-emerald-400 border border-emerald-800",

  // Gradients
  heroGradient: "bg-gradient-to-b from-white via-slate-50 to-white",
};

/* ===========================
   SHADOWS
=========================== */

export const shadows = {
  card: "shadow-sm",
  hover: "shadow-md",
  floating: "shadow-xl",
  hero: "shadow-2xl",
};

/* ===========================
   BORDER RADIUS
=========================== */

export const radius = {
  sm: "rounded-lg",
  md: "rounded-xl",
  lg: "rounded-2xl",
  xl: "rounded-3xl",
  full: "rounded-full",
};

/* ===========================
   TYPOGRAPHY
=========================== */

export const typography = {
  hero: "text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight",

  title: "text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight",

  subtitle: "text-lg sm:text-xl text-slate-600",

  body: "text-base leading-7 text-slate-600",

  bodySmall: "text-sm leading-6 text-slate-600",

  cardTitle: "text-xl font-bold",

  cardBody: "text-sm leading-7 text-slate-600",

  badge: "text-xs font-semibold uppercase tracking-wider",

  caption: "text-xs text-slate-500",
};

/* ===========================
   SPACING
=========================== */

export const spacing = {
  hero: "py-20 lg:py-28",

  section: "py-24 lg:py-32",

  container: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",

  containerMd: "mx-auto max-w-5xl px-4 sm:px-6 lg:px-8",

  containerSm: "mx-auto max-w-3xl px-4 sm:px-6 lg:px-8",

  cardPadding: "p-6",

  cardPaddingLg: "p-8",

  cardPaddingXl: "p-10",

  gap: "gap-8",
};

/* ===========================
   COMPONENT STYLES
=========================== */

export const components = {
  badge:
    "inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider",

  button:
    "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200",

  card: "border bg-white",

  darkCard: "border border-slate-700 bg-slate-800/90",

  sectionHeading: "mx-auto max-w-2xl text-center",

  sectionBody: "mx-auto mt-4 max-w-2xl",
};

/* ===========================
   MOTION
=========================== */

export const fadeUp = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export const scaleIn = {
  hidden: {
    opacity: 0,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    scale: 1,
  },
};

export const transition = {
  default: {
    duration: 0.5,
  },

  slow: {
    duration: 0.8,
  },

  stagger: {
    staggerChildren: 0.15,
  },
};
export const icon = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",

  container: "flex items-center justify-center rounded-xl",

  emerald: "bg-emerald-100 text-emerald-600",

  white: "bg-white text-slate-700",
};
export const gradients = {
  section: "bg-gradient-to-b from-white via-emerald-50/40 to-white",

  hero: "bg-gradient-to-br from-emerald-50 via-transparent to-cyan-50",

  dark: "bg-gradient-to-r from-emerald-500 via-green-500 to-cyan-500",
};
