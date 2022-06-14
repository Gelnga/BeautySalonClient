<template>
    <div class="blogFormContainer">
        <form class="w-50 addBlog">
            <div class="mb-3">
                <label for="blogName" class="form-label py-2"><span>Blog post name</span></label>
                <input v-model="blogPostName" type="text" class="form-control" id="blogName" required>
            </div>
            <div class="mb-3">
                <label for="blogContent" class="form-label py-2"><span>Blog post content</span></label>
                <textarea v-model="blogPostContent" class="form-control" id="blogContent" rows="5" placeholder="Post content" required></textarea>
            </div>
            <button type="submit" class="button-highlighted">Create blogpost</button>
        </form>
    </div>
</template>

<style>
@import "@/style/views/Blogs/addblog.css";
</style>

<script lang="ts">
import blogPostService from "@/services/BlogPostService";
import { useAppUserStore } from "@/stores/AppUser";
import { useBlogPostStore } from "@/stores/BlogPost";
import { Vue } from "vue-class-component";

export default class AddBlog extends Vue {
    blogPostName: string = ""
    blogPostContent: string = ""

    appUserStore = useAppUserStore()
    blogPostService = new blogPostService(this.$cookies)

    async mounted() {
        this.blogPostService = new blogPostService(this.$cookies)
        this.setUpAddBlogForm()
    }

    setUpAddBlogForm(): void {
        let addBlogForm = document.querySelector<HTMLFormElement>('.addBlog')!

        // Bootstrap form custom validation
        addBlogForm.addEventListener('submit', async (event: Event) => {
            event.preventDefault()
            event.stopPropagation()

            if (addBlogForm.checkValidity()) {
                await this.blogPostService.add({
                    name: this.blogPostName,
                    content: this.blogPostContent,
                    workerId: this.appUserStore.appUser.workerId!,
                    commentary: null
                })

                addBlogForm.reset()
                this.$router.push("/workerblogs")
                return
            }
            addBlogForm.classList.add('was-validated')
        }, false)
    }
}
</script>