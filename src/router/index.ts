import AppointmentView from "@/views/public/AppointmentView.vue";
import AddBlog from "@/views/public/Blogs/AddBlog.vue";
import BlogsView from "@/views/public/Blogs/BlogsView.vue";
import UpdateBlog from "@/views/public/Blogs/UpdateBlog.vue";
import WorkerBlogs from "@/views/public/Blogs/WorkerBlogs.vue";
import HomeView from "@/views/public/HomeView.vue";
import SalonServicesView from "@/views/public/SalonServicesView.vue";
import SalonsView from "@/views/public/SalonsView.vue";
import UserProfileView from "@/views/public/UserProfileView.vue";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/salons",
      name: "salons",
      component: SalonsView,
    },
    {
      path: "/salons/:id",
      name: "salonServices",
      component: SalonServicesView,
      props: true
    },
    {
      path: "/appointmentbooking",
      name: "appointments",
      component: AppointmentView,
      props: true
    },
    {
      path: "/profile",
      name: "userProfile",
      component: UserProfileView,
    },
    {
      path: "/blogs",
      name: "blogs",
      component: BlogsView
    },
    {
      path: "/workerblogs",
      name: "workerblogs",
      component: WorkerBlogs
    },
    {
      path: "/createblog",
      name: "createblog",
      component: AddBlog
    },
    {
      path: "/updateblog",
      name: "updateblog",
      component: UpdateBlog,
      props: true
    }
  ],
});

export default router;
