<template>
    <div id="auth">
        <div id="nav">
          <router-link to="/login">Login</router-link> |
        </div>
    
        <p> Enter your username to start video chat </p>

        <form v-on:submit.prevent="authLoginUser">
            <div class="form-group">
                <input name="username" id="username" class="form-control" placeholder="Enter your username" v-model="username"/>
            </div>

            <div class="form-group">
                <button type="submit" class="btn btn-success"> Login <span v-if="showSpinner" class="fa fa-spin fa-spinner"></span></button>
            </div>
        </form>
    </div>
</template>


<script>
import { CometChat } from "@cometchat-pro/chat";
export default {
  data() {
    return {
      username: "",
      showSpinner: false
    };
  },
  methods: {
    authLoginUser() {
      var appID = process.env.VUE_APP_COMMETCHAT_APP_ID;
      var apiKey = process.env.VUE_APP_COMMETCHAT_API_KEY;
      this.showSpinner = true;

      CometChat.login(this.username, apiKey).then(
        user => {
          this.showSpinner = false;
          this.$router.push({ name: "home" });
        },
        error => {
          this.showSpinner = false;
          console.log("Login failed with error:", error.code);
          // check error message and create a new user
        }
      );
    }
  }
};
</script>
