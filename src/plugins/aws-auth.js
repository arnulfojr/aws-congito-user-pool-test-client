import Auth from "@aws-amplify/auth";

// These are the variables exposed during build process
Auth.configure({
  region: process.env.VUE_APP_AWS_REGION,
  userPoolId: process.env.VUE_APP_AWS_USER_POOL_ID,
  userPoolWebClientId: process.env.VUE_APP_AWS_USER_POOL_CLIENT_ID,
});
