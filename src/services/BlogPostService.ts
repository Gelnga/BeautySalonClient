import type { IBlogPost } from "@/domain/IBlogPost";
import httpClient from "@/http-client";
import type { VueCookies } from "vue-cookies";
import { BaseService } from "./BaseService";

export default class blogPostService extends BaseService<IBlogPost> {
    constructor(cookies: VueCookies) {
        super("blogPosts", cookies);
    }

    async getPrivateBlogPosts(): Promise<IBlogPost[]> {
        try {
            this.refreshIdentity()
            let response = await httpClient.get(`${this.path}/private`, {
                headers: {
                    "Authorization": "bearer " + this.identityStore.$state.jwt?.jwt
                }
            })
            let res = response.data as IBlogPost[]
            console.log(res)
            return res

        } catch (e) {

            console.log(e)
            return []

        }
    }
}