const AWS = require("aws-sdk");
const OutputDescriber = require("../../bin/fetch-outputs");

module.exports = function() {
  const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();
  const stackOutputDescriber = new OutputDescriber(new AWS.CloudFormation());

  return actor({
    async createUserWith({ username, password, phoneNumber }) {
      const { UserPoolId } = await stackOutputDescriber.queryAll([
        "UserPoolTestStack",
      ]);

      await cognitoIdentityServiceProvider
        .adminCreateUser({
          UserPoolId,
          Username: username,
          TemporaryPassword: password,
          UserAttributes: [
            {
              Name: "email",
              Value: username,
            },
            {
              Name: "email_verified",
              Value: "True",
            },
            {
              Name: "phone_number",
              Value: phoneNumber,
            },
            {
              Name: "phone_number_verified",
              Value: "True",
            },
          ],
        })
        .promise();
    },

    async deleteUser({ username }) {
      const { UserPoolId } = await stackOutputDescriber.queryAll([
        "UserPoolTestStack",
      ]);

      await cognitoIdentityServiceProvider
        .adminDisableUser({
          Username: username,
          UserPoolId,
        })
        .promise();

      await cognitoIdentityServiceProvider
        .adminDeleteUser({
          Username: username,
          UserPoolId,
        })
        .promise();
    },
  });
};
