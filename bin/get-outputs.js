#!/usr/bin/env node
const AWS = require("aws-sdk");
const StackOutputDescriber = require("./fetch-outputs");

if (process.env.DEBUG || process.env.NODE_ENV === "develop") {
  AWS.config.logger = console;
}

const cloudformation = new AWS.CloudFormation();
const outputdescriber = new StackOutputDescriber(cloudformation);

outputdescriber
  .queryAll([process.env.CDK_STACK_NAME])
  .then((outputs) => console.log(JSON.stringify(outputs)))
  .catch((err) => console.error(JSON.stringify(err)));
