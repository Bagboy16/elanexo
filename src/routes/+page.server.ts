import { redirect, type Actions } from "@sveltejs/kit";
export const actions: Actions = {
    setUsername: async ({ request, locals }) => {
        const body = Object.fromEntries(await request.formData())
        console.log(body)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { data: up, error: err } = await locals.sb
            .from('profiles').update({
                'username': body.username,
                'updated_at': new Date(Date.now())
            }).eq('id', body.userid)
        if (err) { 
            console.log(err)
        }

        throw redirect(303, "/")
    },
}