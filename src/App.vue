<template>
  <div id="app">
    <router-view/>
  </div>
</template>


<script>
import { CometChat } from "@cometchat-pro/chat";

import "./App.css";

export default {
  data() {
    return {};
  },
  created() {
    this.initializeApp();
  },
  methods: {
    initializeApp() {
      var appID = process.env.VUE_APP_COMMETCHAT_APP_ID;

      CometChat.init(appID).then(
        () => {
          console.log("Initialization completed successfully");
        },
        error => {
          console.log("Initialization failed with error:", error);
        }
      );
    }
  }
};
</script>