<template>
  <div class="home">
     <div id="nav">
       <button class="btn btn-success" @click="logoutUser">Logout</button> 
    </div>

    <div class="form-group">
      <div class="form-group">
        <p>Welcome <b>{{ this.username}}</b>, your UID is <b>{{ this.uid }}</b> <br>
        Enter the receiver Id to start a chat </p>
        <p v-if="error">
          <b class="text-danger"> Receiver ID is required </b>
        </p>
        <input type="text" class="form-control" placeholder="Enter receiver UID" v-model="receiver_id">
      </div>
      

      <button  @click="startVideoChat" class="btn btn-secondary"> Start Call <span v-if="showSpinner" class="fa fa-spin fa-spinner"></span> </button>
      <button class="btn btn-success" @click="acceptCall">Accept Call</button>  
    </div>

    <div id="callScreen"></div>
  </div>
</template>

<script>
//Get login user from comet chat

// @ is an alias to /src
import { CometChat } from "@cometchat-pro/chat";

export default {
  name: "home",
  data() {
    return {
      username: "",
      uid: "",
      session_id: "",
      receiver_id: null,
      error: false,
      showSpinner: false
    };
  },
  created() {
    this.getLoggedInUser();

    var listnerID = "UNIQUE_LISTENER_ID";
    CometChat.addCallListener(
      listnerID,
      new CometChat.CallListener({
        onIncomingCallReceived(call) {
          console.log("Incoming call:", call);
          this.session_id = call.sessionId;
        },
        onOutgoingCallAccepted(call) {
          console.log("Outgoing call accepted:", call);
          CometChat.startCall(
            call.sessionId,
            document.getElementById("callScreen"),
            new CometChat.OngoingCallListener({
              onUserJoined: user => {
                /* Notification received here if another user joins the call. */
                console.log("User joined call:", user);
                /* this method can be use to display message or perform any actions if someone joining the call */
              },
              onUserLeft: user => {
                /* Notification received here if another user left the call. */
                console.log("User left call:", user);
                /* this method can be use to display message or perform any actions if someone leaving the call */
              },
              onCallEnded: call => {
                /* Notification received here if current ongoing call is ended. */
                console.log("Call ended:", call);
                /* hiding/closing the call screen can be done here. */
              }
            })
          );
          // Outgoing Call Accepted
        },
        onOutgoingCallRejected(call) {
          console.log("Outgoing call rejected:", call);
          // Outgoing Call Rejected
        },
        onIncomingCallCancelled(call) {
          console.log("Incoming call calcelled:", call);
        }
      })
    );
  },
  methods: {
    getLoggedInUser() {
      var user = CometChat.getLoggedinUser().then(
        user => {
          this.username = user.name;
          this.uid = user.uid;
          console.log("Users details:", { user });
        },
        error => {
          console.log("Error getting details:", { error });
          this.$router.push({ name: "homepage" });
        }
      );
    },

    logoutUser() {
      CometChat.logout().then(
        success => {
          console.log("Logout completed successfully");
          this.$router.push({ name: "homepage" });
        },
        error => {
          //Logout failed with exception
          console.log("Logout failed with exception:", { error });
        }
      );
    },

    startVideoChat() {
      if (!this.receiver_id) this.error = true;
      this.showSpinner = true;

      var receiverID = this.receiver_id;
      var callType = CometChat.CALL_TYPE.VIDEO;
      var receiverType = CometChat.RECEIVER_TYPE.USER;

      var call = new CometChat.Call(receiverID, callType, receiverType);

      CometChat.initiateCall(call).then(
        outGoingCall => {
          this.showSpinner = false;
          console.log("Call initiated successfully:", outGoingCall);
          // perform action on success. Like show your calling screen.
        },
        error => {
          console.log("Call initialization failed with exception:", error);
        }
      );
    },
    acceptCall() {
      // var sessionID = "SESSION_ID";

      CometChat.acceptCall(this.session_id).then(
        call => {
          console.log("Call accepted successfully:", call);
          // start the call using the startCall() method
          CometChat.startCall(
            call.sessionId,
            document.getElementById("callScreen"),
            new CometChat.OngoingCallListener({
              onUserJoined: user => {
                /* Notification received here if another user joins the call. */
                console.log("User joined call:", user);
                /* this method can be use to display message or perform any actions if someone joining the call */
              },
              onUserLeft: user => {
                /* Notification received here if another user left the call. */
                console.log("User left call:", user);
                /* this method can be use to display message or perform any actions if someone leaving the call */
              },
              onCallEnded: call => {
                /* Notification received here if current ongoing call is ended. */
                console.log("Call ended:", call);
                /* hiding/closing the call screen can be done here. */
              }
            })
          );
        },
        error => {
          console.log("Call acceptance failed with error", error);
          // handle exception
        }
      );
    }
  }
};
</script>