/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		color: {
  			grayCustom: '#ABABAB',
  			softRed: '#FF5E5E',
  			oceanBlue: '#3498DB',
  			limeGreen: '#0DC657',
  			dangerRed: '#FF3737',
  			amberYellow: '#F39C12',
  			forestGreen: '#0D7F56',
  			lightGrayBg: '#F2F3F7'
  		},
  		boxShadow: {
  			customPositive: '6px 6px 20px  rgba(0, 0, 0, 0.25)'
  		},
  		colors: {
  			grayCustom: '#757575',
  			softRed: '#FF5E5E',
  			oceanBlue: '#3498DB',
  			limeGreen: '#0DC657',
  			dangerRed: '#FF3737',
  			amberYellow: '#F39C12',
  			forestGreen: '#0D7F56',
  			lightGrayBg: '#F2F3F7',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontFamily: {
  			primary: [
  				'Inter',
  				'sans-serif'
  			],
  			logo: [
  				'Lilita One"',
  				'cursive'
  			]
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}

