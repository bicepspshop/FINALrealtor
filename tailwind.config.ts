import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: "#F0F7FF",
          100: "#E0EFFF",
          200: "#C0DFFF",
          300: "#92C5FF",
          400: "#5AA9FF",
          500: "#3085FF",
          600: "#1C64F2",
          700: "#1A56DB",
          800: "#1E429F",
          900: "#192C69",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        dark: {
          50: "#141414",
          100: "#0D0D0D",
          "charcoal": "#121212", // Deep Charcoal
          "slate": "#292929",    // Dark Slate
          "graphite": "#1E1E1E", // Graphite
        },
        light: {
          100: "#FFFFFF",
          200: "#F5F5F5",
          300: "#E5E5E5",
          400: "#CCCCCC",
          500: "#999999",
        },
        luxury: {
          black: "#1A1A1A",
          darkGray: "#333333",
          gold: "#D4AF37",        // Original gold (for light mode)
          goldMuted: "#A38829",   // Original soft gold (for light mode)
          lightGold: "#F5EDD7",   // Original light gold (for light mode)
          silver: "#C0C0C0",
          silverMuted: "#A9A9A9", // Darker silver for hover states
          cream: "#FFFDD0",
          royalBlue: "#185ADB",   // Brighter, more visible royal blue (for dark mode)
          royalBlueMuted: "#2269E8", // Slightly lighter blue for hover states (dark mode)
          moonstone: "#FFFFF0",   // Ivory color for text (dark mode)
          moonstoneMuted: "#F5F5DC", // Slightly darker ivory for secondary text (dark mode)
          metallic: "#D3D4D9"      // Soft metallic silver tone for backgrounds
        },
        // New luxury colors for v2 design
        gold: {
          DEFAULT: "#D4AF37",
          light: "#F0E68C",
          dark: "#B8860B",
          muted: "#C8A951",
        },
        emerald: {
          DEFAULT: "#50C878",
          light: "#77DD77",
          dark: "#03A678",
        },
        navy: {
          DEFAULT: "#000080",
          light: "#000D5C",
          dark: "#000435",
        },
        aqua: {
          DEFAULT: "#71D4FF",
          light: "#A5E1FF",
          dark: "#0892D0",
          muted: "#89CFF0",
        },
        success: {
          DEFAULT: "#2D9D78", // Emerald
        },
        warning: {
          DEFAULT: "#E6B455", // Amber
        },
        error: {
          DEFAULT: "#CF4F65", // Ruby
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        card: "0 4px 12px rgba(0, 0, 0, 0.4)",
        glow: "0 0 8px 2px rgba(67, 112, 255, 0.3)",
        subtle: "0 2px 10px rgba(0, 0, 0, 0.08)",
        elegant: "0 8px 30px rgba(0, 0, 0, 0.12)",
        luxury: "0 10px 50px rgba(0, 0, 0, 0.08)",
        "elegant-dark": "0 8px 30px rgba(0, 0, 0, 0.8)",
        "luxury-dark": "0 10px 50px rgba(0, 0, 0, 0.5)",
        "gold-glow": "0 0 15px rgba(212, 175, 55, 0.3)",
        "royal-glow": "0 0 15px rgba(65, 105, 225, 0.3)",
        "aqua-glow": "0 0 15px rgba(113, 212, 255, 0.3)",
        "emerald-glow": "0 0 15px rgba(80, 200, 120, 0.3)",
      },
      fontFamily: {
        sans: ['LTSuperior', 'Inter', 'sans-serif'],
        serif: ['NTSomic', 'Playfair Display', 'serif'],
        display: ['NTSomic', 'Montserrat', 'sans-serif'],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #D4AF37 0%, #F5EDD7 50%, #D4AF37 100%)",
        "royal-gradient": "linear-gradient(135deg, #4169E1 0%, #7EB6FF 50%, #4169E1 100%)",
        "silver-gradient": "linear-gradient(135deg, #C0C0C0 0%, #E8E8E8 50%, #C0C0C0 100%)",
        "dark-gradient": "linear-gradient(135deg, #121212 0%, #1E1E1E 100%)",
        "aqua-gradient": "linear-gradient(135deg, #0892D0 0%, #71D4FF 50%, #0892D0 100%)",
        "emerald-gradient": "linear-gradient(135deg, #03A678 0%, #50C878 50%, #03A678 100%)",
        "luxury-dark": "linear-gradient(135deg, #0D0D0D 0%, #1A1A1A 100%)",
        "gradient-conic": "conic-gradient(var(--tw-gradient-stops))",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-in-out",
        "fade-in-up": "fade-in-up 0.7s ease-out",
        "scale-in": "scale-in 0.5s ease-in-out",
        "slide-in-right": "slide-in-right 0.6s ease-out",
        "slide-in-left": "slide-in-left 0.6s ease-out",
        "golden-pulse": "golden-pulse 3s ease-in-out infinite",
        "shine": "shine 1.5s ease-in-out infinite",
        "border-flow": "border-flow 2s ease-in-out infinite",
        "luxury-float": "luxury-float 3s ease-in-out infinite",
        "width-change": "width 4s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        "fade-in-up": {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        "scale-in": {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        "slide-in-right": {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        "slide-in-left": {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        "golden-pulse": {
          '0%, 100%': { boxShadow: '0 0 0 rgba(212, 175, 55, 0)' },
          '50%': { boxShadow: '0 0 15px rgba(212, 175, 55, 0.5)' },
        },
        "royal-pulse": {
          '0%, 100%': { boxShadow: '0 0 0 rgba(65, 105, 225, 0)' },
          '50%': { boxShadow: '0 0 15px rgba(65, 105, 225, 0.5)' },
        },
        "width": {
          '0%': { width: '0' },
          '50%': { width: '100%' },
          '100%': { width: '30%' },
        },
        "translateX": {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        "shine": {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        "border-flow": {
          '0%, 100%': { borderColor: 'rgba(212, 175, 55, 0.3)' },
          '50%': { borderColor: 'rgba(212, 175, 55, 0.8)' },
        },
        "luxury-float": {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config