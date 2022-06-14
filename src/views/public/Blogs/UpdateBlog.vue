<template>
    <div class="blogFormContainer">
        <form class="w-50 updateBlog">
            <div class="mb-3">
                <label for="blogName" class="form-label py-2"><span>Blog post name</span></label>
                <input v-model="blogPostName" type="text" class="form-control" id="blogName" required>
            </div>
            <div class="mb-3">
                <label for="blogContent" class="form-label py-2"><span>Blog post content</span></label>
                <textarea v-model="blogPostContent" class="form-control" id="blogContent" rows="5" placeholder="Post content" required></textarea>
            </div>
            <button type="submit" class="button-highlighted">Confirm edit</button>
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
import { Options, Vue } from "vue-class-component";

@Options({
    props: {
        id: String
    },
})
export default class UpdateBlog extends Vue {
    id!: String
    blogPostName: string = ""
    blogPostContent: string = ""

    appUserStore = useAppUserStore()
    blogPostStore = useBlogPostStore()
    blogPostService = new blogPostService(this.$cookies)

    async mounted() {
        console.log(this.id)
        this.blogPostService = new blogPostService(this.$cookies)
        let extracted = await this.blogPostService.get(this.id)

        this.blogPostStore.blogPost = {
            id: extracted.id,
            workerId: extracted.workerId,
            workerName: extracted.workerName,
            name: extracted.name,
            content: extracted.content,
            commentary: extracted.commentary
        }

        this.blogPostName = this.blogPostStore.blogPost.name!
        this.blogPostContent = this.blogPostStore.blogPost.content!
        this.setUpAddBlogForm()
    }

    setUpAddBlogForm(): void {
        let updateBlogForm = document.querySelector<HTMLFormElement>('.updateBlog')!

        // Bootstrap form custom validation
        updateBlogForm.addEventListener('submit', async (event: Event) => {
            event.preventDefault()
            event.stopPropagation()

            if (updateBlogForm.checkValidity()) {
                await this.blogPostService.put(this.id, {
                    id: this.id.toString(),
                    name: this.blogPostName,
                    content: this.blogPostContent,
                    workerId: this.appUserStore.appUser.workerId!,
                    commentary: null
                })

                updateBlogForm.reset()
                this.$router.push("/workerblogs")
                return
            }
            updateBlogForm.classList.add('was-validated')
        }, false)
    }
}
</script>