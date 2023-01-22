import { AuthApiError } from "@supabase/supabase-js";
import { error, redirect, type Actions } from "@sveltejs/kit";

export const actions: Actions = {
    login: async ({ request, locals }) => {
        const body = Object.fromEntries(await request.formData())

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { data, error: err } = await locals.sb.auth.signInWithPassword({
			email: body.email as string,
			password: body.password as string,
		})
        if (err) {
            console.error(err)
            if (err instanceof AuthApiError && err.status !== 500) {
                throw error(err.status, {
                    message: err.message
                })
            }
            throw error(500, {
                message: `Error del servidor, intente de nuevo. Si el error persiste, porfavor reportar al Administrador. Error: ${err.message}(${err.code})`
            })
        }
        throw redirect(303, "/")
    }
    
};