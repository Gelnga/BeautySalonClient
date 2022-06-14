import type { IJWTResponse } from "@/domain/IJWTResponse";
import { IdentityService } from "@/services/IdentityService";
import { useIdentityStore } from "@/stores/Identity";

export default class LogIn {

    identityStore = useIdentityStore()
    identityService = new IdentityService()

    async login(email: string, password: string): Promise<IJWTResponse | null> {

        let res = await this.identityService.Login(email, password)
        console.log(res);

        if (res.data != null) {
            this.identityStore.$state.jwt = res.data!
            return res.data
        }

        return null
    }
}