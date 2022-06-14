<template>
    <div class="d-flex flex-column align-items-center">
        <h1 class="h1 d-flex justify-content-center p-3">My blogposts</h1>
        <RouterLink to="/createblog" class="noselect button-highlighted w-25 p-3">Add new blog post</RouterLink>
        <div class="blogPostsContainer p-3">
            <div v-for="post of blogsStore.blogPosts" class="card m-2" style="width: 18rem;">
                <div class="card-body">
                    <h5 class="card-title">{{ post.name }}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">Posted by {{ post.workerName }}</h6>
                    <p class="card-text">{{ post.content }}</p>
                </div>
                <div class="d-flex justify-content-between p-1">
                    <button class="button-highlighted cardLink" @click="deleteBlog(post.id!)">Delete blog</button>
                    <RouterLink class="button-highlighted cardLink" :to="{ name: 'updateblog', params: { id: post.id }}">Edit blog</RouterLink>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import "@/style/views/Blogs/workerblogs.css";
</style>

<script lang="ts">
import blogPostService from "@/services/BlogPostService";
import workerService from "@/services/WorkerService";
import { useBlogPostsStore } from "@/stores/BlogPosts";
import { Options, Vue } from "vue-class-component";
import { RouterLink } from "vue-router";

@Options({
    components: { RouterLink }
})
export default class WorkerBlogs extends Vue {
    blogsStore = useBlogPostsStore()
    workerService = new workerService(this.$cookies)
    blogsService = new blogPostService(this.$cookies)

    async mounted() {
        this.workerService = new workerService(this.$cookies)
        this.blogsService = new blogPostService(this.$cookies)
        this.blogsStore.blogPosts = await this.blogsService.getPrivateBlogPosts()
    }

    async deleteBlog(id: string): Promise<void> {
        this.blogsStore.blogPosts = this.blogsStore.blogPosts.filter((blogPost) => {return blogPost.id != id})
        await this.blogsService.delete(id)
    }
}
</script>