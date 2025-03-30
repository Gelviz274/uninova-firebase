import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			beige: '#FFEBCD',
			cafe: '#B7936F',
			blacku: '#0b0b0b',
			border: 'rgb(229 231 235)', // gray-200
			'dark-border': 'rgb(75 85 99)', // gray-600
			ring: 'rgb(156 163 175)' // gray-400
  		},
  		fontFamily: {
  			sans: 'var(--font-inter)',
  			mono: 'var(--font-space-mono)'
  		},
  		borderRadius: {
  			lg: '0.5rem',
  			md: '0.375rem',
  			sm: '0.25rem'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
