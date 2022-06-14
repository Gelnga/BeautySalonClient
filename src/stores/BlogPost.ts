import type { IAppUser } from "@/domain/IAppUser";
import type { IBlogPost } from "@/domain/IBlogPost";
import { defineStore } from "pinia";

export const useBlogPostStore = defineStore({
    id: "blogPost",
    state: () => ({
        blogPost: {} as IBlogPost
    }),
});