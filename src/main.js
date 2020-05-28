import Vue from "vue";
import App from "./App.vue";
import "./plugins/aws-auth";
import "./plugins/vue-router";
import router from "./router";

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
  router,
}).$mount("#app");
