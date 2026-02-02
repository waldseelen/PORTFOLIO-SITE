import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Deep Tech Backgrounds
                background: '#030014', // Rich Black
                'background-secondary': '#0F172A', // Deep Blue

                // Primary: Pastel Cyan (Soft Tech)
                primary: {
                    50: '#ecfeff',
                    100: '#cffafe',
                    200: '#a5f3fc',
                    300: '#67e8f9',
                    400: '#22d3ee',
                    500: '#06b6d4',
                    600: '#67e8f9', // Pastel Cyan Main (was #00F0FF)
                    700: '#22d3ee', // Hover State
                    800: '#155e75',
                    900: '#164e63',
                    950: '#083344',
                },

                // Secondary: Pastel Purple (AI)
                secondary: {
                    50: '#faf5ff',
                    100: '#f3e8ff',
                    200: '#e9d5ff',
                    300: '#d8b4fe',
                    400: '#c084fc',
                    500: '#a855f7',
                    600: '#d8b4fe', // Pastel Purple Main (was #7000FF)
                    700: '#c084fc', // Hover State
                    800: '#6b21a8',
                    900: '#581c87',
                    950: '#3b0764',
                },

                // Accent: Pastel Green (Security)
                accent: {
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    200: '#bbf7d0',
                    300: '#86efac',
                    400: '#4ade80',
                    500: '#6ee7b7', // Pastel Green Main (was #0AFF99)
                    600: '#34d399',
                    700: '#047857',
                    800: '#065f46',
                    900: '#064e3b',
                    950: '#022c22',
                },

                neutral: {
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a',
                    950: '#020617',
                },
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
                mono: ['var(--font-jetbrains-mono)', 'monospace'],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                'cyber-grid': 'linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out forwards',
                'fade-up': 'fadeUp 0.6s ease-out forwards',
                'pulse-slow': 'pulse 3s infinite',
                'border-beam': 'borderBeam 4s linear infinite',
                'glow-pulse': 'glowPulse 2s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                fadeUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                borderBeam: {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(100%)' },
                },
                glowPulse: {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(103, 232, 249, 0.2)' }, // Pastel Cyan
                    '50%': { boxShadow: '0 0 40px rgba(103, 232, 249, 0.5)' },
                },
            },
            boxShadow: {
                'neon': '0 0 10px rgba(103, 232, 249, 0.5), 0 0 20px rgba(103, 232, 249, 0.3)', // Pastel Cyan
                'neon-purple': '0 0 10px rgba(216, 180, 254, 0.5), 0 0 20px rgba(216, 180, 254, 0.3)', // Pastel Purple
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            },
        },
    },
    plugins: [require('@tailwindcss/typography')],
};

export default config;
