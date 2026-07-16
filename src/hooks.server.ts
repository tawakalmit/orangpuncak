import { createServerClient } from '@supabase/ssr';
import { type Handle, redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';

const SUPABASE_URL = env.PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = env.PUBLIC_SUPABASE_ANON_KEY ?? '';
export const supabaseConfigured = !!SUPABASE_URL && SUPABASE_URL.startsWith('http') && !!SUPABASE_ANON_KEY;

export const handle: Handle = async ({ event, resolve }) => {
	if (!supabaseConfigured) {
		event.locals.supabase = null;
		event.locals.getSession = async () => null;
		event.locals.getUser = async () => null;

		// Tanpa Supabase, panel admin tidak bisa berfungsi.
		if (event.url.pathname.startsWith('/proplayer') && event.url.pathname !== '/proplayer/setup') {
			throw redirect(303, '/proplayer/setup');
		}
		return resolve(event);
	}

	event.locals.supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
		cookies: {
			getAll: () => event.cookies.getAll(),
			setAll: (cookiesToSet) => {
				cookiesToSet.forEach(({ name, value, options }) => {
					event.cookies.set(name, value, { ...options, path: '/' });
				});
			}
		}
	});

	event.locals.getUser = async () => {
		const {
			data: { user }
		} = await event.locals.supabase!.auth.getUser();
		return user;
	};

	event.locals.getSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase!.auth.getSession();
		if (!session) return null;
		// Validasi keaslian dengan getUser (anti session palsu)
		const {
			data: { user },
			error
		} = await event.locals.supabase!.auth.getUser();
		if (error || !user) return null;
		return session;
	};

	// Proteksi route admin
	if (event.url.pathname.startsWith('/proplayer') && event.url.pathname !== '/proplayer/login') {
		const user = await event.locals.getUser();
		if (!user) throw redirect(303, '/proplayer/login');
	}

	return resolve(event, {
		filterSerializedResponseHeaders: (name) => name === 'content-range' || name === 'x-supabase-api-version'
	});
};
