import { AuthApiError } from "@supabase/supabase-js";
import { error, redirect} from "@sveltejs/kit";
import type { Actions } from "./$types";


export const actions: Actions = {
    register: async ({ request, locals }) => {
        const body = Object.fromEntries(await request.formData())
        if (body.email === undefined && body.password === undefined) { 
            throw error(400, {
                message: "Los campos no pueden estar vacíos"
            })
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { data, error: err } = await locals.sb.auth.signUp({
            email: body.email as string,
            password: body.password as string,
        })  
        if (err) { 
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