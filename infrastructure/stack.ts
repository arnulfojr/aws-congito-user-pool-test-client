import * as cdk from "@aws-cdk/core";
import * as cognito from "@aws-cdk/aws-cognito";

const EMAIL_BODY = `
Code: {####}
Username: {username}
`;

export default class AppStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    const userPool = new cognito.UserPool(this, "UserPool", {
      selfSignUpEnabled: false,
      signInAliases: {
        email: true,
      },
      requiredAttributes: {
        email: true,
        fullname: true, // our client will try to update this requiredAttribute
      },
      userInvitation: {
        emailSubject: "Welcome!",
        emailBody: EMAIL_BODY,
      },
      autoVerify: {
        email: true,
      },
      mfa: cognito.Mfa.OFF,
    });

    const client = userPool.addClient("web-app-client", {
      authFlows: {
        userSrp: true,
        userPassword: true,
        refreshToken: true,
      },
    });

    // eslint-disable-next-line no-new
    new cdk.CfnOutput(this, "UserPoolClientId", {
      value: client.userPoolClientId,
    });

    // eslint-disable-next-line no-new
    new cdk.CfnOutput(this, "UserPoolId", {
      value: userPool.userPoolId,
    });
  }
}
