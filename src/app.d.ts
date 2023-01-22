// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	declare namespace App {
		// interface Error {}
		interface Locals { 
			sb: TypedSupabaseClient
			session: Session | null
		}
		// interface Locals {}
		interface PageData {
			session: import("@supabase/supabase-js").Session | null
		}
		// interface Platform {}
	}
}

export {};
