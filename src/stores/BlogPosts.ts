import type { IAppUser } from "@/domain/IAppUser";
import type { IBlogPost } from "@/domain/IBlogPost";
import { defineStore } from "pinia";

export const useBlogPostsStore = defineStore({
    id: "blogPosts",
    state: () => ({
        blogPosts: [] as IBlogPost[]
    }),
});