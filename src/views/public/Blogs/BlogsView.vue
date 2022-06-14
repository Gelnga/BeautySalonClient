<template>
    <div class="blogPostsContainer p-5">
        <template v-if="blogsStore.blogPosts.length == 0">
            <h1 class="h1">There is no blogposts yet</h1>
        </template>
        <div v-for="post of blogsStore.blogPosts" class="card m-2" style="width: 18rem;">
            <div class="card-body">
                <h5 class="card-title">{{ post.name }}</h5>
                <h6 class="card-subtitle mb-2 text-muted">Posted by {{ post.workerName }}</h6>
                <p class="card-text">{{ post.content }}</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import "@/style/views/Blogs/blogpostsview.css";
</style>

<script lang="ts">
import blogPostService from "@/services/BlogPostService";
import { useBlogPostsStore } from "@/stores/BlogPosts";
import { Vue } from "vue-class-component";

export default class BlogsView extends Vue {
    blogsService = new blogPostService(this.$cookies)
    blogsStore = useBlogPostsStore()

    async mounted() {
        this.blogsService = new blogPostService(this.$cookies)
        this.blogsStore.blogPosts = await this.blogsService.getAll()
    }
}
</script>