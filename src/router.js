import VueRouter from "vue-router";
import HelloWorld from "./components/HelloWorld.vue";

const routes = [
  {
    path: "/",
    component: HelloWorld,
  },
  {
    path: "*",
    redirect: "/"
  }
];

export default new VueRouter({
  routes,
  mode: "history"
});
