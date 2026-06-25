import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			// Node 22 punya WebSocket native (dibutuhkan @supabase/supabase-js)
			runtime: 'nodejs22.x'
		})
	}
};

export default config;
