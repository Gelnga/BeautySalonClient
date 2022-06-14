import type { IJWTResponse } from "@/domain/IJWTResponse";
import { IdentityService } from "@/services/IdentityService";
import { useIdentityStore } from "@/stores/Identity";

export default class Register {

    identityStore = useIdentityStore()
    identityService = new IdentityService()

    async register(email: string, password: string, firstName: string, lastName: string): Promise<IJWTResponse | null>{

        let res = await this.identityService.Register(email, password, firstName, lastName)
        console.log(res);

        if (res.data != null) {
            this.identityStore.$state.jwt = res.data!
            return res.data;
        }

        return null
    }
}