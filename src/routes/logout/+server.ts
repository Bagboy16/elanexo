import { error, redirect, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({locals}) => {
    const { error: err } = await locals.sb.auth.signOut()
    if (err) {
        throw error(500, {
            message: 'Algo ha salido mal. Error: ' + err.message
        })
    }
    throw redirect(303, "/")
};