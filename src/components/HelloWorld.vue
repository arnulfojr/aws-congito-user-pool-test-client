<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <div>
      <input type="email" v-model="email" placeholder="Email " />
    </div>
    <div>
      <input type="password" placeholder="Password" v-model="password" />
    </div>
    <div>
      <input v-model="name" placeholder="Set your name" type="text" />
    </div>
    <div>
      <button @click="authenticate">
        LogIn
      </button>
    </div>
    <div v-if="requiresNewPassword">
      <input
        placeholder="New Password"
        v-model="newPassword"
        type="password"
      />
    </div>
    <div v-if="requiresNewPassword">
      <button @click="setNewPassword">
        Change password and save info
      </button>
    </div>
  </div>
</template>

<script>
import Auth from "@aws-amplify/auth";

export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  data() {
    return {
      email: "",
      password: "",
      newPassword: "",
      name: "",
      user: null,
    };
  },
  computed: {
    requiresNewPassword() {
      return !!this.user && this.user.challengeName === "NEW_PASSWORD_REQUIRED";
    },
  },
  methods: {
    /* not used but just for completion */
    signUp() {
      Auth.signUp({
        username: this.email,
        password: this.password,
        attributes: {
          email: this.email,
          name: this.name,
        },
      })
        .then(user => (this.user = user))
        .catch(err => {
          alert(err);
          console.error(err);
        });
    },
    // @see https://docs.amplify.aws/lib/auth/manageusers/q/platform/js
    authenticate() {
      Auth.signIn({
        username: this.email,
        password: this.password,
      })
        .then(user => (this.user = user))
        .catch(err => {
          console.error(err);
          alert(err.message);
        });
    },
    setNewPassword() {
      const requiredParams = { name: this.name }; // CDK's fullname === name
      Auth.completeNewPassword(this.user, this.password, requiredParams)
        .then(user => (this.user = user))
        .catch(err => {
          // This call fails because the std attribute is not mutable
          console.error(err);
          alert(err);
        });
    },
    async changePassword() {
      await Auth.changePassword(this.user, this.password, this.newPassword);
      this.user = await Auth.currentAuthenticatedUser();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
