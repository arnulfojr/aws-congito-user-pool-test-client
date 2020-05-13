import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import AppStack from "./stack";

const app = new cdk.App();

// AWS Cognito is not available everywhere!
// us-east-1
console.log(`Region: ${process.env.AWS_REGION}`);

// eslint-disable-next-line no-new
new AppStack(app, "UserPoolTestStack", {
  env: { region: process.env.AWS_REGION },
});
