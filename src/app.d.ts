// See https://svelte.dev/docs/kit/types#app.d.ts
import type { SupabaseClient, Session, User } from '@supabase/supabase-js';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			supabase: SupabaseClient | null;
			getSession: () => Promise<Session | null>;
			getUser: () => Promise<User | null>;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	interface Window {
		grecaptcha: {
			ready: (cb: () => void) => void;
			execute: (siteKey: string, options: { action: string }) => Promise<string>;
		};
	}
}

export {};
