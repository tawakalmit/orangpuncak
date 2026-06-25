import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				brand: {
					DEFAULT: '#3E797C',
					dark: '#336366'
				},
				cream: '#FAECD9',
				accent: {
					DEFAULT: '#F1C40F',
					alt: '#F9C74F'
				},
				surface: '#FFFFFF',
				muted: '#ecf0f1',
				ink: '#2c3e50'
			},
			fontFamily: {
				heading: ['Poppins', 'system-ui', 'sans-serif'],
				body: ['Inter', 'system-ui', 'sans-serif'],
				logo: ['Caveat', 'cursive']
			},
			maxWidth: {
				content: '1500px',
				banner: '1600px'
			}
		}
	},
	plugins: [typography]
};
